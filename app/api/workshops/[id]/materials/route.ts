import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const schema = z.object({
  type:     z.enum(['IMAGE', 'VIDEO', 'LINK', 'EMBED', 'CODE']),
  title:    z.string().min(1),
  content:  z.string().min(1),
  language: z.string().optional(),
  order:    z.number().optional(),
})

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const materials = await prisma.workshopMaterial.findMany({
    where:   { workshopId: params.id },
    orderBy: { order: 'asc' },
  })
  return NextResponse.json(materials)
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if ((session?.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body   = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const count = await prisma.workshopMaterial.count({ where: { workshopId: params.id } })

  const material = await prisma.workshopMaterial.create({
    data: {
      workshopId: params.id,
      type:       parsed.data.type,
      title:      parsed.data.title,
      content:    parsed.data.content,
      language:   parsed.data.language,
      order:      parsed.data.order ?? count,
    },
  })
  return NextResponse.json(material, { status: 201 })
}
