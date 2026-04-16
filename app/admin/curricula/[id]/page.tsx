import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import WorkshopsManager from './WorkshopsManager'

export default async function CurriculumDetailPage({ params }: { params: { id: string } }) {
  const session = await auth()
  if ((session?.user as any)?.role !== 'ADMIN') redirect('/dashboard')

  const curriculum = await prisma.curriculum.findUnique({
    where:   { id: params.id },
    include: { workshops: { orderBy: { date: 'desc' } } },
  })

  if (!curriculum) redirect('/admin/curricula')

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs text-[#6B8F9E] uppercase tracking-widest">{curriculum.domain}</p>
        <h1 className="text-2xl font-semibold text-[#1C2B39] mt-1">{curriculum.name}</h1>
        <a href={curriculum.siteUrl} target="_blank" rel="noopener noreferrer"
          className="text-xs text-[#6B8F9E] hover:text-[#1C2B39] transition-colors">
          {curriculum.siteUrl} ↗
        </a>
      </div>

      <WorkshopsManager curriculumId={curriculum.id} initialWorkshops={curriculum.workshops} />
    </div>
  )
}
