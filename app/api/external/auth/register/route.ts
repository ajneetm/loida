import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { signAccessToken, signRefreshToken, accessExpiresAt, refreshExpiresAt } from '@/lib/external-auth'

export async function POST(req: Request) {
  // 1. Verify apiSecret
  const apiSecret = req.headers.get('x-api-secret')
  if (!apiSecret) {
    return NextResponse.json({ error: 'Missing x-api-secret header' }, { status: 401 })
  }

  const curriculum = await prisma.curriculum.findFirst({
    where: { apiSecret, isActive: true },
  })
  if (!curriculum) {
    return NextResponse.json({ error: 'Invalid API secret' }, { status: 401 })
  }

  // 2. Parse body
  const { username, email, password, first_name, last_name, phone } = await req.json()

  if (!username || !email || !password || !first_name || !last_name) {
    return NextResponse.json({ error: 'username, email, password, first_name, last_name are required' }, { status: 400 })
  }

  // 3. Check duplicates
  const existingEmail = await prisma.user.findUnique({ where: { email } })
  if (existingEmail) {
    return NextResponse.json({ email: ['A user with this email already exists.'] }, { status: 400 })
  }

  const existingUsername = await prisma.traineeProfile.findUnique({
    where: { username_curriculumId: { username, curriculumId: curriculum.id } },
  })
  if (existingUsername) {
    return NextResponse.json({ username: ['A user with this username already exists.'] }, { status: 400 })
  }

  // 4. Create User + TraineeProfile
  const passwordHash = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      name: `${first_name} ${last_name}`,
      role: 'TRAINEE',
      traineeProfile: {
        create: {
          curriculumId: curriculum.id,
          username,
          firstName: first_name,
          lastName:  last_name,
          phone:     phone ?? null,
        },
      },
    },
    include: { traineeProfile: true },
  })

  // 5. Issue tokens
  const tokenPayload = {
    sub:         user.id,
    traineeId:   user.traineeProfile!.id,
    curriculumId: curriculum.id,
    username,
    email,
    first_name,
    last_name,
  }

  const [access_token, refresh_token] = await Promise.all([
    signAccessToken(tokenPayload, curriculum.apiSecret),
    signRefreshToken(tokenPayload, curriculum.apiSecret),
  ])

  return NextResponse.json({
    username,
    email,
    first_name,
    last_name,
    access_token,
    refresh_token,
    access_expires_at:  accessExpiresAt(),
    refresh_expires_at: refreshExpiresAt(),
  }, { status: 201 })
}
