// GET    /api/agents/[id]  → agent details
// PATCH  /api/agents/[id]  → update agent
// DELETE /api/agents/[id]  → deactivate agent

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const updateSchema = z.object({
  companyName: z.string().optional(),
  phone:       z.string().optional(),
  country:     z.enum(['QA', 'SA', 'OTHER']).optional(),
  isActive:    z.boolean().optional(),
})

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  const role    = (session?.user as any)?.role
  if (role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const agent = await prisma.agent.findUnique({
    where:   { id: params.id },
    include: {
      user:     { select: { id: true, name: true, email: true, createdAt: true } },
      trainers: {
        include: {
          user:          { select: { id: true, name: true, email: true } },
          accreditations: { include: { curriculum: true } },
        },
      },
    },
  })

  if (!agent) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(agent)
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

  const agent = await prisma.agent.update({
    where: { id: params.id },
    data:  parsed.data,
  })

  return NextResponse.json(agent)
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if ((session?.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await prisma.agent.update({
    where: { id: params.id },
    data:  { isActive: false },
  })

  return NextResponse.json({ success: true })
}
