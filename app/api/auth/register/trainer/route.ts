import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  const data = await req.formData()

  const name        = data.get('name')?.toString().trim() ?? ''
  const email       = data.get('email')?.toString().trim().toLowerCase() ?? ''
  const password    = data.get('password')?.toString() ?? ''
  const phone       = data.get('phone')?.toString().trim() ?? ''
  const nationality = data.get('nationality')?.toString().trim() ?? ''
  const residence   = data.get('residence')?.toString().trim() ?? ''
  const languagesRaw = data.get('languages')?.toString() ?? '[]'
  const cvName      = data.get('cvName')?.toString() || null   // just the filename, no binary

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
          languages:      languagesRaw,
          cvUrl:          cvName ? `pending:${cvName}` : null,  // flag for admin to request
          approvalStatus: 'PENDING',
        },
      },
    },
  })

  return NextResponse.json({ success: true }, { status: 201 })
}
