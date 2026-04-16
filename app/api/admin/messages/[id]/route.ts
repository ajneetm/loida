import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  const session = await auth()
  if ((session?.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { status } = await req.json()
  if (!['UNREAD', 'READ'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  const msg = await prisma.contactMessage.update({
    where: { id: params.id },
    data:  { status },
  })

  return NextResponse.json(msg)
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } },
) {
  const session = await auth()
  if ((session?.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await prisma.contactMessage.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
