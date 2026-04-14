import { prisma } from '@/lib/prisma'
import { getDomainColor, getDomainLabel, formatCurrency } from '@/lib/utils'
import ProgramToggle from '@/components/admin/ProgramToggle'
import Link from 'next/link'

export default async function AdminProgramsPage() {
  const programs = await prisma.program.findMany({
    include: {
      _count: { select: { enrollments: true } },
      coach:  { include: { user: { select: { name: true } } } },
    },
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-[#0A1628] font-light">Programs</h1>
          <p className="text-stone-400 text-sm mt-1">{programs.length} programs in the system</p>
        </div>
        <Link
          href="/admin/programs/new"
          className="bg-[#0A1628] hover:bg-[#1A2B4A] text-white text-sm font-medium px-5 py-2.5 rounded-full transition-colors"
        >
          + New Program
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-stone-50">
              {['Program', 'Domain', 'Type', 'Price', 'Enrolled', 'Status'].map(h => (
                <th key={h} className="text-left text-[10px] text-stone-400 tracking-widest uppercase px-5 py-4 font-medium first:pl-6 last:pr-6">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {programs.map(p => (
              <tr key={p.id} className="hover:bg-stone-50/40 transition-colors">
                <td className="px-6 py-4">
                  <div>
                    <p className="text-[#0A1628] text-sm font-medium">{p.title}</p>
                    {p.coach && <p className="text-stone-400 text-xs mt-0.5">by {p.coach.user.name}</p>}
                    {p.duration && <p className="text-stone-300 text-xs">{p.duration}</p>}
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                    style={{ background: `${getDomainColor(p.domain)}15`, color: getDomainColor(p.domain) }}>
                    {getDomainLabel(p.domain)}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className="text-[10px] bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full">
                    {p.type.charAt(0) + p.type.slice(1).toLowerCase()}
                  </span>
                </td>
                <td className="px-5 py-4 text-[#0A1628] text-sm font-display">
                  {p.price === 0 ? 'Free' : formatCurrency(p.price, p.currency)}
                </td>
                <td className="px-5 py-4 text-stone-500 text-sm">{p._count.enrollments}</td>
                <td className="px-5 py-4 pr-6">
                  <ProgramToggle programId={p.id} isPublished={p.isPublished} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {programs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-stone-400 text-sm">No programs yet. Create your first one!</p>
          </div>
        )}
      </div>
    </div>
  )
}
