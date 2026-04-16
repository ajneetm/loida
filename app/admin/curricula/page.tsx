import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, BookOpen } from 'lucide-react'
import DeleteCurriculumButton from './DeleteCurriculumButton'

export default async function AdminCurriculaPage() {
  const session = await auth()
  if ((session?.user as any)?.role !== 'ADMIN') redirect('/dashboard')

  const curricula = await prisma.curriculum.findMany({
    include: { _count: { select: { accreditations: true } } },
    orderBy: { name: 'asc' },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-[#1C2B39]">Curricula</h1>
        <Link
          href="/admin/curricula/new"
          className="flex items-center gap-2 bg-[#1C2B39] text-white px-4 py-2 rounded-none text-sm hover:bg-[#2a3f52] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Curriculum
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {curricula.length === 0 ? (
          <div className="col-span-3 bg-white rounded-none border border-[#E8E4DC] p-12 text-center text-[#6B8F9E]">
            <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p>No curricula yet. Add the three programmes first.</p>
          </div>
        ) : (
          curricula.map((c) => (
            <div key={c.id} className="bg-white rounded-none border border-[#E8E4DC] p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-[#1C2B39]">{c.name}</h3>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-none text-xs font-medium ${
                    c.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {c.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <DeleteCurriculumButton id={c.id} name={c.name} count={c._count.accreditations} />
                </div>
              </div>
              <p className="text-xs text-[#6B8F9E]">{c.domain}</p>
              <a href={c.siteUrl} target="_blank" rel="noopener noreferrer"
                className="text-xs text-[#6B8F9E] hover:text-[#1C2B39] truncate block">
                {c.siteUrl}
              </a>
              <div className="pt-2 border-t border-[#E8E4DC] text-sm text-[#1C2B39]">
                <span className="font-semibold">{c._count.accreditations}</span>
                <span className="text-[#6B8F9E]"> accredited trainer{c._count.accreditations !== 1 ? 's' : ''}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
