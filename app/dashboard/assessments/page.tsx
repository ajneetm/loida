import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { getDomainColor, getDomainLabel, formatDate } from '@/lib/utils'
import Link from 'next/link'

export default async function AssessmentsPage() {
  const session = await auth()
  const userId = session!.user!.id as string

  const [assessments, results] = await Promise.all([
    prisma.assessment.findMany({
      where: { isActive: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    }),
    prisma.assessmentResult.findMany({
      where: { userId },
      include: { assessment: true },
      orderBy: { completedAt: 'desc' },
    }),
  ])

  const completedIds = new Set(results.map(r => r.assessmentId))

  const domainGroups = ['HARMONY', 'CAREER', 'BUSINESS'] as const

  return (
    <div className="max-w-5xl mx-auto space-y-10">

      {/* Results history */}
      {results.length > 0 && (
        <div>
          <h2 className="font-display text-2xl text-[#0A1628] mb-5">Your Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.map(r => {
              const color = getDomainColor(r.assessment.domain)
              return (
                <div key={r.id} className="bg-white rounded-2xl border border-stone-100 p-6 flex gap-5">
                  {/* Score ring */}
                  <div className="flex-shrink-0 w-16 h-16 rounded-full border-2 flex items-center justify-center flex-col"
                    style={{ borderColor: color }}>
                    <p className="font-display text-xl font-light" style={{ color }}>{r.score ?? '—'}</p>
                    <p className="text-[9px] text-stone-400 uppercase tracking-wide">score</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                        style={{ background: `${color}15`, color }}>
                        {getDomainLabel(r.assessment.domain)}
                      </span>
                    </div>
                    <h3 className="text-[#0A1628] font-medium text-sm">{r.assessment.title}</h3>
                    <p className="text-stone-400 text-xs mt-1">{formatDate(r.completedAt)}</p>
                    {r.recommendations && (r.recommendations as string[]).length > 0 && (
                      <div className="mt-3 space-y-1">
                        {(r.recommendations as string[]).slice(0, 2).map((rec, i) => (
                          <p key={i} className="text-xs text-stone-500 flex items-start gap-1.5">
                            <span style={{ color }} className="mt-0.5 flex-shrink-0">✦</span>
                            {rec}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Available assessments by domain */}
      {domainGroups.map(domain => {
        const domainAssessments = assessments.filter(a => a.domain === domain)
        if (domainAssessments.length === 0) return null
        const color = getDomainColor(domain)

        return (
          <div key={domain}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-px h-5" style={{ background: color }} />
              <h2 className="font-display text-2xl text-[#0A1628]">{getDomainLabel(domain)}</h2>
              <span className="text-stone-300 text-sm">— {domainAssessments.length} assessment{domainAssessments.length > 1 ? 's' : ''}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {domainAssessments.map(assessment => {
                const done = completedIds.has(assessment.id)
                const questions = (assessment.questions as any[]) ?? []

                return (
                  <div key={assessment.id}
                    className="bg-white rounded-2xl border border-stone-100 p-6 hover:border-stone-200 hover:shadow-sm transition-all group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm"
                        style={{ background: `${color}12`, color }}>
                        ◎
                      </div>
                      {done && (
                        <span className="text-[10px] bg-green-50 text-green-600 border border-green-100 px-2 py-1 rounded-full font-medium">
                          Completed ✓
                        </span>
                      )}
                    </div>

                    <h3 className="font-display text-xl text-[#0A1628] font-medium mb-2 group-hover:text-[#B8973A] transition-colors">
                      {assessment.title}
                    </h3>
                    <p className="text-stone-500 text-sm leading-relaxed mb-5 line-clamp-2">
                      {assessment.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <p className="text-stone-400 text-xs">{questions.length} questions</p>
                      <Link
                        href={`/dashboard/assessments/${assessment.id}`}
                        className="text-xs font-medium px-4 py-2 rounded-full transition-all hover:opacity-90 text-white"
                        style={{ background: done ? '#78716c' : color }}
                      >
                        {done ? 'Retake' : 'Start →'}
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}

      {assessments.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border border-stone-100">
          <p className="text-stone-400 text-sm">No assessments available yet. Check back soon.</p>
        </div>
      )}
    </div>
  )
}
