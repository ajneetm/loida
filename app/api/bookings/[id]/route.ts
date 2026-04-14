import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { z } from 'zod'

const schema = z.object({
  status:     z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']).optional(),
  meetingUrl: z.string().url().optional(),
  notes:      z.string().optional(),
})

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  const booking = await prisma.booking.findUnique({
    where: { id: params.id },
    include: {
      coach: { include: { user: { select: { name: true } } } },
      user:  { select: { name: true, email: true } },
    },
  })
  if (!booking) return NextResponse.json({ message: 'Not found' }, { status: 404 })
  return NextResponse.json(booking)
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  const userId = session.user.id as string
  const body   = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ message: 'Invalid input' }, { status: 400 })

  const booking = await prisma.booking.findUnique({
    where:   { id: params.id },
    include: { coach: true },
  })
  if (!booking) return NextResponse.json({ message: 'Booking not found' }, { status: 404 })

  // Only coach or admin can change status
  const role = (session.user as any).role
  if (booking.coach.userId !== userId && role !== 'ADMIN') {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
  }

  const updated = await prisma.booking.update({
    where: { id: params.id },
    data:  parsed.data,
  })

  // If completed, increment coach total sessions
  if (parsed.data.status === 'COMPLETED') {
    await prisma.coach.update({
      where: { id: booking.coachId },
      data:  { totalSessions: { increment: 1 } },
    })
  }

  return NextResponse.json(updated)
}
