import { prisma } from '@/lib/prisma'
import { getDomainColor, getDomainLabel, formatDate } from '@/lib/utils'
import Link from 'next/link'

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: { domain?: string }
}) {
  const domain = searchParams.domain?.toUpperCase()

  const articles = await prisma.article.findMany({
    where: {
      isPublished: true,
      ...(domain && domain !== 'GENERAL' ? { domain: domain as any } : {}),
    },
    include: { author: { select: { name: true } } },
    orderBy: { publishedAt: 'desc' },
    take: 20,
  })

  const domains = ['HARMONY', 'CAREER', 'BUSINESS', 'GENERAL']

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-[#022269] rounded-none p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_50%,#011344,transparent)]" />
        <div className="relative z-10">
          <p className="text-[#c71430] text-xs tracking-[0.2em] uppercase mb-2">Insights & Articles</p>
          <h2 className="font-display text-3xl text-white font-light mb-2">Knowledge Hub</h2>
          <p className="text-white/40 text-sm">Expert insights across personal growth, career, and business.</p>
        </div>
      </div>

      {/* Domain filter */}
      <div className="flex flex-wrap gap-2">
        <Link href="/dashboard/articles"
          className={`px-4 py-2 rounded-none text-xs transition-all ${!domain ? 'bg-[#022269] text-white' : 'border border-stone-200 text-stone-500 hover:border-stone-400'}`}>
          All
        </Link>
        {domains.map(d => (
          <Link key={d} href={`/dashboard/articles?domain=${d}`}
            className="px-4 py-2 rounded-none text-xs border transition-all hover:text-white"
            style={domain === d
              ? { background: getDomainColor(d), color: '#fff', borderColor: getDomainColor(d) }
              : { borderColor: '#e7e5e4', color: '#78716c' }}>
            {getDomainLabel(d)}
          </Link>
        ))}
      </div>

      {/* Articles grid */}
      {articles.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-none border border-stone-100">
          <p className="text-stone-400 text-sm">No articles published yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {articles.map(article => {
            const color = getDomainColor(article.domain)
            return (
              <Link key={article.id} href={`/dashboard/articles/${article.slug}`}
                className="bg-white rounded-none border border-stone-100 overflow-hidden hover:border-stone-200 hover:shadow-md transition-all duration-300 group flex flex-col">
                {/* Color bar */}
                <div className="h-1" style={{ background: color }} />
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-none"
                      style={{ background: `${color}15`, color }}>
                      {getDomainLabel(article.domain)}
                    </span>
                    {(JSON.parse(article.tags as string) as string[]).slice(0, 2).map(t => (
                      <span key={t} className="text-[10px] bg-stone-50 border border-stone-100 text-stone-400 px-2 py-0.5 rounded-none">
                        {t}
                      </span>
                    ))}
                  </div>
                  <h3 className="font-display text-xl text-[#022269] font-medium leading-snug mb-2 group-hover:text-[#c71430] transition-colors">
                    {article.title}
                  </h3>
                  {article.excerpt && (
                    <p className="text-stone-500 text-sm leading-relaxed flex-1 line-clamp-2">{article.excerpt}</p>
                  )}
                  <div className="flex items-center justify-between mt-5 pt-4 border-t border-stone-50">
                    <p className="text-stone-400 text-xs">{article.author.name}</p>
                    {article.publishedAt && (
                      <p className="text-stone-300 text-xs">{formatDate(article.publishedAt)}</p>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
