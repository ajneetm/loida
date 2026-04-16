import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await auth()
  if ((session?.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const [trainers, institutions, certificates] = await Promise.all([
    prisma.trainer.count({ where: { approvalStatus: 'PENDING' } }),
    prisma.institution.count({ where: { approvalStatus: 'PENDING' } }),
    prisma.certificateRequest.count({ where: { status: 'PENDING' } }),
  ])

  return NextResponse.json({ trainers, institutions, certificates })
}
