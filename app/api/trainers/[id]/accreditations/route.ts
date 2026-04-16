// GET  /api/trainers/[id]/accreditations
// POST /api/trainers/[id]/accreditations

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const accreditSchema = z.object({
  curriculumId: z.string(),
})

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  const role    = (session?.user as any)?.role
  const userId  = session?.user?.id

  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (role === 'TRAINER') {
    const trainer = await prisma.trainer.findUnique({ where: { userId } })
    if (!trainer || trainer.id !== params.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
  } else if (!['ADMIN', 'INSTITUTION'].includes(role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const accreditations = await prisma.trainerAccreditation.findMany({
    where:   { trainerId: params.id },
    include: { curriculum: true },
    orderBy: { createdAt: 'asc' },
  })

  return NextResponse.json(accreditations)
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  const role    = (session?.user as any)?.role
  const userId  = session?.user?.id

  if (!userId || !['ADMIN', 'INSTITUTION'].includes(role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  if (role === 'INSTITUTION') {
    const institution = await prisma.institution.findUnique({ where: { userId } })
    const trainer     = await prisma.trainer.findUnique({ where: { id: params.id } })
    if (!institution || !trainer || trainer.institutionId !== institution.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
  }

  const body   = await req.json()
  const parsed = accreditSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const activeCount = await prisma.trainerAccreditation.count({
    where: { trainerId: params.id, status: 'ACTIVE' },
  })
  if (activeCount >= 2) {
    return NextResponse.json({ error: 'Trainer can have at most 2 active curricula' }, { status: 422 })
  }

  const accreditation = await prisma.trainerAccreditation.upsert({
    where: {
      trainerId_curriculumId: {
        trainerId:    params.id,
        curriculumId: parsed.data.curriculumId,
      },
    },
    update: { status: 'ACTIVE', updatedAt: new Date() },
    create: {
      trainerId:    params.id,
      curriculumId: parsed.data.curriculumId,
      status:       'ACTIVE',
    },
    include: { curriculum: true },
  })

  return NextResponse.json(accreditation, { status: 201 })
}
