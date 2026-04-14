import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'

export default async function AdminPage() {
  const [
    totalUsers,
    totalCoaches,
    pendingCoaches,
    totalPrograms,
    totalEnrollments,
    totalAssessments,
    totalBookings,
    recentUsers,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.coach.count({ where: { status: 'APPROVED' } }),
    prisma.coach.count({ where: { status: 'PENDING' } }),
    prisma.program.count({ where: { isPublished: true } }),
    prisma.enrollment.count(),
    prisma.assessmentResult.count(),
    prisma.booking.count(),
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 8,
      include: { membership: true, _count: { select: { enrollments: true } } },
    }),
  ])

  const stats = [
    { label: 'Total Users',       value: totalUsers,       color: '#B8973A',  href: '/admin/users'    },
    { label: 'Active Coaches',    value: totalCoaches,     color: '#6B8F9E',  href: '/admin/coaches'  },
    { label: 'Coach Applications',value: pendingCoaches,   color: '#E88C45', href: '/admin/coaches?status=PENDING', badge: pendingCoaches > 0 },
    { label: 'Programs',          value: totalPrograms,    color: '#2C4A3E',  href: '/admin/programs' },
    { label: 'Enrollments',       value: totalEnrollments, color: '#B8973A',  href: '/admin/programs' },
    { label: 'Assessments Done',  value: totalAssessments, color: '#6B8F9E',  href: '/admin/assessments' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-[#0A1628] font-light">Platform Overview</h1>
        <p className="text-stone-400 text-sm mt-1">Real-time stats across the Loida British Hub</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map(s => (
          <Link key={s.label} href={s.href}
            className="bg-white rounded-2xl border border-stone-100 p-5 hover:border-stone-200 hover:shadow-sm transition-all relative group">
            {s.badge && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-orange-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {s.value}
              </span>
            )}
            <p className="font-display text-4xl text-[#0A1628] font-light group-hover:text-[#B8973A] transition-colors">
              {s.value}
            </p>
            <p className="text-stone-400 text-xs mt-1">{s.label}</p>
            <div className="mt-3 h-0.5 w-8 rounded-full" style={{ background: s.color }} />
          </Link>
        ))}
      </div>

      {/* Pending coach applications alert */}
      {pendingCoaches > 0 && (
        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-orange-700 font-medium text-sm">
              {pendingCoaches} pending coach application{pendingCoaches > 1 ? 's' : ''} require review
            </p>
            <p className="text-orange-500 text-xs mt-0.5">Review and approve or reject applications</p>
          </div>
          <Link href="/admin/coaches?status=PENDING"
            className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-medium px-4 py-2 rounded-full transition-colors flex-shrink-0">
            Review Now →
          </Link>
        </div>
      )}

      {/* Recent users */}
      <div className="bg-white rounded-2xl border border-stone-100">
        <div className="flex items-center justify-between p-6 border-b border-stone-50">
          <h2 className="font-display text-xl text-[#0A1628]">Recent Members</h2>
          <Link href="/admin/users" className="text-xs text-[#B8973A] hover:underline">View all</Link>
        </div>
        <div className="divide-y divide-stone-50">
          {recentUsers.map(user => (
            <div key={user.id} className="flex items-center gap-4 px-6 py-4 hover:bg-stone-50/50 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-[#0A1628]/8 flex items-center justify-center text-[#0A1628] text-sm font-medium flex-shrink-0">
                {user.name?.charAt(0) ?? '?'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[#0A1628] text-sm font-medium truncate">{user.name ?? 'Unknown'}</p>
                <p className="text-stone-400 text-xs truncate">{user.email}</p>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${
                  user.membership?.plan === 'PROFESSIONAL' ? 'bg-[#B8973A]/10 text-[#B8973A] border-[#B8973A]/20' :
                  user.membership?.plan === 'PERSONAL'     ? 'bg-[#0A1628]/8 text-[#0A1628] border-[#0A1628]/15' :
                                                             'bg-stone-50 text-stone-400 border-stone-200'
                }`}>
                  {user.membership?.plan ?? 'FREE'}
                </span>
                <span className="text-stone-300 text-xs">{user._count.enrollments} programs</span>
              </div>
              <p className="text-stone-300 text-xs hidden md:block flex-shrink-0">{formatDate(user.createdAt)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
