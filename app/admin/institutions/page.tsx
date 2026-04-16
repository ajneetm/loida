import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { InstitutionRowActions, AddInstitutionButton } from './InstitutionActions'

export default async function AdminInstitutionsPage() {
  const session = await auth()
  if ((session?.user as any)?.role !== 'ADMIN') redirect('/dashboard')

  const institutions = await prisma.institution.findMany({
    include: {
      user:     { select: { name: true, email: true, createdAt: true } },
      trainers: { select: { id: true } },
    },
    orderBy: [
      { approvalStatus: 'asc' },
      { createdAt: 'desc' },
    ],
  })

  const pending  = institutions.filter(i => i.approvalStatus === 'PENDING')
  const approved = institutions.filter(i => i.approvalStatus === 'APPROVED')
  const rejected = institutions.filter(i => i.approvalStatus === 'REJECTED')

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#1C2B39]">Institutions</h1>
          <p className="text-sm text-[#6B8F9E] mt-1">
            <span className="font-medium text-amber-600">{pending.length} pending</span>
            {' · '}
            <span className="font-medium text-green-600">{approved.length} approved</span>
            {' · '}
            <span className="font-medium text-red-500">{rejected.length} rejected</span>
          </p>
        </div>
        <AddInstitutionButton />
      </div>

      {pending.length > 0 && (
        <Section title="Pending Approval" color="amber">
          {pending.map(i => <InstitutionRow key={i.id} institution={i} />)}
        </Section>
      )}

      {approved.length > 0 && (
        <Section title="Approved" color="green">
          {approved.map(i => <InstitutionRow key={i.id} institution={i} />)}
        </Section>
      )}

      {rejected.length > 0 && (
        <Section title="Rejected" color="red">
          {rejected.map(i => <InstitutionRow key={i.id} institution={i} />)}
        </Section>
      )}

      {institutions.length === 0 && (
        <div className="bg-white border border-[#E8E4DC] p-12 text-center text-[#6B8F9E]">
          No institutions yet
        </div>
      )}
    </div>
  )
}

function Section({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  const colors: Record<string, string> = {
    amber: 'bg-amber-50 border-amber-200 text-amber-800',
    green: 'bg-green-50 border-green-200 text-green-800',
    red:   'bg-red-50 border-red-200 text-red-800',
  }
  return (
    <div className="space-y-3">
      <div className={`inline-flex px-3 py-1 text-xs font-medium border ${colors[color]}`}>
        {title}
      </div>
      <div className="bg-white border border-[#E8E4DC] overflow-hidden">
        <div className="divide-y divide-[#E8E4DC]">{children}</div>
      </div>
    </div>
  )
}

function InstitutionRow({ institution }: { institution: any }) {
  return (
    <div className="px-6 py-4 flex items-center justify-between gap-4">
      <div className="min-w-0 flex-1">
        <p className="font-medium text-[#1C2B39]">{institution.institutionName}</p>
        <p className="text-xs text-[#6B8F9E]">{institution.user.email}</p>
        <div className="flex items-center gap-3 mt-1 flex-wrap text-xs text-[#6B8F9E]">
          <span>Founder: <span className="text-[#1C2B39]">{institution.founderName}</span></span>
          <span>{institution.nationality}</span>
          {institution.foundedYear && <span>Est. {institution.foundedYear}</span>}
          {institution.employeeCount && <span>{institution.employeeCount} employees</span>}
          <span>{institution.trainers.length} trainers</span>
        </div>
        {institution.website && (
          <a href={institution.website} target="_blank" rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:underline mt-0.5 block">
            {institution.website}
          </a>
        )}
      </div>
      <InstitutionRowActions
        institutionId={institution.id}
        institutionName={institution.institutionName}
        canApprove={institution.approvalStatus === 'PENDING'}
      />
    </div>
  )
}
