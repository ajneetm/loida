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
          user:          { select: { name: true, email: true, createdAt: true } },
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

  const totalTrainers      = agent.trainers.length
  const activeTrainers     = agent.trainers.filter(t => t.isActive).length
  const totalAccreditations = agent.trainers.reduce((sum, t) => sum + t.accreditations.length, 0)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#1C2B39]">لوحة الوكيل</h1>
          <p className="text-sm text-[#6B8F9E] mt-1">
            {agent.companyName || session.user.name} — {agent.country}
          </p>
        </div>
        <Link
          href="/agent/trainers/new"
          className="flex items-center gap-2 bg-[#1C2B39] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#2a3f52] transition-colors"
        >
          <Plus className="w-4 h-4" />
          إضافة مدرب
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={<Users className="w-5 h-5" />} label="إجمالي المدربين" value={totalTrainers} />
        <StatCard icon={<Award className="w-5 h-5" />} label="المدربون النشطون" value={activeTrainers} />
        <StatCard icon={<BookOpen className="w-5 h-5" />} label="الاعتمادات" value={totalAccreditations} />
      </div>

      {/* Trainers Table */}
      <div className="bg-white rounded-xl border border-[#E8E4DC] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E8E4DC]">
          <h2 className="font-medium text-[#1C2B39]">المدربون</h2>
        </div>

        {agent.trainers.length === 0 ? (
          <div className="p-12 text-center text-[#6B8F9E]">
            <Users className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p>لا يوجد مدربون بعد</p>
            <Link href="/agent/trainers/new" className="text-sm text-[#1C2B39] underline mt-2 inline-block">
              أضف أول مدرب
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#F8F7F4] text-[#6B8F9E] text-xs uppercase">
                <tr>
                  <th className="px-6 py-3 text-right font-medium">الاسم</th>
                  <th className="px-6 py-3 text-right font-medium">البريد</th>
                  <th className="px-6 py-3 text-right font-medium">المناهج</th>
                  <th className="px-6 py-3 text-right font-medium">الحالة</th>
                  <th className="px-6 py-3 text-right font-medium">تاريخ التسجيل</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E4DC]">
                {agent.trainers.map((trainer) => (
                  <tr key={trainer.id} className="hover:bg-[#F8F7F4] transition-colors">
                    <td className="px-6 py-4 font-medium text-[#1C2B39]">
                      {trainer.user.name}
                    </td>
                    <td className="px-6 py-4 text-[#6B8F9E]">{trainer.user.email}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {trainer.accreditations.length === 0 ? (
                          <span className="text-[#6B8F9E] text-xs">لا يوجد</span>
                        ) : (
                          trainer.accreditations.map((acc) => (
                            <span
                              key={acc.id}
                              className="px-2 py-0.5 bg-[#E8F4F8] text-[#1C2B39] rounded text-xs"
                            >
                              {acc.curriculum.name}
                            </span>
                          ))
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        trainer.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {trainer.isActive ? 'نشط' : 'موقوف'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#6B8F9E]">
                      {new Date(trainer.user.createdAt).toLocaleDateString('ar')}
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
