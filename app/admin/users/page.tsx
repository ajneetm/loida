import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { AddUserButton, DeleteUserButton } from './UserActions'

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: { plan?: string; role?: string }
}) {
  const plan = searchParams.plan?.toUpperCase()
  const role = searchParams.role?.toUpperCase()

  const session = await auth()
  if ((session?.user as any)?.role !== 'ADMIN') redirect('/dashboard')

  const users = await prisma.user.findMany({
    where: {
      ...(role ? { role: role as any } : {}),
      ...(plan ? { membership: { plan: plan as any } } : {}),
    },
    include: {
      membership: true,
      _count: { select: { enrollments: true, assessmentResults: true, bookings: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  const plans = ['FREE', 'PERSONAL', 'PROFESSIONAL']
  const roles = ['USER', 'COACH', 'ADMIN']

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#1C2B39]">Users</h1>
          <p className="text-[#6B8F9E] text-sm mt-1">{users.length} user{users.length !== 1 ? 's' : ''}</p>
        </div>
        <AddUserButton />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-none border border-stone-100 p-4 flex flex-wrap gap-6">
        <div>
          <p className="text-stone-400 text-[10px] tracking-widest uppercase mb-2">Plan</p>
          <div className="flex gap-2">
            <a href="/admin/users" className={`text-xs px-3 py-1.5 rounded-none border transition-all ${!plan ? 'bg-[#022269] text-white border-[#022269]' : 'border-stone-200 text-stone-500 hover:border-stone-400'}`}>All</a>
            {plans.map(p => (
              <a key={p} href={`/admin/users?plan=${p}`}
                className={`text-xs px-3 py-1.5 rounded-none border transition-all ${plan === p ? 'bg-[#022269] text-white border-[#022269]' : 'border-stone-200 text-stone-500 hover:border-stone-400'}`}>
                {p}
              </a>
            ))}
          </div>
        </div>
        <div>
          <p className="text-stone-400 text-[10px] tracking-widest uppercase mb-2">Role</p>
          <div className="flex gap-2">
            {roles.map(r => (
              <a key={r} href={`/admin/users?role=${r}`}
                className={`text-xs px-3 py-1.5 rounded-none border transition-all ${role === r ? 'bg-[#022269] text-white border-[#022269]' : 'border-stone-200 text-stone-500 hover:border-stone-400'}`}>
                {r}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-none border border-stone-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-stone-50">
              <th className="text-left text-[10px] text-stone-400 tracking-widest uppercase px-6 py-4 font-medium">Member</th>
              <th className="text-left text-[10px] text-stone-400 tracking-widest uppercase px-4 py-4 font-medium hidden md:table-cell">Role</th>
              <th className="text-left text-[10px] text-stone-400 tracking-widest uppercase px-4 py-4 font-medium hidden sm:table-cell">Plan</th>
              <th className="text-left text-[10px] text-stone-400 tracking-widest uppercase px-4 py-4 font-medium hidden lg:table-cell">Programs</th>
              <th className="text-left text-[10px] text-stone-400 tracking-widest uppercase px-4 py-4 font-medium hidden lg:table-cell">Assessments</th>
              <th className="text-left text-[10px] text-stone-400 tracking-widest uppercase px-4 py-4 font-medium hidden xl:table-cell">Joined</th>
              <th className="px-4 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-stone-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-none bg-[#022269]/8 flex items-center justify-center text-[#022269] text-xs font-medium flex-shrink-0">
                      {user.name?.charAt(0) ?? '?'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[#022269] text-sm font-medium truncate">{user.name ?? 'Unknown'}</p>
                      <p className="text-stone-400 text-xs truncate">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 hidden md:table-cell">
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-none ${
                    user.role === 'ADMIN' ? 'bg-red-50 text-red-500' :
                    user.role === 'COACH' ? 'bg-blue-50 text-blue-500' :
                    'bg-stone-100 text-stone-500'
                  }`}>{user.role}</span>
                </td>
                <td className="px-4 py-4 hidden sm:table-cell">
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-none border ${
                    user.membership?.plan === 'PROFESSIONAL' ? 'bg-[#c71430]/10 text-[#c71430] border-[#c71430]/20' :
                    user.membership?.plan === 'PERSONAL'     ? 'bg-[#022269]/8 text-[#022269] border-[#022269]/15' :
                    'bg-stone-50 text-stone-400 border-stone-200'
                  }`}>{user.membership?.plan ?? 'FREE'}</span>
                </td>
                <td className="px-4 py-4 text-stone-500 text-sm hidden lg:table-cell">{user._count.enrollments}</td>
                <td className="px-4 py-4 text-stone-500 text-sm hidden lg:table-cell">{user._count.assessmentResults}</td>
                <td className="px-4 py-4 text-stone-400 text-xs hidden xl:table-cell">{formatDate(user.createdAt)}</td>
                <td className="px-4 py-4">
                  <DeleteUserButton userId={user.id} userName={user.name ?? undefined} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <div className="text-center py-12">
            <p className="text-stone-400 text-sm">No users found.</p>
          </div>
        )}
      </div>
    </div>
  )
}
