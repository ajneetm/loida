import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const schema = z.object({
  name:      z.string().min(2),
  email:     z.string().email(),
  password:  z.string().min(8),
  interests: z.array(z.string()).optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ message: 'Invalid input.', errors: parsed.error.flatten() }, { status: 400 })
    }

    const { name, email, password, interests } = parsed.data

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ message: 'An account with this email already exists.' }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: 'USER',
        profile: {
          create: {
            interests: interests ?? [],
            language: 'en',
            timezone: 'Europe/London',
          },
        },
        membership: {
          create: {
            plan: 'FREE',
            isActive: true,
          },
        },
      },
    })

    return NextResponse.json({ success: true, userId: user.id }, { status: 201 })
  } catch (err) {
    console.error('[REGISTER]', err)
    return NextResponse.json({ message: 'Something went wrong.' }, { status: 500 })
  }
}
