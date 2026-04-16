// PATCH  /api/trainers/[id]/accreditations/[accId]  → update status (ACTIVE | REVOKED | SUSPENDED)
// DELETE /api/trainers/[id]/accreditations/[accId]  → revoke (set REVOKED)

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function PATCH(
  req: Request,
  { params }: { params: { id: string; accId: string } },
) {
  const session = await auth()
  if ((session?.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { status } = await req.json()
  if (!['ACTIVE', 'REVOKED', 'SUSPENDED'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  const updated = await prisma.trainerAccreditation.update({
    where:   { id: params.accId },
    data:    { status, updatedAt: new Date() },
    include: { curriculum: true },
  })

  return NextResponse.json(updated)
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string; accId: string } },
) {
  const session = await auth()
  if ((session?.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await prisma.trainerAccreditation.update({
    where: { id: params.accId },
    data:  { status: 'REVOKED', updatedAt: new Date() },
  })

  return NextResponse.json({ success: true })
}
