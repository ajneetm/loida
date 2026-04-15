import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, Users } from 'lucide-react'

export default async function AdminAgentsPage() {
  const session = await auth()
  if ((session?.user as any)?.role !== 'ADMIN') redirect('/dashboard')

  const agents = await prisma.agent.findMany({
    include: {
      user:     { select: { name: true, email: true, createdAt: true } },
      trainers: { select: { id: true, isActive: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-[#1C2B39]">Agents</h1>
        <Link
          href="/admin/agents/new"
          className="flex items-center gap-2 bg-[#1C2B39] text-white px-4 py-2 rounded-none text-sm hover:bg-[#2a3f52] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Agent
        </Link>
      </div>

      <div className="bg-white rounded-none border border-[#E8E4DC] overflow-hidden">
        {agents.length === 0 ? (
          <div className="p-12 text-center text-[#6B8F9E]">
            <Users className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p>No agents yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#F8F7F4] text-[#6B8F9E] text-xs uppercase">
                <tr>
                  <th className="px-6 py-3 text-left font-medium">Name</th>
                  <th className="px-6 py-3 text-left font-medium">Email</th>
                  <th className="px-6 py-3 text-left font-medium">Country</th>
                  <th className="px-6 py-3 text-left font-medium">Company</th>
                  <th className="px-6 py-3 text-left font-medium">Trainers</th>
                  <th className="px-6 py-3 text-left font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E4DC]">
                {agents.map((agent) => (
                  <tr key={agent.id} className="hover:bg-[#F8F7F4]">
                    <td className="px-6 py-4 font-medium text-[#1C2B39]">{agent.user.name}</td>
                    <td className="px-6 py-4 text-[#6B8F9E]">{agent.user.email}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 bg-[#F8F7F4] rounded-none text-xs font-medium">
                        {agent.country === 'QA' ? 'Qatar' : agent.country === 'SA' ? 'Saudi Arabia' : agent.country}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#6B8F9E]">{agent.companyName || '—'}</td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-[#1C2B39]">
                        {agent.trainers.filter(t => t.isActive).length}
                      </span>
                      <span className="text-[#6B8F9E]"> / {agent.trainers.length}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-none text-xs font-medium ${
                        agent.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {agent.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
