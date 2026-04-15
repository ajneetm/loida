import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { BookOpen, Award, ExternalLink, FileText } from 'lucide-react'

export default async function TrainerDashboard() {
  const session = await auth()
  if (!session?.user) redirect('/auth/login')

  const trainer = await prisma.trainer.findUnique({
    where: { userId: session.user.id },
    include: {
      agent:          { include: { user: { select: { name: true } } } },
      accreditations: {
        include: { curriculum: true },
        orderBy: { createdAt: 'asc' },
      },
      certificateRequests: {
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
    },
  })

  if (!trainer) redirect('/dashboard')

  const activeAccreditations = trainer.accreditations.filter(a => a.status === 'ACTIVE')
  const pendingCerts         = trainer.certificateRequests.filter(r => r.status === 'PENDING').length

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-[#1C2B39]">Trainer Dashboard</h1>
        <p className="text-sm text-[#6B8F9E] mt-1">
          Registered via agent: {trainer.agent.user.name}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={<BookOpen className="w-5 h-5" />} label="Accredited Curricula" value={activeAccreditations.length} />
        <StatCard icon={<FileText className="w-5 h-5" />} label="Certificate Requests"  value={trainer.certificateRequests.length} />
        <StatCard icon={<Award className="w-5 h-5" />}    label="Pending"               value={pendingCerts} color="amber" />
      </div>

      {/* Curricula */}
      <div className="space-y-3">
        <h2 className="font-medium text-[#1C2B39]">My Curricula</h2>
        {activeAccreditations.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#E8E4DC] p-10 text-center text-[#6B8F9E]">
            <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p>You have not been accredited for any curriculum yet.</p>
            <p className="text-xs mt-1">Contact your agent to get assigned.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {activeAccreditations.map((acc) => (
              <CurriculumCard key={acc.id} accreditation={acc} />
            ))}
          </div>
        )}
      </div>

      {/* Recent Certificate Requests */}
      {trainer.certificateRequests.length > 0 && (
        <div className="bg-white rounded-xl border border-[#E8E4DC] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#E8E4DC] flex items-center justify-between">
            <h2 className="font-medium text-[#1C2B39]">Recent Certificate Requests</h2>
            <Link href="/trainer/certificates" className="text-xs text-[#6B8F9E] hover:text-[#1C2B39]">
              View all
            </Link>
          </div>
          <div className="divide-y divide-[#E8E4DC]">
            {trainer.certificateRequests.map((req) => (
              <div key={req.id} className="px-6 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#1C2B39]">{req.traineeName}</p>
                  <p className="text-xs text-[#6B8F9E]">{req.traineeEmail}</p>
                </div>
                <StatusBadge status={req.status} />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <Link href="/trainer/certificates/new"
          className="flex items-center gap-2 bg-[#1C2B39] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#2a3f52] transition-colors">
          <Award className="w-4 h-4" />
          Request Certificate
        </Link>
        <Link href="/trainer/certificates"
          className="flex items-center gap-2 border border-[#E8E4DC] text-[#1C2B39] px-4 py-2 rounded-lg text-sm hover:bg-[#F8F7F4] transition-colors">
          <FileText className="w-4 h-4" />
          All Requests
        </Link>
      </div>
    </div>
  )
}

function CurriculumCard({ accreditation }: { accreditation: any }) {
  const domainColors: Record<string, string> = {
    HARMONY:  'bg-[#6B8F9E]',
    CAREER:   'bg-[#B8973A]',
    BUSINESS: 'bg-[#2C4A3E]',
  }
  const color = domainColors[accreditation.curriculum.domain] || 'bg-[#1C2B39]'
  return (
    <div className="bg-white rounded-xl border border-[#E8E4DC] overflow-hidden">
      <div className={`${color} px-5 py-4`}>
        <h3 className="text-white font-semibold">{accreditation.curriculum.name}</h3>
        <p className="text-white/70 text-xs mt-0.5">{accreditation.curriculum.domain}</p>
      </div>
      <div className="px-5 py-4 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#6B8F9E]">Accredited on</span>
          <span className="text-[#1C2B39]">{new Date(accreditation.createdAt).toLocaleDateString()}</span>
        </div>
        <a href={accreditation.curriculum.siteUrl} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 w-full justify-center border border-[#E8E4DC] text-[#1C2B39] py-2 rounded-lg text-sm hover:bg-[#F8F7F4] transition-colors">
          <ExternalLink className="w-3.5 h-3.5" />
          Go to Site
        </a>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, color = 'default' }: {
  icon: React.ReactNode; label: string; value: number; color?: string
}) {
  return (
    <div className="bg-white rounded-xl border border-[#E8E4DC] p-5 flex items-center gap-4">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
        color === 'amber' ? 'bg-amber-50 text-amber-600' : 'bg-[#F8F7F4] text-[#1C2B39]'
      }`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-semibold text-[#1C2B39]">{value}</p>
        <p className="text-xs text-[#6B8F9E]">{label}</p>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    PENDING:  { label: 'Pending',  cls: 'bg-amber-100 text-amber-700' },
    APPROVED: { label: 'Approved', cls: 'bg-blue-100 text-blue-700' },
    ISSUED:   { label: 'Issued',   cls: 'bg-green-100 text-green-700' },
    REJECTED: { label: 'Rejected', cls: 'bg-red-100 text-red-700' },
  }
  const { label, cls } = map[status] ?? { label: status, cls: 'bg-gray-100 text-gray-700' }
  return <span className={`px-2 py-0.5 rounded text-xs font-medium ${cls}`}>{label}</span>
}
