// GET  /api/agents  → list all agents (admin only)
// POST /api/agents  → create agent (admin only)

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'

const createAgentSchema = z.object({
  name:        z.string().min(2),
  email:       z.string().email(),
  password:    z.string().min(8),
  country:     z.enum(['QA', 'SA', 'OTHER']),
  companyName: z.string().optional(),
  phone:       z.string().optional(),
})

export async function GET() {
  const session = await auth()
  if ((session?.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const agents = await prisma.agent.findMany({
    include: {
      user:     { select: { id: true, name: true, email: true, createdAt: true } },
      trainers: { select: { id: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(agents)
}

export async function POST(req: Request) {
  const session = await auth()
  if ((session?.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json()
  const parsed = createAgentSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { name, email, password, country, companyName, phone } = parsed.data

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json({ error: 'Email already in use' }, { status: 409 })
  }

  const passwordHash = await bcrypt.hash(password, 12)

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role: 'AGENT',
      agentProfile: {
        create: { country, companyName, phone },
      },
    },
    include: { agentProfile: true },
  })

  return NextResponse.json(user, { status: 201 })
}
