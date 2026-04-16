import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if ((session?.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { status } = await req.json()
  if (!['APPROVED', 'REJECTED', 'ISSUED'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  const request = await prisma.certificateRequest.update({
    where: { id: params.id },
    data:  { status },
  })

  return NextResponse.json(request)
}
