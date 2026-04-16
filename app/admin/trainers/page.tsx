import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { TrainerRowActions, AccreditationButton, AddTrainerButton } from './TrainerActions'

export default async function AdminTrainersPage() {
  const session = await auth()
  if ((session?.user as any)?.role !== 'ADMIN') redirect('/dashboard')

  const trainers = await prisma.trainer.findMany({
    include: {
      user:           { select: { name: true, email: true, createdAt: true } },
      institution:    { include: { user: { select: { name: true } } } },
      accreditations: { include: { curriculum: true } },
    },
    orderBy: [
      { approvalStatus: 'asc' },
      { createdAt: 'desc' },
    ],
  })

  const pending  = trainers.filter(t => t.approvalStatus === 'PENDING')
  const approved = trainers.filter(t => t.approvalStatus === 'APPROVED')
  const rejected = trainers.filter(t => t.approvalStatus === 'REJECTED')

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#1C2B39]">Trainers</h1>
          <p className="text-sm text-[#6B8F9E] mt-1">
            <span className="font-medium text-amber-600">{pending.length} pending</span>
            {' · '}
            <span className="font-medium text-green-600">{approved.length} approved</span>
            {' · '}
            <span className="font-medium text-red-500">{rejected.length} rejected</span>
          </p>
        </div>
        <AddTrainerButton />
      </div>

      {pending.length > 0 && (
        <Section title="Pending Approval" color="amber">
          {pending.map(t => <TrainerRow key={t.id} trainer={t} />)}
        </Section>
      )}

      {approved.length > 0 && (
        <Section title="Approved" color="green">
          {approved.map(t => <TrainerRow key={t.id} trainer={t} />)}
        </Section>
      )}

      {rejected.length > 0 && (
        <Section title="Rejected" color="red">
          {rejected.map(t => <TrainerRow key={t.id} trainer={t} />)}
        </Section>
      )}

      {trainers.length === 0 && (
        <div className="bg-white border border-[#E8E4DC] p-12 text-center text-[#6B8F9E]">
          No trainers yet
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

function TrainerRow({ trainer }: { trainer: any }) {
  return (
    <div className="px-6 py-4 flex items-center justify-between gap-4">
      <div className="min-w-0 flex-1">
        <p className="font-medium text-[#1C2B39]">{trainer.user.name}</p>
        <p className="text-xs text-[#6B8F9E]">{trainer.user.email}</p>
        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
          {trainer.institution
            ? <span className="text-xs text-[#6B8F9E]">Institution: <span className="text-[#1C2B39]">{trainer.institution.user.name}</span></span>
            : <span className="text-xs text-[#6B8F9E]">Independent</span>
          }
          <span className="text-xs text-[#6B8F9E]">{trainer.nationality} · {trainer.residence}</span>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <AccreditationButton
          trainerId={trainer.id}
          trainerName={trainer.user.name ?? 'Trainer'}
          approvalStatus={trainer.approvalStatus}
        />
        <TrainerRowActions
          trainerId={trainer.id}
          trainerName={trainer.user.name ?? 'Trainer'}
          canApprove={trainer.approvalStatus === 'PENDING'}
        />
      </div>
    </div>
  )
}
