import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if ((session?.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const count = await prisma.trainerAccreditation.count({
    where: { curriculumId: params.id, status: 'ACTIVE' },
  })

  if (count > 0) {
    return NextResponse.json({ error: 'Curriculum has active accreditations' }, { status: 409 })
  }

  await prisma.curriculum.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}
