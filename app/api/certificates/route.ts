// GET  /api/certificates  → list requests (admin: all, trainer: own)
// POST /api/certificates  → submit certificate requests (trainer only) — supports bulk

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const traineeSchema = z.object({
  traineeName:  z.string().min(2),
  traineeEmail: z.string().email(),
})

const createSchema = z.object({
  curriculumId: z.string(),
  workshopDate: z.string(),
  workshopId:   z.string().optional(),
  notes:        z.string().optional(),
  trainees:     z.array(traineeSchema).min(1),
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
    include: { trainer: { include: { user: { select: { name: true } } } } },
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

  const accreditation = await prisma.trainerAccreditation.findUnique({
    where: { trainerId_curriculumId: { trainerId: trainer.id, curriculumId: parsed.data.curriculumId } },
  })
  if (!accreditation || accreditation.status !== 'ACTIVE') {
    return NextResponse.json({ error: 'Not accredited for this curriculum' }, { status: 403 })
  }

  // Skip duplicates if workshopId provided
  let trainees = parsed.data.trainees
  if (parsed.data.workshopId) {
    const existing = await prisma.certificateRequest.findMany({
      where: { workshopId: parsed.data.workshopId, trainerId: trainer.id },
      select: { traineeEmail: true },
    })
    const existingEmails = new Set(existing.map(e => e.traineeEmail))
    trainees = trainees.filter(t => !existingEmails.has(t.traineeEmail))
  }

  if (trainees.length === 0) {
    return NextResponse.json({ count: 0, message: 'All already submitted' }, { status: 200 })
  }

  const requests = await prisma.certificateRequest.createMany({
    data: trainees.map(t => ({
      trainerId:    trainer.id,
      curriculumId: parsed.data.curriculumId,
      workshopId:   parsed.data.workshopId,
      workshopDate: new Date(parsed.data.workshopDate),
      notes:        parsed.data.notes,
      traineeName:  t.traineeName,
      traineeEmail: t.traineeEmail,
    })),
  })

  return NextResponse.json({ count: requests.count }, { status: 201 })
}
