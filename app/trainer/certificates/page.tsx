import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Award, Plus } from 'lucide-react'

export default async function TrainerCertificatesPage() {
  const session = await auth()
  if (!session?.user) redirect('/auth/login')

  const trainer = await prisma.trainer.findUnique({
    where: { userId: session.user.id },
    include: {
      certificateRequests: { orderBy: { createdAt: 'desc' } },
    },
  })

  if (!trainer) redirect('/dashboard')

  const requests = trainer.certificateRequests

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#1C2B39]">Certificate Requests</h1>
          <p className="text-sm text-[#6B8F9E] mt-1">{requests.length} total request{requests.length !== 1 ? 's' : ''}</p>
        </div>
        <Link
          href="/trainer/certificates/new"
          className="flex items-center gap-2 bg-[#1C2B39] text-white px-4 py-2 text-sm hover:bg-[#2a3f52] transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Request
        </Link>
      </div>

      <div className="bg-white border border-[#E8E4DC] overflow-hidden">
        {requests.length === 0 ? (
          <div className="p-16 text-center space-y-4">
            <Award className="w-12 h-12 mx-auto text-[#6B8F9E] opacity-30" />
            <div>
              <p className="text-[#1C2B39] font-medium">No certificate requests yet</p>
              <p className="text-sm text-[#6B8F9E] mt-1">Submit a request for a trainee who completed your workshop</p>
            </div>
            <Link
              href="/trainer/certificates/new"
              className="inline-flex items-center gap-2 bg-[#1C2B39] text-white px-5 py-2.5 text-sm hover:bg-[#2a3f52] transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Request
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-[#E8E4DC]">
            {requests.map(req => (
              <div key={req.id} className="px-6 py-4 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-medium text-[#1C2B39]">{req.traineeName}</p>
                  <p className="text-xs text-[#6B8F9E] mt-0.5">{req.traineeEmail}</p>
                  <p className="text-xs text-[#6B8F9E] mt-0.5">
                    Workshop: {new Date(req.workshopDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <StatusBadge status={req.status} />
                  <p className="text-xs text-[#6B8F9E] hidden sm:block">
                    {new Date(req.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
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
  return <span className={`px-2 py-0.5 text-xs font-medium ${cls}`}>{label}</span>
}
