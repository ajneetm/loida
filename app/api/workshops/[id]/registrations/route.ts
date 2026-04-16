import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const schema = z.object({
  name:  z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
})

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  const role    = (session?.user as any)?.role
  const userId  = session?.user?.id

  if (!userId || !['ADMIN', 'TRAINER'].includes(role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Trainer: verify they are accredited for this workshop's curriculum
  if (role === 'TRAINER') {
    const workshop = await prisma.workshop.findUnique({ where: { id: params.id } })
    if (!workshop) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    const trainer = await prisma.trainer.findUnique({ where: { userId } })
    if (!trainer) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    const acc = await prisma.trainerAccreditation.findUnique({
      where: { trainerId_curriculumId: { trainerId: trainer.id, curriculumId: workshop.curriculumId } },
    })
    if (!acc || acc.status !== 'ACTIVE') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const registrations = await prisma.workshopRegistration.findMany({
    where:   { workshopId: params.id },
    orderBy: { registeredAt: 'desc' },
  })
  return NextResponse.json(registrations)
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  // Public — anyone can register
  const body   = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const existing = await prisma.workshopRegistration.findFirst({
    where: { workshopId: params.id, email: parsed.data.email },
  })
  if (existing) return NextResponse.json({ error: 'Already registered' }, { status: 409 })

  const reg = await prisma.workshopRegistration.create({
    data: { workshopId: params.id, ...parsed.data },
  })
  return NextResponse.json(reg, { status: 201 })
}
