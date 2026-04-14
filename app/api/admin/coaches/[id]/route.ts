import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { z } from 'zod'

const schema = z.object({
  status: z.enum(['APPROVED', 'REJECTED', 'PENDING']),
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const body   = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ message: 'Invalid status' }, { status: 400 })

  const coach = await prisma.coach.update({
    where: { id: params.id },
    data:  { status: parsed.data.status },
  })

  // If approved → upgrade user role to COACH
  if (parsed.data.status === 'APPROVED') {
    await prisma.user.update({
      where: { id: coach.userId },
      data:  { role: 'COACH' },
    })
  }

  // If revoked → downgrade back to USER
  if (parsed.data.status === 'REJECTED') {
    await prisma.user.update({
      where: { id: coach.userId },
      data:  { role: 'USER' },
    })
  }

  return NextResponse.json(coach)
}
