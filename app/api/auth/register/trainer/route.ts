import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  const { name, email, password, phone, nationality, residence, languages } = await req.json()

  if (!name || !email || !password || !phone || !nationality || !residence) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json({ error: 'Email already in use' }, { status: 409 })
  }

  const passwordHash = await bcrypt.hash(password, 12)

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
          languages: JSON.stringify(languages ?? []),
          approvalStatus: 'PENDING',
        },
      },
    },
  })

  return NextResponse.json({ success: true }, { status: 201 })
}
