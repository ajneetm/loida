import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { z } from 'zod'

const schema = z.object({
  bio:         z.string().min(50, 'Bio must be at least 50 characters'),
  motivation:  z.string().min(20),
  domains:     z.array(z.enum(['HARMONY','CAREER','BUSINESS'])).min(1),
  specialties: z.array(z.string()).default([]),
  hourlyRate:  z.string().optional(),
  linkedinUrl: z.string().url().optional().or(z.literal('')),
  cvUrl:       z.string().url().optional().or(z.literal('')),
})

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  const userId = session.user.id as string
  const body   = await req.json()
  const parsed = schema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.errors[0]?.message ?? 'Invalid input' }, { status: 400 })
  }

  // Check not already applied
  const existing = await prisma.coach.findUnique({ where: { userId } })
  if (existing) {
    return NextResponse.json({ message: 'You have already applied to be a coach.', status: existing.status }, { status: 409 })
  }

  const { hourlyRate, ...rest } = parsed.data

  const coach = await prisma.coach.create({
    data: {
      userId,
      bio: rest.bio,
      domains: JSON.stringify(rest.domains),
      specialties: JSON.stringify(rest.specialties),
      hourlyRate: hourlyRate ? parseFloat(hourlyRate) : null,
      linkedinUrl: rest.linkedinUrl,
      cvUrl: rest.cvUrl,
      currency: 'GBP',
      status: 'PENDING',
    },
  })

  return NextResponse.json(coach, { status: 201 })
}
