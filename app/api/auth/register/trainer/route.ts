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
  const institutionId = data.get('institutionId')?.toString().trim() || null
  const languagesRaw  = data.get('languages')?.toString() ?? '[]'
  const cvFile        = data.get('cv') as File | null

  if (!name || !email || !password || !phone || !nationality || !residence) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json({ error: 'Email already in use' }, { status: 409 })
  }

  // Handle CV upload (store as base64 URL for now — replace with Supabase Storage later)
  let cvUrl: string | null = null
  if (cvFile && cvFile.size > 0) {
    const buffer = Buffer.from(await cvFile.arrayBuffer())
    cvUrl = `data:${cvFile.type};base64,${buffer.toString('base64')}`
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
          languages:    languagesRaw,
          cvUrl,
          institutionId: institutionId || null,
          approvalStatus: 'PENDING',
        },
      },
    },
  })

  return NextResponse.json({ success: true }, { status: 201 })
}
