import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { formatDate, getInitials, getDomainLabel } from '@/lib/utils'

export default async function ProfilePage() {
  const session = await auth()
  const userId = session!.user!.id as string

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: true,
      membership: true,
      _count: {
        select: { enrollments: true, assessmentResults: true, bookings: true },
      },
    },
  })

  if (!user) return null

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Profile header */}
      <div className="bg-white rounded-2xl border border-stone-100 p-8 flex flex-col sm:flex-row items-start gap-6">
        {/* Avatar */}
        <div className="w-20 h-20 rounded-2xl bg-[#0A1628] flex items-center justify-center text-white text-2xl font-light font-display flex-shrink-0">
          {getInitials(user.name)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h2 className="font-display text-2xl text-[#0A1628] font-medium">{user.name ?? 'Member'}</h2>
              <p className="text-stone-400 text-sm mt-0.5">{user.email}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-3 py-1.5 rounded-full font-medium border ${
                user.role === 'ADMIN' ? 'bg-red-50 text-red-600 border-red-100' :
                user.role === 'COACH' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                'bg-stone-50 text-stone-500 border-stone-200'
              }`}>
                {user.role}
              </span>
              <span className={`text-xs px-3 py-1.5 rounded-full font-medium border ${
                user.membership?.plan === 'PROFESSIONAL' ? 'bg-[#B8973A]/10 text-[#B8973A] border-[#B8973A]/20' :
                user.membership?.plan === 'PERSONAL'     ? 'bg-[#0A1628]/8 text-[#0A1628] border-[#0A1628]/15' :
                'bg-stone-50 text-stone-500 border-stone-200'
              }`}>
                {user.membership?.plan ?? 'FREE'}
              </span>
            </div>
          </div>

          {user.profile?.bio && (
            <p className="text-stone-500 text-sm mt-4 leading-relaxed max-w-xl">{user.profile.bio}</p>
          )}

          <div className="mt-4 flex flex-wrap gap-4">
            {user.profile?.country && (
              <span className="text-stone-400 text-xs flex items-center gap-1">◎ {user.profile.city ? `${user.profile.city}, ` : ''}{user.profile.country}</span>
            )}
            {user.profile?.interests && (JSON.parse(user.profile.interests as string) as string[]).length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {(JSON.parse(user.profile.interests as string) as string[]).map(i => (
                  <span key={i} className="text-[10px] bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full">
                    {getDomainLabel(i)}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Programs',    value: user._count.enrollments },
          { label: 'Assessments', value: user._count.assessmentResults },
          { label: 'Sessions',    value: user._count.bookings },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-stone-100 p-6 text-center">
            <p className="font-display text-4xl text-[#0A1628] font-light">{s.value}</p>
            <p className="text-stone-400 text-xs mt-1 tracking-wide">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Edit profile form */}
      <div className="bg-white rounded-2xl border border-stone-100 p-8">
        <h3 className="font-display text-xl text-[#0A1628] mb-6">Edit Profile</h3>
        <ProfileEditForm user={user} />
      </div>

      {/* Account info */}
      <div className="bg-white rounded-2xl border border-stone-100 p-8">
        <h3 className="font-display text-xl text-[#0A1628] mb-5">Account</h3>
        <div className="space-y-4">
          {[
            { label: 'Member since', value: formatDate(user.createdAt) },
            { label: 'Membership',   value: user.membership?.plan ?? 'FREE' },
            { label: 'Role',         value: user.role },
          ].map(row => (
            <div key={row.label} className="flex items-center justify-between py-3 border-b border-stone-50">
              <p className="text-stone-400 text-sm">{row.label}</p>
              <p className="text-[#0A1628] text-sm font-medium">{row.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Client-side edit form
import ProfileEditForm from '@/components/dashboard/ProfileEditForm'
