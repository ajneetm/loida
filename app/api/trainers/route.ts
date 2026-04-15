// GET  /api/trainers  → list trainers (admin: all, agent: own trainers)
// POST /api/trainers  → create trainer (agent only)

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'

const createTrainerSchema = z.object({
  name:  z.string().min(2),
  email: z.string().email(),
  bio:   z.string().optional(),
  phone: z.string().optional(),
})

export async function GET() {
  const session = await auth()
  const role    = (session?.user as any)?.role
  const userId  = session?.user?.id

  if (!userId || !['ADMIN', 'AGENT'].includes(role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  let where = {}

  if (role === 'AGENT') {
    const agent = await prisma.agent.findUnique({ where: { userId } })
    if (!agent) return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
    where = { agentId: agent.id }
  }

  const trainers = await prisma.trainer.findMany({
    where,
    include: {
      user:          { select: { id: true, name: true, email: true, createdAt: true } },
      agent:         { include: { user: { select: { name: true } } } },
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

  if (!userId || !['ADMIN', 'AGENT'].includes(role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body   = await req.json()
  const parsed = createTrainerSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  // Resolve agentId
  let agentId: string
  if (role === 'AGENT') {
    const agent = await prisma.agent.findUnique({ where: { userId } })
    if (!agent || !agent.isActive) {
      return NextResponse.json({ error: 'Agent account inactive' }, { status: 403 })
    }
    agentId = agent.id
  } else {
    // Admin must pass agentId
    agentId = body.agentId
    if (!agentId) return NextResponse.json({ error: 'agentId required' }, { status: 400 })
  }

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } })
  if (existing) {
    return NextResponse.json({ error: 'Email already in use' }, { status: 409 })
  }

  // Generate a temporary password
  const tempPassword   = Math.random().toString(36).slice(-10)
  const passwordHash   = await bcrypt.hash(tempPassword, 12)

  const user = await prisma.user.create({
    data: {
      name:         parsed.data.name,
      email:        parsed.data.email,
      passwordHash,
      role:         'TRAINER',
      trainerProfile: {
        create: {
          agentId,
          bio:   parsed.data.bio,
          phone: parsed.data.phone,
        },
      },
    },
    include: { trainerProfile: true },
  })

  // TODO: send welcome email with tempPassword

  return NextResponse.json({ ...user, tempPassword }, { status: 201 })
}
