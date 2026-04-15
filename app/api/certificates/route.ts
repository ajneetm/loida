// GET  /api/certificates  → list requests (admin: all, trainer: own)
// POST /api/certificates  → submit certificate request (trainer only)

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const createSchema = z.object({
  curriculumId: z.string(),
  traineeName:  z.string().min(2),
  traineeEmail: z.string().email(),
  workshopDate: z.string(), // ISO date string
  notes:        z.string().optional(),
})

export async function GET() {
  const session = await auth()
  const role    = (session?.user as any)?.role
  const userId  = session?.user?.id

  if (!userId || !['ADMIN', 'TRAINER'].includes(role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  let where = {}

  if (role === 'TRAINER') {
    const trainer = await prisma.trainer.findUnique({ where: { userId } })
    if (!trainer) return NextResponse.json({ error: 'Trainer not found' }, { status: 404 })
    where = { trainerId: trainer.id }
  }

  const requests = await prisma.certificateRequest.findMany({
    where,
    include: {
      trainer: { include: { user: { select: { name: true } } } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(requests)
}

export async function POST(req: Request) {
  const session = await auth()
  const role    = (session?.user as any)?.role
  const userId  = session?.user?.id

  if (!userId || role !== 'TRAINER') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const trainer = await prisma.trainer.findUnique({ where: { userId } })
  if (!trainer || !trainer.isActive) {
    return NextResponse.json({ error: 'Trainer not found or inactive' }, { status: 403 })
  }

  const body   = await req.json()
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  // Verify trainer is accredited for this curriculum
  const accreditation = await prisma.trainerAccreditation.findUnique({
    where: {
      trainerId_curriculumId: {
        trainerId:    trainer.id,
        curriculumId: parsed.data.curriculumId,
      },
    },
  })

  if (!accreditation || accreditation.status !== 'ACTIVE') {
    return NextResponse.json({ error: 'Not accredited for this curriculum' }, { status: 403 })
  }

  const request = await prisma.certificateRequest.create({
    data: {
      trainerId:    trainer.id,
      curriculumId: parsed.data.curriculumId,
      traineeName:  parsed.data.traineeName,
      traineeEmail: parsed.data.traineeEmail,
      workshopDate: new Date(parsed.data.workshopDate),
      notes:        parsed.data.notes,
    },
  })

  return NextResponse.json(request, { status: 201 })
}
