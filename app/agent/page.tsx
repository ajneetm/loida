import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Users, BookOpen, Award, Plus } from 'lucide-react'

export default async function AgentDashboard() {
  const session = await auth()
  if (!session?.user) redirect('/auth/login')

  const agent = await prisma.agent.findUnique({
    where: { userId: session.user.id },
    include: {
      trainers: {
        include: {
          user:           { select: { name: true, email: true, createdAt: true } },
          accreditations: {
            where:   { status: 'ACTIVE' },
            include: { curriculum: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!agent) redirect('/dashboard')

  const totalTrainers       = agent.trainers.length
  const activeTrainers      = agent.trainers.filter(t => t.isActive).length
  const totalAccreditations = agent.trainers.reduce((sum, t) => sum + t.accreditations.length, 0)

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#1C2B39]">Agent Dashboard</h1>
          <p className="text-sm text-[#6B8F9E] mt-1">
            {agent.companyName || session.user.name} — {agent.country}
          </p>
        </div>
        <Link
          href="/agent/trainers/new"
          className="flex items-center gap-2 bg-[#1C2B39] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#2a3f52] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Trainer
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={<Users className="w-5 h-5" />}    label="Total Trainers"   value={totalTrainers} />
        <StatCard icon={<Award className="w-5 h-5" />}    label="Active Trainers"  value={activeTrainers} />
        <StatCard icon={<BookOpen className="w-5 h-5" />} label="Accreditations"   value={totalAccreditations} />
      </div>

      <div className="bg-white rounded-xl border border-[#E8E4DC] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E8E4DC]">
          <h2 className="font-medium text-[#1C2B39]">Trainers</h2>
        </div>

        {agent.trainers.length === 0 ? (
          <div className="p-12 text-center text-[#6B8F9E]">
            <Users className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p>No trainers yet</p>
            <Link href="/agent/trainers/new" className="text-sm text-[#1C2B39] underline mt-2 inline-block">
              Add your first trainer
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#F8F7F4] text-[#6B8F9E] text-xs uppercase">
                <tr>
                  <th className="px-6 py-3 text-left font-medium">Name</th>
                  <th className="px-6 py-3 text-left font-medium">Email</th>
                  <th className="px-6 py-3 text-left font-medium">Curricula</th>
                  <th className="px-6 py-3 text-left font-medium">Approval</th>
                  <th className="px-6 py-3 text-left font-medium">Status</th>
                  <th className="px-6 py-3 text-left font-medium">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E4DC]">
                {agent.trainers.map((trainer) => (
                  <tr key={trainer.id} className="hover:bg-[#F8F7F4] transition-colors">
                    <td className="px-6 py-4 font-medium text-[#1C2B39]">{trainer.user.name}</td>
                    <td className="px-6 py-4 text-[#6B8F9E]">{trainer.user.email}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {trainer.accreditations.length === 0 ? (
                          <span className="text-[#6B8F9E] text-xs">None</span>
                        ) : (
                          trainer.accreditations.map((acc) => (
                            <span key={acc.id} className="px-2 py-0.5 bg-[#E8F4F8] text-[#1C2B39] rounded text-xs">
                              {acc.curriculum.name}
                            </span>
                          ))
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <ApprovalBadge status={(trainer as any).approvalStatus} />
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        trainer.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {trainer.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#6B8F9E]">
                      {new Date(trainer.user.createdAt).toLocaleDateString()}
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

function ApprovalBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    PENDING:  { label: 'Pending',  cls: 'bg-amber-100 text-amber-700' },
    APPROVED: { label: 'Approved', cls: 'bg-green-100 text-green-700' },
    REJECTED: { label: 'Rejected', cls: 'bg-red-100 text-red-700' },
  }
  const { label, cls } = map[status] ?? { label: status, cls: 'bg-gray-100 text-gray-700' }
  return <span className={`px-2 py-0.5 rounded text-xs font-medium ${cls}`}>{label}</span>
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="bg-white rounded-xl border border-[#E8E4DC] p-5 flex items-center gap-4">
      <div className="w-10 h-10 rounded-lg bg-[#F8F7F4] flex items-center justify-center text-[#1C2B39]">
        {icon}
      </div>
      <div>
        <p className="text-2xl font-semibold text-[#1C2B39]">{value}</p>
        <p className="text-xs text-[#6B8F9E]">{label}</p>
      </div>
    </div>
  )
}
