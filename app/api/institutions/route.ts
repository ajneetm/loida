// GET  /api/institutions  → list all institutions (admin only)

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await auth()
  if ((session?.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const institutions = await prisma.institution.findMany({
    include: {
      user:     { select: { id: true, name: true, email: true, createdAt: true } },
      trainers: { select: { id: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(institutions)
}
