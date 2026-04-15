import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { z } from 'zod'

const schema = z.object({
  title:       z.string().min(3),
  description: z.string().min(10),
  domain:      z.enum(['HARMONY', 'CAREER', 'BUSINESS']),
  order:       z.number().default(0),
  questions:   z.array(z.object({
    id:       z.string(),
    text:     z.string().min(1),
    type:     z.enum(['SINGLE', 'MULTIPLE', 'SCALE', 'TEXT']),
    options:  z.array(z.object({ value: z.string(), label: z.string() })).default([]),
    required: z.boolean().default(true),
  })),
})

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const body   = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.errors[0]?.message ?? 'Invalid input' }, { status: 400 })
  }

  const { questions, ...rest } = parsed.data
  const assessment = await prisma.assessment.create({
    data: {
      ...rest,
      questions: JSON.stringify(questions),
      isActive: true,
    },
  })

  return NextResponse.json(assessment, { status: 201 })
}

export async function GET() {
  const assessments = await prisma.assessment.findMany({
    include: { _count: { select: { results: true } } },
    orderBy: [{ order: 'asc' }],
  })
  return NextResponse.json(assessments)
}
