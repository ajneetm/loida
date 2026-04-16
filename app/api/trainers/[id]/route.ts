import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if ((session?.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const trainer = await prisma.trainer.findUnique({ where: { id: params.id } })
  if (!trainer) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await prisma.user.delete({ where: { id: trainer.userId } })
  return NextResponse.json({ success: true })
}
