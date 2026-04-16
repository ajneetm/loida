import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { verifyToken } from '@/lib/external-auth'

export async function GET(req: Request) {
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

  // 2. Verify access token
  const authHeader = req.headers.get('authorization') ?? ''
  const token = authHeader.replace('Bearer ', '')
  if (!token) {
    return NextResponse.json({ error: 'Missing Authorization header' }, { status: 401 })
  }

  let payload: any
  try {
    payload = await verifyToken(token, curriculum.apiSecret)
  } catch {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })
  }

  if (payload.type !== 'access') {
    return NextResponse.json({ error: 'Invalid token type' }, { status: 401 })
  }

  // 3. Fetch trainee
  const trainee = await prisma.traineeProfile.findUnique({
    where: { id: payload.traineeId },
    include: { user: { select: { email: true } } },
  })
  if (!trainee || trainee.curriculumId !== curriculum.id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json({
    id:         trainee.id,
    username:   trainee.username,
    email:      trainee.user.email,
    first_name: trainee.firstName,
    last_name:  trainee.lastName,
    phone:      trainee.phone,
  })
}
