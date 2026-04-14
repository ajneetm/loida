import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  const userId    = session.user.id as string
  const programId = params.id

  const program = await prisma.program.findUnique({ where: { id: programId } })
  if (!program || !program.isPublished) {
    return NextResponse.json({ message: 'Program not found' }, { status: 404 })
  }

  const existing = await prisma.enrollment.findUnique({ where: { userId_programId: { userId, programId } } })
  if (existing) return NextResponse.json({ message: 'Already enrolled', enrollment: existing })

  // Check membership for paid programs
  if (program.price > 0) {
    const membership = await prisma.membership.findUnique({ where: { userId } })
    if (!membership || membership.plan === 'FREE' || !membership.isActive) {
      return NextResponse.json({ message: 'Upgrade your membership to enroll in paid programs.' }, { status: 403 })
    }
  }

  const enrollment = await prisma.enrollment.create({
    data: { userId, programId, progress: 0, status: 'ACTIVE' },
  })

  return NextResponse.json(enrollment, { status: 201 })
}
