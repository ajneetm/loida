import Link from 'next/link'
import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'
import { prisma } from '@/lib/prisma'
import { formatDate, getDomainColor, getDomainLabel } from '@/lib/utils'

export const metadata = {
  title: 'Articles & Insights | Loida British',
  description: 'Explore articles, insights, and resources from Loida British on business, career, life skills, and more.',
}

export const dynamic = 'force-dynamic'

const domains = [
  { key: 'ALL',      label: 'All Topics' },
  { key: 'HARMONY',  label: 'Harmony' },
  { key: 'CAREER',   label: 'Career' },
  { key: 'BUSINESS', label: 'Business' },
  { key: 'GENERAL',  label: 'General' },
]

export default async function PublicArticlesPage({
  searchParams,
}: {
  searchParams: { domain?: string }
}) {
  const domainFilter = searchParams.domain?.toUpperCase()

  const articles = await prisma.article.findMany({
    where: {
      isPublished: true,
      ...(domainFilter && domainFilter !== 'ALL' ? { domain: domainFilter as any } : {}),
    },
    include: { author: { select: { name: true } } },
    orderBy: { publishedAt: 'desc' },
    take: 24,
  })

  return (
    <>
      <Navbar />

      {/* Header */}
      <section className="pt-[117px] bg-[#022269]">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <p className="text-[#c71430] text-xs tracking-[0.3em] uppercase font-semibold mb-3 font-['Inter']">
            Knowledge Hub
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white font-['Raleway'] leading-tight">
            Articles & Insights
          </h1>
          <p className="text-blue-200 mt-3 font-['Tajawal'] text-lg max-w-xl">
            Practical knowledge and expert perspectives on business, career, and personal development.
          </p>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="bg-[#f0f7f9] border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-2 text-sm font-['Inter']">
          <Link href="/" className="text-[#022269] hover:underline">Home</Link>
          <span className="text-gray-400">›</span>
          <span className="text-gray-500">Articles</span>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-12">

        {/* Domain filter tabs */}
        <div className="flex flex-wrap gap-2 mb-10">
          {domains.map(d => {
            const active = (!domainFilter && d.key === 'ALL') || domainFilter === d.key
            return (
              <Link
                key={d.key}
                href={d.key === 'ALL' ? '/articles' : `/articles?domain=${d.key}`}
                className={`px-5 py-2 text-sm font-['Inter'] font-medium transition-colors ${
                  active
                    ? 'bg-[#022269] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {d.label}
              </Link>
            )
          })}
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-16 h-16 bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
                <path d="M9 12h6M9 16h6M7 4H4a1 1 0 00-1 1v15a1 1 0 001 1h16a1 1 0 001-1V9l-5-5H7z" strokeLinecap="square"/>
              </svg>
            </div>
            <p className="text-gray-400 font-['Inter']">No articles published yet. Check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map(article => {
              const color = getDomainColor(article.domain)
              const label = getDomainLabel(article.domain)
              return (
                <Link
                  key={article.id}
                  href={`/articles/${article.id}`}
                  className="group bg-white border border-gray-100 hover:shadow-md transition-shadow flex flex-col"
                >
                  {/* Top color bar */}
                  <div className="h-1" style={{ background: color }} />
                  <div className="p-6 flex flex-col flex-1">
                    {/* Domain tag */}
                    <span
                      className="text-xs font-bold tracking-[0.2em] uppercase font-['Inter'] mb-3"
                      style={{ color }}
                    >
                      {label}
                    </span>

                    {/* Title */}
                    <h2 className="text-[#022269] font-bold font-['Raleway'] text-lg leading-snug mb-3 group-hover:text-[#c71430] transition-colors flex-1">
                      {article.title}
                    </h2>

                    {/* Summary */}
                    {article.excerpt && (
                      <p className="text-gray-500 text-sm leading-relaxed font-['Inter'] mb-4 line-clamp-3">
                        {article.excerpt}
                      </p>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
                      <span className="text-xs text-gray-400 font-['Inter']">
                        {article.author?.name ?? 'Loida British'}
                      </span>
                      <span className="text-xs text-gray-400 font-['Inter']">
                        {formatDate(article.publishedAt ?? article.createdAt)}
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        {/* CTA */}
        {articles.length > 0 && (
          <div className="mt-16 bg-[#022269] p-10 text-center">
            <h2 className="text-2xl font-bold text-white font-['Raleway'] mb-3">Want to contribute?</h2>
            <p className="text-blue-200 font-['Tajawal'] mb-6">
              Our coaches and mentors share knowledge regularly. Join Loida British to access all content.
            </p>
            <Link href="/auth/signup"
              className="inline-flex items-center gap-2 bg-[#c71430] hover:bg-[#a01028] text-white font-semibold px-8 py-3 font-['Inter'] transition-colors text-sm">
              Join Now
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </>
  )
}
