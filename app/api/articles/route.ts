import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { slugify } from '@/lib/utils'
import { z } from 'zod'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const domain = searchParams.get('domain')
  const take   = parseInt(searchParams.get('take') ?? '20')

  const articles = await prisma.article.findMany({
    where: {
      isPublished: true,
      ...(domain ? { domain: domain.toUpperCase() as any } : {}),
    },
    include: { author: { select: { name: true } } },
    orderBy: { publishedAt: 'desc' },
    take,
  })

  return NextResponse.json(articles)
}

const createSchema = z.object({
  title:   z.string().min(3),
  excerpt: z.string().optional(),
  content: z.string().min(10),
  domain:  z.enum(['HARMONY', 'CAREER', 'BUSINESS', 'GENERAL']),
  tags:    z.array(z.string()).default([]),
  publish: z.boolean().default(false),
})

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  const role = (session.user as any).role
  if (role !== 'ADMIN' && role !== 'COACH') {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
  }

  const body   = await req.json()
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ message: 'Invalid input' }, { status: 400 })

  const slug = slugify(parsed.data.title) + '-' + Date.now()

  const article = await prisma.article.create({
    data: {
      title:       parsed.data.title,
      slug,
      excerpt:     parsed.data.excerpt,
      content:     parsed.data.content,
      domain:      parsed.data.domain,
      tags:        JSON.stringify(parsed.data.tags),
      authorId:    session.user.id as string,
      isPublished: parsed.data.publish,
      publishedAt: parsed.data.publish ? new Date() : null,
    },
  })

  return NextResponse.json(article, { status: 201 })
}
