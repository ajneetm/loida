// GET /api/certificates/curricula → curricula the trainer is accredited for

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await auth()
  const userId  = session?.user?.id
  const role    = (session?.user as any)?.role

  if (!userId || role !== 'TRAINER') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const trainer = await prisma.trainer.findUnique({
    where: { userId },
    include: {
      accreditations: {
        where:   { status: 'ACTIVE' },
        include: { curriculum: true },
      },
    },
  })

  if (!trainer) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const curricula = trainer.accreditations.map(a => ({
    id:     a.curriculum.id,
    name:   a.curriculum.name,
    domain: a.curriculum.domain,
  }))

  return NextResponse.json(curricula)
}
