import { prisma } from '@/lib/prisma'
import { formatDate, getDomainColor, getDomainLabel } from '@/lib/utils'
import CoachActionButtons from '@/components/admin/CoachActionButtons'

export default async function AdminCoachesPage({
  searchParams,
}: {
  searchParams: { status?: string }
}) {
  const status = (searchParams.status?.toUpperCase() ?? 'ALL') as any

  const coaches = await prisma.coach.findMany({
    where: status !== 'ALL' ? { status } : undefined,
    include: {
      user: { select: { name: true, email: true, createdAt: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  const statusOptions = ['ALL', 'PENDING', 'APPROVED', 'REJECTED']
  const counts = await prisma.coach.groupBy({
    by: ['status'],
    _count: true,
  })
  const countMap = Object.fromEntries(counts.map(c => [c.status, c._count]))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-[#022269] font-light">Coach Applications</h1>
          <p className="text-stone-400 text-sm mt-1">Review, approve, or reject coach applications</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 bg-white border border-stone-100 rounded-none p-2 w-fit">
        {statusOptions.map(s => {
          const count = s === 'ALL' ? coaches.length : (countMap[s] ?? 0)
          return (
            <a key={s} href={`/admin/coaches${s !== 'ALL' ? `?status=${s}` : ''}`}
              className={`px-4 py-2 rounded-none text-xs font-medium flex items-center gap-2 transition-all ${
                (status === s || (status === 'ALL' && s === 'ALL'))
                  ? 'bg-[#022269] text-white'
                  : 'text-stone-500 hover:text-stone-700'
              }`}>
              {s}
              <span className={`px-1.5 py-0.5 rounded-none text-[9px] ${
                (status === s || (status === 'ALL' && s === 'ALL'))
                  ? 'bg-white/20 text-white'
                  : 'bg-stone-100 text-stone-400'
              }`}>{count}</span>
            </a>
          )
        })}
      </div>

      {/* Coaches list */}
      <div className="space-y-4">
        {coaches.length === 0 ? (
          <div className="bg-white rounded-none border border-stone-100 p-12 text-center">
            <p className="text-stone-400 text-sm">No coach applications found.</p>
          </div>
        ) : (
          coaches.map(coach => (
            <div key={coach.id} className="bg-white rounded-none border border-stone-100 p-6">
              <div className="flex items-start gap-5 flex-wrap">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-none bg-[#022269]/8 flex items-center justify-center text-[#022269] font-display text-xl flex-shrink-0">
                  {coach.user.name?.charAt(0) ?? 'C'}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="text-[#022269] font-medium">{coach.user.name}</h3>
                    <span className={`text-[10px] font-medium px-2.5 py-1 rounded-none border ${
                      coach.status === 'APPROVED' ? 'bg-green-50 text-green-600 border-green-100' :
                      coach.status === 'PENDING'  ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                   'bg-red-50 text-red-500 border-red-100'
                    }`}>
                      {coach.status}
                    </span>
                  </div>
                  <p className="text-stone-400 text-xs">{coach.user.email} · Applied {formatDate(coach.createdAt)}</p>

                  {/* Domains */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {(JSON.parse(coach.domains as string) as string[]).map(d => (
                      <span key={d} className="text-[10px] px-2 py-0.5 rounded-none font-medium"
                        style={{ background: `${getDomainColor(d)}15`, color: getDomainColor(d) }}>
                        {getDomainLabel(d)}
                      </span>
                    ))}
                    {(JSON.parse(coach.specialties as string) as string[]).slice(0, 3).map(s => (
                      <span key={s} className="text-[10px] bg-stone-50 border border-stone-100 text-stone-500 px-2 py-0.5 rounded-none">{s}</span>
                    ))}
                  </div>

                  {/* Bio excerpt */}
                  <p className="text-stone-500 text-sm mt-3 leading-relaxed line-clamp-2">{coach.bio}</p>

                  {/* Links */}
                  <div className="flex gap-3 mt-3">
                    {coach.linkedinUrl && (
                      <a href={coach.linkedinUrl} target="_blank" rel="noopener noreferrer"
                        className="text-xs text-[#c71430] hover:underline">LinkedIn ↗</a>
                    )}
                    {coach.cvUrl && (
                      <a href={coach.cvUrl} target="_blank" rel="noopener noreferrer"
                        className="text-xs text-[#c71430] hover:underline">CV / Portfolio ↗</a>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <CoachActionButtons coachId={coach.id} status={coach.status} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
