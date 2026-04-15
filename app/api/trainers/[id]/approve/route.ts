// POST /api/trainers/[id]/approve  → approve or reject trainer (admin only)

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const schema = z.object({
  action: z.enum(['APPROVE', 'REJECT']),
})

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  const role    = (session?.user as any)?.role
  const userId  = session?.user?.id

  if (!userId || role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body   = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { action } = parsed.data
  const approvalStatus = action === 'APPROVE' ? 'APPROVED' : 'REJECTED'

  const trainer = await prisma.trainer.update({
    where: { id: params.id },
    data: {
      approvalStatus,
      approvedAt:   action === 'APPROVE' ? new Date() : null,
      approvedById: action === 'APPROVE' ? userId : null,
    },
    include: {
      user: { select: { name: true, email: true } },
    },
  })

  return NextResponse.json(trainer)
}
