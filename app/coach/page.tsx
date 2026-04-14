import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { formatDate, getDomainColor, getDomainLabel } from '@/lib/utils'
import Link from 'next/link'

export default async function CoachDashboardPage() {
  const session = await auth()
  if (!session?.user) redirect('/auth/login')

  const userId = session.user.id as string
  const role   = (session.user as any).role

  // Only approved coaches
  const coach = await prisma.coach.findUnique({
    where: { userId },
    include: {
      user:         { select: { name: true, email: true } },
      availability: { where: { isActive: true }, orderBy: { dayOfWeek: 'asc' } },
    },
  })

  if (!coach || coach.status !== 'APPROVED') {
    redirect('/dashboard')
  }

  const [bookings, clients, programs] = await Promise.all([
    prisma.booking.findMany({
      where:   { coachId: coach.id },
      include: { user: { select: { name: true, email: true } } },
      orderBy: { scheduledAt: 'desc' },
      take:    20,
    }),
    prisma.booking.findMany({
      where:    { coachId: coach.id, status: 'COMPLETED' },
      select:   { userId: true },
      distinct: ['userId'],
    }),
    prisma.program.findMany({
      where:   { coachId: coach.id },
      include: { _count: { select: { enrollments: true } } },
    }),
  ])

  const upcoming  = bookings.filter(b => b.status !== 'COMPLETED' && b.status !== 'CANCELLED' && new Date(b.scheduledAt) >= new Date())
  const completed = bookings.filter(b => b.status === 'COMPLETED')

  const stats = [
    { label: 'Upcoming Sessions', value: upcoming.length,       color: '#B8973A' },
    { label: 'Total Sessions',    value: coach.totalSessions,   color: '#6B8F9E' },
    { label: 'Unique Clients',    value: clients.length,        color: '#2C4A3E' },
    { label: 'Programs',          value: programs.length,       color: '#B8973A' },
  ]

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="max-w-6xl mx-auto space-y-8">

      {/* Coach welcome */}
      <div className="bg-[#0A1628] rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_50%,#1A2B4A,transparent)]" />
        <div className="relative z-10 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-[#B8973A] text-xs tracking-[0.2em] uppercase mb-2">Coach Dashboard</p>
            <h2 className="font-display text-3xl text-white font-light mb-2">
              Welcome, {coach.user.name?.split(' ')[0]}
            </h2>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {(JSON.parse(coach.domains as string) as string[]).map(d => (
                <span key={d} className="text-[10px] font-medium px-2.5 py-1 rounded-full"
                  style={{ background: `${getDomainColor(d)}30`, color: getDomainColor(d) }}>
                  {getDomainLabel(d)}
                </span>
              ))}
            </div>
          </div>
          {coach.rating && (
            <div className="text-right">
              <p className="font-display text-5xl text-white font-light">{coach.rating.toFixed(1)}</p>
              <p className="text-amber-400 text-sm">★★★★★</p>
              <p className="text-white/30 text-xs mt-1">Average rating</p>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-stone-100 p-6">
            <p className="text-stone-400 text-xs tracking-wide mb-3">{s.label}</p>
            <p className="font-display text-4xl text-[#0A1628] font-light"
              style={{ color: s.value > 0 ? s.color : undefined }}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Upcoming bookings */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display text-xl text-[#0A1628]">Upcoming Sessions</h3>
            <Link href="/coach/sessions" className="text-xs text-[#B8973A] hover:underline">View all</Link>
          </div>

          {upcoming.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-stone-400 text-sm">No upcoming sessions.</p>
              <p className="text-stone-300 text-xs mt-1">Make sure your availability is set below.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcoming.slice(0, 6).map(b => (
                <div key={b.id} className="flex items-center gap-4 p-3 rounded-xl bg-stone-50">
                  <div className="w-10 h-10 rounded-xl bg-[#0A1628] flex items-center justify-center text-white font-display flex-shrink-0">
                    {b.user.name?.charAt(0) ?? 'C'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#0A1628] text-sm font-medium">{b.user.name}</p>
                    <p className="text-stone-400 text-xs">
                      {formatDate(b.scheduledAt)} · {b.duration} min
                    </p>
                  </div>
                  <span className={`text-[10px] font-medium px-2.5 py-1 rounded-full border flex-shrink-0 ${
                    b.status === 'CONFIRMED' ? 'bg-green-50 text-green-600 border-green-100' :
                    'bg-amber-50 text-amber-600 border-amber-100'
                  }`}>
                    {b.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Availability overview */}
        <div className="bg-white rounded-2xl border border-stone-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display text-xl text-[#0A1628]">Availability</h3>
            <Link href="/coach/availability" className="text-xs text-[#B8973A] hover:underline">Edit</Link>
          </div>
          <div className="space-y-2">
            {days.map((day, i) => {
              const slot = coach.availability.find(a => a.dayOfWeek === i)
              return (
                <div key={day} className="flex items-center justify-between py-2 border-b border-stone-50">
                  <span className="text-stone-500 text-sm w-10">{day}</span>
                  {slot ? (
                    <span className="text-[#0A1628] text-xs font-medium">
                      {slot.startTime} – {slot.endTime}
                    </span>
                  ) : (
                    <span className="text-stone-300 text-xs">Unavailable</span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Programs */}
      <div className="bg-white rounded-2xl border border-stone-100 p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display text-xl text-[#0A1628]">My Programs</h3>
          <Link href="/admin/programs/new" className="text-xs bg-[#0A1628] text-white px-4 py-2 rounded-full hover:bg-[#1A2B4A] transition-colors">
            + Create Program
          </Link>
        </div>
        {programs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-stone-400 text-sm mb-3">No programs created yet.</p>
            <Link href="/admin/programs/new" className="text-xs text-[#B8973A] hover:underline">Create your first program →</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {programs.map(p => (
              <div key={p.id} className="border border-stone-100 rounded-xl p-4 hover:border-stone-200 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                    style={{ background: `${getDomainColor(p.domain)}15`, color: getDomainColor(p.domain) }}>
                    {getDomainLabel(p.domain)}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${p.isPublished ? 'bg-green-50 text-green-500' : 'bg-stone-100 text-stone-400'}`}>
                    {p.isPublished ? 'Live' : 'Draft'}
                  </span>
                </div>
                <p className="text-[#0A1628] font-medium text-sm">{p.title}</p>
                <p className="text-stone-400 text-xs mt-1">{p._count.enrollments} enrolled</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent completed sessions */}
      {completed.length > 0 && (
        <div className="bg-white rounded-2xl border border-stone-100 p-6">
          <h3 className="font-display text-xl text-[#0A1628] mb-5">
            Recent Completed <span className="text-stone-300 text-lg">({completed.length})</span>
          </h3>
          <div className="space-y-2">
            {completed.slice(0, 5).map(b => (
              <div key={b.id} className="flex items-center gap-4 py-3 border-b border-stone-50">
                <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-stone-500 text-sm flex-shrink-0">
                  {b.user.name?.charAt(0) ?? 'C'}
                </div>
                <div className="flex-1">
                  <p className="text-[#0A1628] text-sm">{b.user.name}</p>
                  <p className="text-stone-400 text-xs">{formatDate(b.scheduledAt)} · {b.duration} min</p>
                </div>
                <span className="text-stone-300 text-xs">✓ Completed</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
