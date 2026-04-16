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
  const { username, password } = await req.json()
  if (!username || !password) {
    return NextResponse.json({ error: 'username and password are required' }, { status: 400 })
  }

  // 3. Find trainee by username + curriculum
  const trainee = await prisma.traineeProfile.findUnique({
    where: { username_curriculumId: { username, curriculumId: curriculum.id } },
    include: { user: true },
  })

  if (!trainee) {
    return NextResponse.json({ error: 'Invalid username or password' }, { status: 400 })
  }

  const valid = await bcrypt.compare(password, trainee.user.passwordHash ?? '')
  if (!valid) {
    return NextResponse.json({ error: 'Invalid username or password' }, { status: 400 })
  }

  // 4. Issue tokens
  const tokenPayload = {
    sub:          trainee.user.id,
    traineeId:    trainee.id,
    curriculumId: curriculum.id,
    username:     trainee.username,
    email:        trainee.user.email,
    first_name:   trainee.firstName,
    last_name:    trainee.lastName,
  }

  const [access_token, refresh_token] = await Promise.all([
    signAccessToken(tokenPayload, curriculum.apiSecret),
    signRefreshToken(tokenPayload, curriculum.apiSecret),
  ])

  return NextResponse.json({
    username:     trainee.username,
    email:        trainee.user.email,
    first_name:   trainee.firstName,
    last_name:    trainee.lastName,
    access_token,
    refresh_token,
    access_expires_at:  accessExpiresAt(),
    refresh_expires_at: refreshExpiresAt(),
  })
}
