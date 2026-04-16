// GET  /api/trainers  → list trainers (admin: all, institution: own trainers)
// POST /api/trainers  → create trainer (institution/admin only)

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'

const createTrainerSchema = z.object({
  name:          z.string().min(2),
  email:         z.string().email(),
  phone:         z.string().min(5),
  nationality:   z.string().min(2),
  residence:     z.string().min(2),
  curriculumIds: z.array(z.string()).min(1, 'Select at least one curriculum'),
  institutionId: z.string().optional(),
})

export async function GET() {
  const session = await auth()
  const role    = (session?.user as any)?.role
  const userId  = session?.user?.id

  if (!userId || !['ADMIN', 'INSTITUTION'].includes(role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  let where: any = {}

  if (role === 'INSTITUTION') {
    const institution = await prisma.institution.findUnique({ where: { userId } })
    if (!institution) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    where = { institutionId: institution.id }
  }

  const trainers = await prisma.trainer.findMany({
    where,
    include: {
      user:           { select: { id: true, name: true, email: true, createdAt: true } },
      institution:    { include: { user: { select: { name: true } } } },
      accreditations: { include: { curriculum: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(trainers)
}

export async function POST(req: Request) {
  const session = await auth()
  const role    = (session?.user as any)?.role
  const userId  = session?.user?.id

  if (!userId || !['ADMIN', 'INSTITUTION'].includes(role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body   = await req.json()
  const parsed = createTrainerSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  // Resolve institutionId
  let institutionId: string | undefined
  if (role === 'INSTITUTION') {
    const institution = await prisma.institution.findUnique({ where: { userId } })
    if (!institution || !institution.isActive) {
      return NextResponse.json({ error: 'Institution account inactive' }, { status: 403 })
    }
    institutionId = institution.id
  } else {
    institutionId = parsed.data.institutionId
  }

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } })
  if (existing) {
    return NextResponse.json({ error: 'Email already in use' }, { status: 409 })
  }

  const tempPassword = Math.random().toString(36).slice(-10)
  const passwordHash = await bcrypt.hash(tempPassword, 12)

  const curricula = await prisma.curriculum.findMany({
    where: { id: { in: parsed.data.curriculumIds }, isActive: true },
  })
  if (curricula.length !== parsed.data.curriculumIds.length) {
    return NextResponse.json({ error: 'One or more selected curricula are invalid' }, { status: 400 })
  }

  const user = await prisma.user.create({
    data: {
      name:         parsed.data.name,
      email:        parsed.data.email,
      passwordHash,
      role:         'TRAINER',
      trainerProfile: {
        create: {
          institutionId,
          phone:       parsed.data.phone,
          nationality: parsed.data.nationality,
          residence:   parsed.data.residence,
          accreditations: {
            create: parsed.data.curriculumIds.map(id => ({ curriculumId: id })),
          },
        },
      },
    },
    include: { trainerProfile: true },
  })

  return NextResponse.json({ ...user, tempPassword }, { status: 201 })
}
