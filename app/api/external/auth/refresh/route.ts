import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { verifyToken, signAccessToken, signRefreshToken, accessExpiresAt, refreshExpiresAt } from '@/lib/external-auth'

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

  // 2. Verify refresh token
  const { refresh } = await req.json()
  if (!refresh) {
    return NextResponse.json({ error: 'refresh token is required' }, { status: 400 })
  }

  let payload: any
  try {
    payload = await verifyToken(refresh, curriculum.apiSecret)
  } catch {
    return NextResponse.json({ error: 'Invalid or expired refresh token' }, { status: 401 })
  }

  if (payload.type !== 'refresh') {
    return NextResponse.json({ error: 'Invalid token type' }, { status: 401 })
  }

  // 3. Verify trainee still exists
  const trainee = await prisma.traineeProfile.findUnique({
    where: { id: payload.traineeId },
    include: { user: true },
  })
  if (!trainee || trainee.curriculumId !== curriculum.id) {
    return NextResponse.json({ error: 'Trainee not found' }, { status: 401 })
  }

  // 4. Issue new tokens
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
    message:            'Token refreshed successfully',
    access_token,
    refresh_token,
    access_expires_at:  accessExpiresAt(),
    refresh_expires_at: refreshExpiresAt(),
  })
}
