import { prisma } from '@/lib/prisma'
import { getDomainColor, getDomainLabel, formatDate } from '@/lib/utils'
import Link from 'next/link'

export default async function AdminAssessmentsPage() {
  const assessments = await prisma.assessment.findMany({
    include: { _count: { select: { results: true } } },
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-[#0A1628] font-light">Assessments</h1>
          <p className="text-stone-400 text-sm mt-1">{assessments.length} assessments in the system</p>
        </div>
        <Link href="/admin/assessments/new"
          className="bg-[#0A1628] hover:bg-[#1A2B4A] text-white text-sm font-medium px-5 py-2.5 rounded-full transition-colors">
          + New Assessment
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {assessments.map(a => {
          const color     = getDomainColor(a.domain)
          const questions = (a.questions as any[]) ?? []
          return (
            <div key={a.id} className="bg-white rounded-2xl border border-stone-100 p-6 hover:border-stone-200 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                    style={{ background: `${color}15`, color }}>
                    {getDomainLabel(a.domain)}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${a.isActive ? 'bg-green-50 text-green-600' : 'bg-stone-100 text-stone-400'}`}>
                    {a.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <Link href={`/admin/assessments/${a.id}/edit`}
                  className="text-xs text-stone-400 hover:text-[#B8973A] transition-colors">
                  Edit →
                </Link>
              </div>

              <h3 className="font-display text-xl text-[#0A1628] font-medium mb-2">{a.title}</h3>
              <p className="text-stone-500 text-sm leading-relaxed mb-5 line-clamp-2">{a.description}</p>

              <div className="flex items-center gap-4 text-xs text-stone-400">
                <span>📋 {questions.length} questions</span>
                <span>✓ {a._count.results} completions</span>
                <span className="ml-auto">{formatDate(a.createdAt)}</span>
              </div>
            </div>
          )
        })}
      </div>

      {assessments.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border border-stone-100">
          <p className="text-stone-400 text-sm mb-4">No assessments yet.</p>
          <Link href="/admin/assessments/new"
            className="text-xs bg-[#0A1628] text-white px-5 py-2.5 rounded-full hover:bg-[#1A2B4A] transition-colors">
            Create First Assessment
          </Link>
        </div>
      )}
    </div>
  )
}
