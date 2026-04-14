import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const program = await prisma.program.findUnique({
    where: { id: params.id },
    include: { modules: { orderBy: { order: 'asc' } }, coach: { include: { user: true } } },
  })
  if (!program) return NextResponse.json({ message: 'Not found' }, { status: 404 })
  return NextResponse.json(program)
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const body    = await req.json()
  const program = await prisma.program.update({
    where: { id: params.id },
    data:  body,
  })
  return NextResponse.json(program)
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  await prisma.program.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
