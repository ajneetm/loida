import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const schema = z.object({
  name:        z.string().min(1),
  email:       z.string().email(),
  password:    z.string().min(8),
  phone:       z.string().min(1),
  nationality: z.string().min(1),
  residence:   z.string().min(1),
})

export async function POST(req: Request) {
  const session = await auth()
  if ((session?.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body   = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid fields' }, { status: 400 })
  }

  const { name, email, password, phone, nationality, residence } = parsed.data

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json({ error: 'Email already in use' }, { status: 409 })
  }

  const passwordHash = await bcrypt.hash(password, 12)
  const adminId = (session?.user as any)?.id

  await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role: 'TRAINER',
      trainerProfile: {
        create: {
          phone,
          nationality,
          residence,
          languages:      '[]',
          approvalStatus: 'APPROVED',
          approvedAt:     new Date(),
          approvedById:   adminId,
        },
      },
    },
  })

  return NextResponse.json({ success: true }, { status: 201 })
}
