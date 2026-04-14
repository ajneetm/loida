import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { z } from 'zod'

const bookingSchema = z.object({
  coachId:     z.string(),
  scheduledAt: z.string().datetime(),
  duration:    z.number().min(30).max(120).default(60),
  notes:       z.string().optional(),
})

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  const userId = session.user.id as string
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')

  const bookings = await prisma.booking.findMany({
    where: {
      userId,
      ...(status ? { status: status.toUpperCase() as any } : {}),
    },
    include: {
      coach: { include: { user: { select: { name: true, image: true, email: true } } } },
    },
    orderBy: { scheduledAt: 'asc' },
  })

  return NextResponse.json(bookings)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  const userId = session.user.id as string
  const body   = await req.json()
  const parsed = bookingSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ message: 'Invalid input', errors: parsed.error.flatten() }, { status: 400 })
  }

  const { coachId, scheduledAt, duration, notes } = parsed.data

  // Check coach exists and is approved
  const coach = await prisma.coach.findFirst({ where: { id: coachId, status: 'APPROVED' } })
  if (!coach) return NextResponse.json({ message: 'Coach not found or not available.' }, { status: 404 })

  // Check membership allows bookings
  const membership = await prisma.membership.findUnique({ where: { userId } })
  if (!membership || membership.plan === 'FREE' || !membership.isActive) {
    return NextResponse.json({ message: 'Upgrade your plan to book coach sessions.' }, { status: 403 })
  }

  // Check no clash on the slot
  const clash = await prisma.booking.findFirst({
    where: {
      coachId,
      status: { in: ['PENDING', 'CONFIRMED'] },
      scheduledAt: new Date(scheduledAt),
    },
  })
  if (clash) return NextResponse.json({ message: 'This slot is already booked.' }, { status: 409 })

  const booking = await prisma.booking.create({
    data: { userId, coachId, scheduledAt: new Date(scheduledAt), duration, notes, status: 'PENDING' },
    include: { coach: { include: { user: true } } },
  })

  return NextResponse.json(booking, { status: 201 })
}
