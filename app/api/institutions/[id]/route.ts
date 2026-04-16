// GET    /api/institutions/[id]  → institution details
// PATCH  /api/institutions/[id]  → approve / reject / update
// DELETE /api/institutions/[id]  → deactivate

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const updateSchema = z.object({
  approvalStatus: z.enum(['APPROVED', 'REJECTED']).optional(),
  isActive:       z.boolean().optional(),
})

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if ((session?.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const institution = await prisma.institution.findUnique({
    where:   { id: params.id },
    include: {
      user:     { select: { id: true, name: true, email: true, createdAt: true } },
      trainers: {
        include: {
          user:           { select: { id: true, name: true, email: true } },
          accreditations: { include: { curriculum: true } },
        },
      },
    },
  })

  if (!institution) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(institution)
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if ((session?.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body   = await req.json()
  const parsed = updateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const data: any = { ...parsed.data }
  if (parsed.data.approvalStatus === 'APPROVED') {
    data.approvedAt   = new Date()
    data.approvedById = (session?.user as any)?.id
  }

  const institution = await prisma.institution.update({
    where: { id: params.id },
    data,
  })

  return NextResponse.json(institution)
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if ((session?.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await prisma.institution.update({
    where: { id: params.id },
    data:  { isActive: false },
  })

  return NextResponse.json({ success: true })
}
