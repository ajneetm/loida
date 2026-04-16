import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Users, BookOpen, Award } from 'lucide-react'
import AddTrainerModal from './AddTrainerModal'

export default async function InstitutionDashboard() {
  const session = await auth()
  if (!session?.user) redirect('/auth/login')

  const [institution, curricula] = await Promise.all([
    prisma.institution.findUnique({
      where: { userId: session.user.id },
      include: {
        trainers: {
          include: {
            user:           { select: { name: true, email: true, createdAt: true } },
            accreditations: { where: { status: 'ACTIVE' }, include: { curriculum: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    }),
    prisma.curriculum.findMany({
      where:   { isActive: true },
      orderBy: { name: 'asc' },
      select:  { id: true, name: true, domain: true },
    }),
  ])

  if (!institution) redirect('/dashboard')

  const totalTrainers       = institution.trainers.length
  const approvedTrainers    = institution.trainers.filter(t => (t as any).approvalStatus === 'APPROVED').length
  const totalAccreditations = institution.trainers.reduce((sum, t) => sum + t.accreditations.length, 0)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-[#1C2B39]">{institution.institutionName}</h1>
        <p className="text-sm text-[#6B8F9E] mt-1">
          {institution.nationality} · Founded {institution.foundedYear ?? '—'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={<Users className="w-5 h-5" />}    label="Total Trainers"    value={totalTrainers} />
        <StatCard icon={<Award className="w-5 h-5" />}    label="Approved Trainers" value={approvedTrainers} />
        <StatCard icon={<BookOpen className="w-5 h-5" />} label="Accreditations"    value={totalAccreditations} />
      </div>

      <div className="bg-white border border-[#E8E4DC] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E8E4DC] flex items-center justify-between">
          <h2 className="font-medium text-[#1C2B39]">Trainers</h2>
          <AddTrainerModal curricula={curricula} institutionId={institution.id} />
        </div>

        {institution.trainers.length === 0 ? (
          <div className="p-16 text-center space-y-4">
            <Users className="w-12 h-12 mx-auto text-[#6B8F9E] opacity-30" />
            <div>
              <p className="text-[#1C2B39] font-medium">No trainers yet</p>
              <p className="text-sm text-[#6B8F9E] mt-1">Add your first trainer to get started</p>
            </div>
            <AddTrainerModal curricula={curricula} institutionId={institution.id} large />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#F8F7F4] text-[#6B8F9E] text-xs uppercase">
                <tr>
                  <th className="px-6 py-3 text-left font-medium">Name</th>
                  <th className="px-6 py-3 text-left font-medium">Email</th>
                  <th className="px-6 py-3 text-left font-medium">Curricula</th>
                  <th className="px-6 py-3 text-left font-medium">Status</th>
                  <th className="px-6 py-3 text-left font-medium">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E4DC]">
                {institution.trainers.map((trainer) => (
                  <tr key={trainer.id} className="hover:bg-[#F8F7F4] transition-colors">
                    <td className="px-6 py-4 font-medium text-[#1C2B39]">{trainer.user.name}</td>
                    <td className="px-6 py-4 text-[#6B8F9E]">{trainer.user.email}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {trainer.accreditations.length === 0 ? (
                          <span className="text-[#6B8F9E] text-xs">None</span>
                        ) : trainer.accreditations.map(acc => (
                          <span key={acc.id} className="px-2 py-0.5 bg-[#E8F4F8] text-[#1C2B39] text-xs">
                            {acc.curriculum.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <ApprovalBadge status={(trainer as any).approvalStatus} />
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
  return <span className={`px-2 py-0.5 text-xs font-medium ${cls}`}>{label}</span>
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="bg-white border border-[#E8E4DC] p-5 flex items-center gap-4">
      <div className="w-10 h-10 bg-[#F8F7F4] flex items-center justify-center text-[#1C2B39]">
        {icon}
      </div>
      <div>
        <p className="text-2xl font-semibold text-[#1C2B39]">{value}</p>
        <p className="text-xs text-[#6B8F9E]">{label}</p>
      </div>
    </div>
  )
}
