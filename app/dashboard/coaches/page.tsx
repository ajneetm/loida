import { prisma } from '@/lib/prisma'
import { getDomainColor, getDomainLabel, formatCurrency } from '@/lib/utils'
import Link from 'next/link'

export default async function CoachesPage({
  searchParams,
}: {
  searchParams: { domain?: string }
}) {
  const domain = searchParams.domain?.toUpperCase()

  const coaches = await prisma.coach.findMany({
    where: {
      status: 'APPROVED',
      ...(domain ? { domains: { contains: domain } } : {}),
    },
    include: {
      user: { select: { name: true, image: true, email: true } },
      _count: { select: { bookings: true } },
    },
  })

  const domains = ['HARMONY', 'CAREER', 'BUSINESS']

  return (
    <div className="max-w-5xl mx-auto space-y-8">

      {/* Header */}
      <div className="bg-[#022269] rounded-none p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_50%,#011344,transparent)]" />
        <div className="relative z-10">
          <p className="text-[#c71430] text-xs tracking-[0.2em] uppercase mb-2">Expert Guidance</p>
          <h2 className="font-display text-3xl text-white font-light mb-2">Find Your Coach</h2>
          <p className="text-white/40 text-sm max-w-lg">
            All Loida British coaches are certified, experienced professionals across Harmony, Career, and Business domains.
          </p>
        </div>
      </div>

      {/* Domain filter */}
      <div className="flex flex-wrap gap-2">
        <Link href="/dashboard/coaches"
          className={`px-4 py-2 rounded-none text-xs transition-all ${!domain ? 'bg-[#022269] text-white' : 'border border-stone-200 text-stone-500 hover:border-stone-400'}`}>
          All Coaches
        </Link>
        {domains.map(d => (
          <Link key={d} href={`/dashboard/coaches?domain=${d}`}
            className="px-4 py-2 rounded-none text-xs border transition-all hover:text-white"
            style={domain === d
              ? { background: getDomainColor(d), color: '#fff', borderColor: getDomainColor(d) }
              : { borderColor: '#e7e5e4', color: '#78716c' }}>
            {getDomainLabel(d)}
          </Link>
        ))}
      </div>

      {/* Coach grid */}
      {coaches.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-none border border-stone-100">
          <p className="text-stone-400 text-sm">No coaches found in this domain yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {coaches.map(coach => (
            <div key={coach.id} className="bg-white rounded-none border border-stone-100 p-6 hover:border-stone-200 hover:shadow-md transition-all duration-300 flex flex-col">
              {/* Avatar + info */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-none bg-[#022269] flex items-center justify-center text-white font-display text-xl flex-shrink-0">
                  {coach.user.name?.charAt(0) ?? 'C'}
                </div>
                <div className="min-w-0">
                  <h3 className="text-[#022269] font-medium text-sm">{coach.user.name}</h3>
                  <p className="text-stone-400 text-xs mt-0.5">{coach._count.bookings} sessions</p>
                  {coach.rating && (
                    <p className="text-amber-500 text-xs mt-0.5">★ {coach.rating.toFixed(1)}</p>
                  )}
                </div>
              </div>

              {/* Domains */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {(JSON.parse(coach.domains as string) as string[]).map((d: string) => (
                  <span key={d} className="text-[10px] px-2 py-0.5 rounded-none font-medium"
                    style={{ background: `${getDomainColor(d)}15`, color: getDomainColor(d) }}>
                    {getDomainLabel(d)}
                  </span>
                ))}
              </div>

              {/* Bio */}
              <p className="text-stone-500 text-sm leading-relaxed flex-1 line-clamp-3 mb-5">
                {coach.bio}
              </p>

              {/* Specialties */}
              {(() => { const specs = JSON.parse(coach.specialties as string) as string[]; return specs.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {specs.slice(0, 3).map((s: string) => (
                    <span key={s} className="text-[10px] bg-stone-50 text-stone-500 border border-stone-100 px-2 py-0.5 rounded-none">
                      {s}
                    </span>
                  ))}
                </div>
              ) : null })()}

              {/* Price + CTA */}
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-stone-50">
                <div>
                  <p className="font-display text-lg text-[#022269]">
                    {coach.hourlyRate ? formatCurrency(coach.hourlyRate, coach.currency) : 'Free'}
                  </p>
                  <p className="text-stone-400 text-[10px]">per session</p>
                </div>
                <Link
                  href={`/dashboard/coaches/${coach.id}/book`}
                  className="bg-[#022269] hover:bg-[#011344] text-white text-xs font-medium px-4 py-2 rounded-none transition-colors"
                >
                  Book Session
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Apply to be a coach */}
      <div className="bg-stone-50 border border-stone-100 rounded-none p-6 text-center">
        <p className="text-[#022269] font-medium text-sm mb-1">Are you an expert in your field?</p>
        <p className="text-stone-400 text-sm mb-4">Apply to become a certified Loida British coach and help others transform their lives.</p>
        <Link
          href="/dashboard/coaches/apply"
          className="inline-flex text-sm font-medium text-[#c71430] border border-[#c71430]/30 px-5 py-2 rounded-none hover:bg-[#c71430] hover:text-white transition-all duration-300"
        >
          Apply as Coach →
        </Link>
      </div>
    </div>
  )
}
