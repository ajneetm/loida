import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const coach = await prisma.coach.findFirst({
    where: { id: params.id, status: 'APPROVED' },
    include: {
      user:         { select: { name: true, image: true, email: true } },
      availability: { where: { isActive: true } },
    },
  })

  if (!coach) return NextResponse.json({ message: 'Coach not found' }, { status: 404 })
  return NextResponse.json({
    ...coach,
    domains:     JSON.parse(coach.domains as string),
    specialties: JSON.parse(coach.specialties as string),
  })
}
