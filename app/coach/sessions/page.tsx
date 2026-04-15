import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { formatDate } from '@/lib/utils'
import BookingStatusUpdater from '@/components/coach/BookingStatusUpdater'

export default async function CoachSessionsPage({
  searchParams,
}: {
  searchParams: { status?: string }
}) {
  const session = await auth()
  if (!session?.user) redirect('/auth/login')

  const userId = session.user.id as string
  const coach  = await prisma.coach.findUnique({ where: { userId } })
  if (!coach || coach.status !== 'APPROVED') redirect('/dashboard')

  const status = searchParams.status?.toUpperCase()

  const bookings = await prisma.booking.findMany({
    where: {
      coachId: coach.id,
      ...(status ? { status: status as any } : {}),
    },
    include: { user: { select: { name: true, email: true } } },
    orderBy: { scheduledAt: 'asc' },
  })

  const statusTabs = ['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED']
  const counts = await prisma.booking.groupBy({
    by:    ['status'],
    where: { coachId: coach.id },
    _count: true,
  })
  const countMap = Object.fromEntries(counts.map(c => [c.status, c._count]))

  const statusStyle: Record<string, string> = {
    PENDING:   'bg-amber-50 text-amber-600 border-amber-100',
    CONFIRMED: 'bg-green-50 text-green-600 border-green-100',
    CANCELLED: 'bg-red-50 text-red-500 border-red-100',
    COMPLETED: 'bg-stone-50 text-stone-500 border-stone-200',
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="font-display text-3xl text-[#022269] font-light">Sessions</h1>

      {/* Status tabs */}
      <div className="flex flex-wrap gap-2 bg-white border border-stone-100 rounded-none p-2 w-fit">
        {statusTabs.map(s => {
          const count = s === 'ALL'
            ? Object.values(countMap).reduce((a, b) => a + b, 0)
            : (countMap[s] ?? 0)
          const active = (!status && s === 'ALL') || status === s
          return (
            <a key={s} href={`/coach/sessions${s !== 'ALL' ? `?status=${s}` : ''}`}
              className={`px-4 py-2 rounded-none text-xs font-medium flex items-center gap-2 transition-all ${active ? 'bg-[#022269] text-white' : 'text-stone-500 hover:text-stone-700'}`}>
              {s}
              <span className={`px-1.5 py-0.5 rounded-none text-[9px] ${active ? 'bg-white/20' : 'bg-stone-100 text-stone-400'}`}>
                {count}
              </span>
            </a>
          )
        })}
      </div>

      {/* Bookings list */}
      {bookings.length === 0 ? (
        <div className="bg-white rounded-none border border-stone-100 p-12 text-center">
          <p className="text-stone-400 text-sm">No sessions found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map(b => (
            <div key={b.id} className="bg-white rounded-none border border-stone-100 p-5 flex items-start gap-5 flex-wrap">
              {/* Client */}
              <div className="w-10 h-10 rounded-none bg-[#022269]/8 flex items-center justify-center text-[#022269] font-medium flex-shrink-0">
                {b.user.name?.charAt(0) ?? 'C'}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <p className="text-[#022269] font-medium text-sm">{b.user.name}</p>
                  <span className="text-stone-400 text-xs">·</span>
                  <p className="text-stone-400 text-xs">{b.user.email}</p>
                </div>
                <p className="text-stone-500 text-sm">
                  {formatDate(b.scheduledAt)} · {b.duration} min
                </p>
                {b.notes && (
                  <p className="text-stone-400 text-xs mt-2 bg-stone-50 rounded-none px-3 py-2 leading-relaxed">
                    "{b.notes}"
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <span className={`text-[10px] font-medium px-2.5 py-1 rounded-none border ${statusStyle[b.status]}`}>
                  {b.status}
                </span>
                <BookingStatusUpdater bookingId={b.id} currentStatus={b.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
