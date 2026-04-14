import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { z } from 'zod'

const schema = z.object({
  slots: z.array(z.object({
    dayOfWeek: z.number().min(0).max(6),
    startTime: z.string().regex(/^\d{2}:\d{2}$/),
    endTime:   z.string().regex(/^\d{2}:\d{2}$/),
    isActive:  z.boolean().default(true),
  })),
})

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  const coach = await prisma.coach.findUnique({
    where: { userId: session.user.id as string },
    include: { availability: true },
  })
  if (!coach) return NextResponse.json({ message: 'Coach profile not found' }, { status: 404 })
  return NextResponse.json(coach.availability)
}

export async function PUT(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  const coach = await prisma.coach.findUnique({ where: { userId: session.user.id as string } })
  if (!coach) return NextResponse.json({ message: 'Coach profile not found' }, { status: 404 })

  const body   = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ message: 'Invalid input' }, { status: 400 })

  // Replace all availability
  await prisma.availability.deleteMany({ where: { coachId: coach.id } })
  const availability = await prisma.availability.createMany({
    data: parsed.data.slots.map(s => ({ ...s, coachId: coach.id })),
  })

  return NextResponse.json({ count: availability.count })
}
