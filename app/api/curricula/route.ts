// GET  /api/curricula  → list all active curricula (agent/trainer/admin)
// POST /api/curricula  → create curriculum (admin only)

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const createSchema = z.object({
  name:      z.string().min(2),
  domain:    z.enum(['HARMONY', 'CAREER', 'BUSINESS']),
  siteUrl:   z.string().url(),
  apiSecret: z.string().min(16),
})

export async function GET() {
  const session = await auth()
  const role    = (session?.user as any)?.role
  if (!['ADMIN', 'AGENT', 'TRAINER'].includes(role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const curricula = await prisma.curriculum.findMany({
    where:   { isActive: true },
    select: {
      id:     true,
      name:   true,
      domain: true,
      siteUrl: true,
    },
    orderBy: { name: 'asc' },
  })

  return NextResponse.json(curricula)
}

export async function POST(req: Request) {
  const session = await auth()
  if ((session?.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body   = await req.json()
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const curriculum = await prisma.curriculum.create({ data: parsed.data })
  return NextResponse.json(curriculum, { status: 201 })
}
