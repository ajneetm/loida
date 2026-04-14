import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { z } from 'zod'

const schema = z.object({
  name:        z.string().min(2).optional(),
  bio:         z.string().max(500).optional(),
  phone:       z.string().optional(),
  country:     z.string().optional(),
  city:        z.string().optional(),
  linkedinUrl: z.string().url().optional().or(z.literal('')),
})

export async function PATCH(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  const userId = session.user.id as string
  const body   = await req.json()
  const parsed = schema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ message: 'Invalid input', errors: parsed.error.flatten() }, { status: 400 })
  }

  const { name, ...profileData } = parsed.data

  await prisma.$transaction([
    // Update user name
    ...(name ? [prisma.user.update({ where: { id: userId }, data: { name } })] : []),
    // Upsert profile
    prisma.profile.upsert({
      where:  { userId },
      create: { userId, ...profileData },
      update: profileData,
    }),
  ])

  return NextResponse.json({ success: true })
}

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { id: session.user.id as string },
    include: { profile: true, membership: true },
  })

  return NextResponse.json(user)
}
