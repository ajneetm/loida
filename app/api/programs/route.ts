import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { z } from 'zod'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const domain = searchParams.get('domain')
  const type   = searchParams.get('type')

  const programs = await prisma.program.findMany({
    where: {
      isPublished: true,
      ...(domain ? { domain: domain.toUpperCase() as any } : {}),
      ...(type   ? { type:   type.toUpperCase()   as any } : {}),
    },
    include: {
      _count: { select: { enrollments: true } },
      coach: { include: { user: { select: { name: true, image: true } } } },
    },
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
  })

  return NextResponse.json(programs)
}

const createSchema = z.object({
  title:       z.string().min(3),
  description: z.string().min(10),
  domain:      z.enum(['HARMONY', 'CAREER', 'BUSINESS']),
  type:        z.enum(['COURSE', 'COACHING', 'WORKSHOP', 'BOOTCAMP']),
  price:       z.number().min(0).default(0),
  currency:    z.string().default('GBP'),
  duration:    z.string().optional(),
  level:       z.string().optional(),
  tags:        z.array(z.string()).default([]),
})

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ message: 'Invalid input', errors: parsed.error.flatten() }, { status: 400 })
  }

  const program = await prisma.program.create({ data: parsed.data })
  return NextResponse.json(program, { status: 201 })
}
