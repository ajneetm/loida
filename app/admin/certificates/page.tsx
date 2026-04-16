import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import CertificateActions from './CertificateActions'

export default async function AdminCertificatesPage() {
  const session = await auth()
  if ((session?.user as any)?.role !== 'ADMIN') redirect('/dashboard')

  const requests = await prisma.certificateRequest.findMany({
    include: {
      trainer: { include: { user: { select: { name: true, email: true } } } },
    },
    orderBy: [
      { status: 'asc' },
      { createdAt: 'desc' },
    ],
  })

  const pending  = requests.filter(r => r.status === 'PENDING')
  const approved = requests.filter(r => r.status === 'APPROVED')
  const issued   = requests.filter(r => r.status === 'ISSUED')
  const rejected = requests.filter(r => r.status === 'REJECTED')

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-[#1C2B39]">Certificate Requests</h1>
        <p className="text-sm text-[#6B8F9E] mt-1">
          <span className="text-amber-600 font-medium">{pending.length} pending</span>
          {' · '}
          <span className="text-blue-600 font-medium">{approved.length} approved</span>
          {' · '}
          <span className="text-green-600 font-medium">{issued.length} issued</span>
          {' · '}
          <span className="text-red-500 font-medium">{rejected.length} rejected</span>
        </p>
      </div>

      {requests.length === 0 && (
        <div className="bg-white border border-[#E8E4DC] p-12 text-center text-[#6B8F9E]">
          No certificate requests yet
        </div>
      )}

      {pending.length > 0 && (
        <Section title="Pending" color="amber">
          {pending.map(r => <RequestRow key={r.id} request={r} showActions />)}
        </Section>
      )}

      {approved.length > 0 && (
        <Section title="Approved — Ready to Issue" color="blue">
          {approved.map(r => <RequestRow key={r.id} request={r} showActions />)}
        </Section>
      )}

      {issued.length > 0 && (
        <Section title="Issued" color="green">
          {issued.map(r => <RequestRow key={r.id} request={r} />)}
        </Section>
      )}

      {rejected.length > 0 && (
        <Section title="Rejected" color="red">
          {rejected.map(r => <RequestRow key={r.id} request={r} />)}
        </Section>
      )}
    </div>
  )
}

function Section({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  const colors: Record<string, string> = {
    amber: 'bg-amber-50 border-amber-200 text-amber-800',
    blue:  'bg-blue-50 border-blue-200 text-blue-800',
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

function RequestRow({ request, showActions }: { request: any; showActions?: boolean }) {
  return (
    <div className="px-6 py-4 flex items-center justify-between gap-4">
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex items-center gap-3 flex-wrap">
          <p className="font-medium text-[#1C2B39]">{request.traineeName}</p>
          <p className="text-xs text-[#6B8F9E]">{request.traineeEmail}</p>
        </div>
        <div className="flex items-center gap-3 text-xs text-[#6B8F9E] flex-wrap">
          <span>Trainer: <span className="text-[#1C2B39]">{request.trainer.user.name}</span></span>
          <span>Workshop: {new Date(request.workshopDate).toLocaleDateString()}</span>
          <span>Requested: {new Date(request.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
      {showActions && <CertificateActions requestId={request.id} status={request.status} />}
    </div>
  )
}
