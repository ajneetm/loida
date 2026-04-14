import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { getDomainColor, getDomainLabel, formatDate } from '@/lib/utils'
import Link from 'next/link'

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await prisma.article.findUnique({
    where: { slug: params.slug, isPublished: true },
    include: { author: { select: { name: true } } },
  })

  if (!article) notFound()

  const related = await prisma.article.findMany({
    where: { domain: article.domain, isPublished: true, id: { not: article.id } },
    take: 3,
    orderBy: { publishedAt: 'desc' },
  })

  const color = getDomainColor(article.domain)

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Back */}
      <Link href="/dashboard/articles" className="text-stone-400 hover:text-stone-600 text-sm transition-colors">
        ← Back to Articles
      </Link>

      {/* Article */}
      <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
        <div className="h-1.5" style={{ background: color }} />
        <div className="p-8 md:p-12">
          {/* Meta */}
          <div className="flex items-center gap-2 mb-5">
            <span className="text-[10px] font-medium px-2.5 py-1 rounded-full"
              style={{ background: `${color}15`, color }}>
              {getDomainLabel(article.domain)}
            </span>
            {(JSON.parse(article.tags as string) as string[]).map(t => (
              <span key={t} className="text-[10px] bg-stone-50 border border-stone-100 text-stone-400 px-2.5 py-1 rounded-full">
                {t}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="font-display text-4xl md:text-5xl text-[#0A1628] font-light leading-tight mb-4">
            {article.title}
          </h1>

          {article.excerpt && (
            <p className="text-stone-500 text-lg leading-relaxed mb-6 border-l-2 pl-4"
              style={{ borderColor: color }}>
              {article.excerpt}
            </p>
          )}

          {/* Author + date */}
          <div className="flex items-center gap-4 pb-8 border-b border-stone-100 mb-8">
            <div className="w-9 h-9 rounded-full bg-[#0A1628]/8 flex items-center justify-center text-[#0A1628] text-sm font-medium">
              {article.author.name?.charAt(0) ?? 'A'}
            </div>
            <div>
              <p className="text-[#0A1628] text-sm font-medium">{article.author.name}</p>
              {article.publishedAt && (
                <p className="text-stone-400 text-xs">{formatDate(article.publishedAt)}</p>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-stone max-w-none prose-headings:font-display prose-headings:font-light prose-a:text-[#B8973A]">
            {article.content.split('\n\n').map((para, i) => (
              <p key={i} className="text-stone-600 leading-relaxed mb-4">{para}</p>
            ))}
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div>
          <h2 className="font-display text-2xl text-[#0A1628] mb-5">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {related.map(r => (
              <Link key={r.id} href={`/dashboard/articles/${r.slug}`}
                className="bg-white rounded-2xl border border-stone-100 p-5 hover:border-stone-200 hover:shadow-sm transition-all group">
                <div className="h-0.5 w-8 rounded-full mb-4" style={{ background: getDomainColor(r.domain) }} />
                <h3 className="text-[#0A1628] font-medium text-sm leading-snug group-hover:text-[#B8973A] transition-colors">
                  {r.title}
                </h3>
                {r.excerpt && (
                  <p className="text-stone-400 text-xs mt-2 line-clamp-2">{r.excerpt}</p>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
