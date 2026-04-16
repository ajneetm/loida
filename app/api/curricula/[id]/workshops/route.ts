import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const schema = z.object({
  title:    z.string().min(2),
  date:     z.string(),
  location: z.string().optional(),
})

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  const role    = (session?.user as any)?.role
  if (!['ADMIN', 'AGENT', 'TRAINER'].includes(role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const workshops = await prisma.workshop.findMany({
    where:   { curriculumId: params.id },
    orderBy: { date: 'desc' },
  })
  return NextResponse.json(workshops)
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if ((session?.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body   = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const workshop = await prisma.workshop.create({
    data: {
      curriculumId: params.id,
      title:        parsed.data.title,
      date:         new Date(parsed.data.date),
      location:     parsed.data.location,
    },
  })
  return NextResponse.json(workshop, { status: 201 })
}
