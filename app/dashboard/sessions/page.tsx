import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { formatDate, getDomainColor } from '@/lib/utils'
import Link from 'next/link'

const statusStyles: Record<string, string> = {
  PENDING:   'bg-amber-50 text-amber-600 border-amber-100',
  CONFIRMED: 'bg-green-50 text-green-600 border-green-100',
  CANCELLED: 'bg-red-50 text-red-500 border-red-100',
  COMPLETED: 'bg-stone-50 text-stone-500 border-stone-200',
}

export default async function SessionsPage() {
  const session = await auth()
  const userId  = session!.user!.id as string

  const bookings = await prisma.booking.findMany({
    where: { userId },
    include: { coach: { include: { user: true } } },
    orderBy: { scheduledAt: 'desc' },
  })

  const upcoming  = bookings.filter(b => ['PENDING','CONFIRMED'].includes(b.status) && new Date(b.scheduledAt) >= new Date())
  const past      = bookings.filter(b => b.status === 'COMPLETED' || new Date(b.scheduledAt) < new Date())

  return (
    <div className="max-w-4xl mx-auto space-y-8">

      {/* Book new session CTA */}
      <div className="bg-[#0A1628] rounded-2xl p-6 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="font-display text-xl text-white font-light">Ready for your next session?</h2>
          <p className="text-white/40 text-sm mt-1">Browse certified coaches and book at your convenience.</p>
        </div>
        <Link
          href="/dashboard/coaches"
          className="bg-[#B8973A] hover:bg-[#D4B05A] text-white text-sm font-medium px-5 py-2.5 rounded-full transition-colors flex-shrink-0"
        >
          Find a Coach →
        </Link>
      </div>

      {/* Upcoming */}
      <div>
        <h2 className="font-display text-2xl text-[#0A1628] mb-5">
          Upcoming <span className="text-stone-300 text-xl">({upcoming.length})</span>
        </h2>

        {upcoming.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-100 p-12 text-center">
            <p className="text-stone-400 text-sm">No upcoming sessions. Book one with a coach!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {upcoming.map(b => (
              <BookingCard key={b.id} booking={b} />
            ))}
          </div>
        )}
      </div>

      {/* Past */}
      {past.length > 0 && (
        <div>
          <h2 className="font-display text-2xl text-[#0A1628] mb-5">
            Past Sessions <span className="text-stone-300 text-xl">({past.length})</span>
          </h2>
          <div className="space-y-3">
            {past.map(b => (
              <BookingCard key={b.id} booking={b} past />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function BookingCard({ booking, past = false }: { booking: any; past?: boolean }) {
  const coach = booking.coach
  return (
    <div className={`bg-white rounded-2xl border p-6 flex items-center gap-5 transition-all ${past ? 'border-stone-100 opacity-70' : 'border-stone-100 hover:border-stone-200 hover:shadow-sm'}`}>
      {/* Coach avatar */}
      <div className="w-12 h-12 rounded-xl bg-[#0A1628]/8 flex items-center justify-center text-[#0A1628] font-display text-lg flex-shrink-0">
        {coach.user.name?.charAt(0) ?? 'C'}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-[#0A1628] font-medium text-sm">{coach.user.name}</p>
          {coach.domains?.map((d: string) => (
            <span key={d} className="text-[10px] px-2 py-0.5 rounded-full"
              style={{ background: `${getDomainColor(d)}15`, color: getDomainColor(d) }}>
              {d}
            </span>
          ))}
        </div>
        <p className="text-stone-400 text-xs mt-0.5">
          {formatDate(booking.scheduledAt)} · {booking.duration} min
        </p>
        {booking.notes && (
          <p className="text-stone-500 text-xs mt-1.5 line-clamp-1">{booking.notes}</p>
        )}
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
        <span className={`text-[10px] font-medium px-2.5 py-1 rounded-full border ${statusStyles[booking.status]}`}>
          {booking.status}
        </span>
        {booking.meetingUrl && booking.status === 'CONFIRMED' && (
          <a
            href={booking.meetingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs bg-[#0A1628] text-white px-3 py-1.5 rounded-full hover:bg-[#1A2B4A] transition-colors"
          >
            Join →
          </a>
        )}
      </div>
    </div>
  )
}
