import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  const session = await auth()
  const role    = (session?.user as any)?.role
  if (!session || !['ADMIN', 'STAFF'].includes(role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json()
  const update: any = {}

  if (body.status !== undefined) {
    if (!['UNREAD', 'READ', 'IN_PROGRESS', 'REPLIED', 'CLOSED'].includes(body.status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }
    update.status = body.status
  }

  if (body.notes !== undefined) {
    update.notes = body.notes
  }

  const msg = await prisma.contactMessage.update({
    where: { id: params.id },
    data:  update,
  })

  return NextResponse.json(msg)
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } },
) {
  const session = await auth()
  const role    = (session?.user as any)?.role
  if (!session || !['ADMIN', 'STAFF'].includes(role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await prisma.contactMessage.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
