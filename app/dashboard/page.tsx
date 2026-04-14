import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getDomainColor, getDomainLabel, formatDate } from '@/lib/utils'
import Link from 'next/link'
import { DOMAINS } from '@/types'
import RecommendationsWidget from '@/components/dashboard/RecommendationsWidget'

export default async function DashboardPage() {
  const session = await auth()
  const userId = session!.user!.id as string

  // Fetch user data in parallel
  const [user, enrollments, assessmentResults, upcomingBookings] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true, membership: true },
    }),
    prisma.enrollment.findMany({
      where: { userId },
      include: { program: true },
      take: 4,
      orderBy: { enrolledAt: 'desc' },
    }),
    prisma.assessmentResult.findMany({
      where: { userId },
      include: { assessment: true },
      orderBy: { completedAt: 'desc' },
    }),
    prisma.booking.findMany({
      where: { userId, status: 'CONFIRMED', scheduledAt: { gte: new Date() } },
      include: { coach: { include: { user: true } } },
      take: 3,
      orderBy: { scheduledAt: 'asc' },
    }),
  ])

  const overallProgress = enrollments.length
    ? Math.round(enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length)
    : 0

  const stats = [
    { label: 'Programs Enrolled',       value: enrollments.length,          suffix: '',  color: '#B8973A' },
    { label: 'Assessments Completed',   value: assessmentResults.length,    suffix: '',  color: '#6B8F9E' },
    { label: 'Upcoming Sessions',       value: upcomingBookings.length,     suffix: '',  color: '#2C4A3E' },
    { label: 'Overall Progress',        value: overallProgress,             suffix: '%', color: '#B8973A' },
  ]

  // Identify completed domains
  const completedDomains = new Set(assessmentResults.map(r => r.assessment.domain))

  return (
    <div className="max-w-6xl mx-auto space-y-8">

      {/* Welcome banner */}
      <div className="bg-[#0A1628] rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_80%_50%,#1A2B4A,transparent)]" />
        <div className="absolute right-0 top-0 bottom-0 w-48 opacity-5"
          style={{ backgroundImage: 'linear-gradient(#B8973A 1px,transparent 1px),linear-gradient(90deg,#B8973A 1px,transparent 1px)', backgroundSize: '24px 24px' }}
        />
        <div className="relative z-10">
          <p className="text-[#B8973A] text-xs tracking-[0.2em] uppercase mb-2 font-medium">Your Journey</p>
          <h2 className="font-display text-3xl text-white font-light mb-3">
            Good to have you back, {user?.name?.split(' ')[0] ?? 'Member'}.
          </h2>
          <p className="text-white/50 text-sm max-w-lg">
            {assessmentResults.length === 0
              ? 'Start your journey by taking your first assessment. Discover where you are and where you can go.'
              : `You have completed ${assessmentResults.length} assessment${assessmentResults.length > 1 ? 's' : ''} and are ${overallProgress}% through your programs.`}
          </p>
          {assessmentResults.length === 0 && (
            <Link
              href="/dashboard/assessments"
              className="mt-5 inline-flex items-center gap-2 bg-[#B8973A] hover:bg-[#D4B05A] text-white text-sm font-medium px-5 py-2.5 rounded-full transition-colors"
            >
              Take First Assessment →
            </Link>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(stat => (
          <div key={stat.label} className="bg-white rounded-2xl border border-stone-100 p-6">
            <p className="text-stone-400 text-xs tracking-wide mb-3">{stat.label}</p>
            <p className="font-display text-4xl font-light text-[#0A1628]">
              {stat.value}<span className="text-xl" style={{ color: stat.color }}>{stat.suffix}</span>
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Platform journey */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-stone-100 p-6">
          <h3 className="font-display text-lg text-[#0A1628] mb-5">Your Platforms</h3>
          <div className="space-y-3">
            {DOMAINS.map(domain => {
              const done = completedDomains.has(domain.id as any)
              return (
                <div key={domain.id} className="flex items-center gap-3 p-3 rounded-xl border border-stone-100 hover:border-stone-200 transition-colors">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                    style={{ background: `${domain.color}15`, color: domain.color }}>
                    {domain.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#0A1628] text-sm font-medium truncate">{domain.name}</p>
                    <p className="text-stone-400 text-xs">{done ? 'Assessment done ✓' : 'Not started'}</p>
                  </div>
                  {!done && (
                    <Link href="/dashboard/assessments" className="text-xs text-[#B8973A] hover:underline flex-shrink-0">
                      Start
                    </Link>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Enrolled programs */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display text-lg text-[#0A1628]">Active Programs</h3>
            <Link href="/dashboard/programs" className="text-xs text-[#B8973A] hover:underline">View all</Link>
          </div>
          {enrollments.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-stone-400 text-sm mb-3">No programs yet.</p>
              <Link href="/dashboard/programs" className="text-xs bg-[#0A1628] text-white px-4 py-2 rounded-full hover:bg-[#1A2B4A] transition-colors">
                Browse Programs
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {enrollments.map(e => (
                <div key={e.id} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-sm"
                    style={{ background: `${getDomainColor(e.program.domain)}15`, color: getDomainColor(e.program.domain) }}>
                    ◈
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-[#0A1628] text-sm font-medium truncate pr-4">{e.program.title}</p>
                      <span className="text-xs text-stone-400 flex-shrink-0">{e.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${e.progress}%`, background: getDomainColor(e.program.domain) }}
                      />
                    </div>
                    <p className="text-stone-400 text-xs mt-1">{getDomainLabel(e.program.domain)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recommendations */}
      <RecommendationsWidget />

      {/* Upcoming sessions + recent assessments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Sessions */}
        <div className="bg-white rounded-2xl border border-stone-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display text-lg text-[#0A1628]">Upcoming Sessions</h3>
            <Link href="/dashboard/sessions" className="text-xs text-[#B8973A] hover:underline">View all</Link>
          </div>
          {upcomingBookings.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-stone-400 text-sm mb-3">No sessions booked yet.</p>
              <Link href="/dashboard/coaches" className="text-xs bg-[#0A1628] text-white px-4 py-2 rounded-full hover:bg-[#1A2B4A] transition-colors">
                Find a Coach
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingBookings.map(b => (
                <div key={b.id} className="flex items-center gap-4 p-3 rounded-xl bg-stone-50">
                  <div className="w-10 h-10 rounded-xl bg-[#0A1628]/8 flex items-center justify-center text-[#0A1628] flex-shrink-0">
                    ◉
                  </div>
                  <div>
                    <p className="text-[#0A1628] text-sm font-medium">{b.coach.user.name}</p>
                    <p className="text-stone-400 text-xs">{formatDate(b.scheduledAt)} · {b.duration} min</p>
                  </div>
                  <span className="ml-auto text-[10px] bg-green-50 text-green-600 border border-green-100 px-2 py-1 rounded-full">
                    Confirmed
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Assessment results */}
        <div className="bg-white rounded-2xl border border-stone-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display text-lg text-[#0A1628]">Recent Assessments</h3>
            <Link href="/dashboard/assessments" className="text-xs text-[#B8973A] hover:underline">View all</Link>
          </div>
          {assessmentResults.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-stone-400 text-sm mb-3">No assessments completed yet.</p>
              <Link href="/dashboard/assessments" className="text-xs bg-[#0A1628] text-white px-4 py-2 rounded-full hover:bg-[#1A2B4A] transition-colors">
                Take Assessment
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {assessmentResults.map(r => (
                <div key={r.id} className="flex items-center gap-4 p-3 rounded-xl bg-stone-50">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${getDomainColor(r.assessment.domain)}15`, color: getDomainColor(r.assessment.domain) }}>
                    ◎
                  </div>
                  <div className="flex-1">
                    <p className="text-[#0A1628] text-sm font-medium">{r.assessment.title}</p>
                    <p className="text-stone-400 text-xs">{formatDate(r.completedAt)}</p>
                  </div>
                  {r.score !== null && (
                    <div className="text-right">
                      <p className="font-display text-lg text-[#0A1628]">{r.score}</p>
                      <p className="text-stone-400 text-[10px]">score</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
