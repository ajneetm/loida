import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { getDomainColor, getDomainLabel, formatCurrency } from '@/lib/utils'
import Link from 'next/link'

export default async function ProgramsPage({
  searchParams,
}: {
  searchParams: { domain?: string; type?: string }
}) {
  const session = await auth()
  const userId = session!.user!.id as string

  const domain = searchParams.domain?.toUpperCase()
  const type   = searchParams.type?.toUpperCase()

  const [programs, enrollments] = await Promise.all([
    prisma.program.findMany({
      where: {
        isPublished: true,
        ...(domain ? { domain: domain as any } : {}),
        ...(type   ? { type:   type   as any } : {}),
      },
      include: { _count: { select: { enrollments: true } } },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    }),
    prisma.enrollment.findMany({ where: { userId }, select: { programId: true } }),
  ])

  const enrolledIds = new Set(enrollments.map(e => e.programId))

  const domains = ['HARMONY', 'CAREER', 'BUSINESS']
  const types   = ['COURSE', 'COACHING', 'WORKSHOP', 'BOOTCAMP']

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Filters */}
      <div className="bg-white rounded-2xl border border-stone-100 p-5 flex flex-wrap gap-6">
        <div>
          <p className="text-stone-400 text-xs tracking-wide mb-2 uppercase">Domain</p>
          <div className="flex flex-wrap gap-2">
            <Link href="/dashboard/programs"
              className={`px-3 py-1.5 rounded-full text-xs transition-all ${!domain ? 'bg-[#0A1628] text-white' : 'border border-stone-200 text-stone-500 hover:border-stone-400'}`}>
              All
            </Link>
            {domains.map(d => (
              <Link key={d} href={`/dashboard/programs?domain=${d}`}
                className="px-3 py-1.5 rounded-full text-xs border transition-all hover:text-white"
                style={domain === d
                  ? { background: getDomainColor(d), color: '#fff', borderColor: getDomainColor(d) }
                  : { borderColor: '#e7e5e4', color: '#78716c' }
                }>
                {getDomainLabel(d)}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <p className="text-stone-400 text-xs tracking-wide mb-2 uppercase">Type</p>
          <div className="flex flex-wrap gap-2">
            {types.map(t => (
              <Link key={t} href={`/dashboard/programs${domain ? `?domain=${domain}&` : '?'}type=${t}`}
                className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                  type === t ? 'bg-[#0A1628] text-white border-[#0A1628]' : 'border-stone-200 text-stone-500 hover:border-stone-400'
                }`}>
                {t.charAt(0) + t.slice(1).toLowerCase()}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-stone-500 text-sm">{programs.length} program{programs.length !== 1 ? 's' : ''} available</p>
      </div>

      {/* Grid */}
      {programs.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-stone-100">
          <p className="text-stone-400 text-sm">No programs found. Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {programs.map(program => {
            const enrolled = enrolledIds.has(program.id)
            const color    = getDomainColor(program.domain)
            return (
              <div key={program.id}
                className="bg-white rounded-2xl border border-stone-100 overflow-hidden hover:border-stone-200 hover:shadow-md transition-all duration-300 flex flex-col group">
                {/* Top accent */}
                <div className="h-1 w-full" style={{ background: color }} />

                <div className="p-6 flex-1 flex flex-col">
                  {/* Badges */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="domain-pill text-[10px]"
                      style={{ background: `${color}15`, color }}>
                      {getDomainLabel(program.domain)}
                    </span>
                    <span className="domain-pill text-[10px] bg-stone-100 text-stone-500">
                      {program.type.charAt(0) + program.type.slice(1).toLowerCase()}
                    </span>
                  </div>

                  <h3 className="font-display text-lg text-[#0A1628] font-medium leading-snug mb-2 group-hover:text-[#B8973A] transition-colors">
                    {program.title}
                  </h3>
                  <p className="text-stone-500 text-sm leading-relaxed flex-1 line-clamp-3">
                    {program.description}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center gap-4 mt-5 mb-5 text-xs text-stone-400">
                    {program.duration && <span>⏱ {program.duration}</span>}
                    {program.level    && <span>◈ {program.level}</span>}
                    <span className="ml-auto">{program._count.enrollments} enrolled</span>
                  </div>

                  {/* Price + CTA */}
                  <div className="flex items-center justify-between">
                    <p className="font-display text-xl text-[#0A1628]">
                      {program.price === 0 ? 'Free' : formatCurrency(program.price, program.currency)}
                    </p>
                    {enrolled ? (
                      <Link href={`/dashboard/programs/${program.id}`}
                        className="text-xs font-medium px-4 py-2 rounded-full border-2 transition-all"
                        style={{ borderColor: color, color }}>
                        Continue →
                      </Link>
                    ) : (
                      <Link href={`/dashboard/programs/${program.id}`}
                        className="text-xs font-medium px-4 py-2 rounded-full text-white transition-all hover:opacity-90"
                        style={{ background: color }}>
                        Enroll Now
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
