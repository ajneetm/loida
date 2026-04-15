import Link from 'next/link'
import { notFound } from 'next/navigation'
import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'
import { prisma } from '@/lib/prisma'
import { formatDate, getDomainColor, getDomainLabel } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function ArticlePage({ params }: { params: { id: string } }) {
  const article = await prisma.article.findUnique({
    where: { id: params.id, isPublished: true },
    include: { author: { select: { name: true, role: true } } },
  })

  if (!article) notFound()

  const color = getDomainColor(article.domain)
  const label = getDomainLabel(article.domain)

  return (
    <>
      <Navbar />

      {/* Hero bar */}
      <section className="pt-[117px] bg-[#022269]">
        <div className="max-w-4xl mx-auto px-6 py-14">
          <span className="text-xs font-bold tracking-[0.3em] uppercase font-['Inter']" style={{ color }}>
            {label}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-white font-['Raleway'] leading-tight mt-3 mb-4">
            {article.title}
          </h1>
          <div className="flex items-center gap-4 text-blue-300 text-sm font-['Inter']">
            <span>{article.author?.name ?? 'Loida British'}</span>
            <span className="w-1 h-1 bg-blue-400 rounded-full" />
            <span>{formatDate(article.publishedAt ?? article.createdAt)}</span>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="bg-[#f0f7f9] border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-3 flex items-center gap-2 text-sm font-['Inter']">
          <Link href="/" className="text-[#022269] hover:underline">Home</Link>
          <span className="text-gray-400">›</span>
          <Link href="/articles" className="text-[#022269] hover:underline">Articles</Link>
          <span className="text-gray-400">›</span>
          <span className="text-gray-500 truncate max-w-[200px]">{article.title}</span>
        </div>
      </div>

      {/* Article content */}
      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <article className="lg:col-span-8">
            <div className="w-12 h-1 mb-8" style={{ background: color }} />

            {article.excerpt && (
              <p className="text-[#022269] text-xl leading-relaxed font-['Tajawal'] mb-10 pb-10 border-b border-gray-100">
                {article.excerpt}
              </p>
            )}

            <div
              className="prose prose-lg max-w-none font-['Inter'] text-gray-700 leading-relaxed
                prose-headings:font-['Raleway'] prose-headings:text-[#022269]
                prose-a:text-[#c71430] prose-a:no-underline hover:prose-a:underline
                prose-strong:text-[#022269]"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-[130px] space-y-6">
              {/* Author card */}
              <div className="bg-gray-50 p-6 border border-gray-100">
                <p className="text-xs text-gray-400 uppercase tracking-widest font-['Inter'] mb-3">Written by</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#022269] flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm font-['Raleway']">
                      {(article.author?.name ?? 'L').charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-[#022269] text-sm font-['Inter']">
                      {article.author?.name ?? 'Loida British'}
                    </p>
                    <p className="text-gray-400 text-xs font-['Inter'] capitalize">
                      {article.author?.role?.toLowerCase() ?? 'Coach'}
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="bg-[#022269] p-6">
                <p className="text-white font-bold font-['Raleway'] text-lg mb-2">Ready to get started?</p>
                <p className="text-blue-200 text-sm font-['Inter'] mb-5">
                  Explore our programmes and begin your journey today.
                </p>
                <Link href="/contact"
                  className="block text-center bg-[#c71430] hover:bg-[#a01028] text-white font-semibold py-3 font-['Inter'] transition-colors text-sm">
                  Contact Us
                </Link>
              </div>

              {/* Back link */}
              <Link href="/articles"
                className="flex items-center gap-2 text-[#022269] text-sm font-['Inter'] hover:opacity-70 transition-opacity">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M10 4L6 8L10 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"/>
                </svg>
                All Articles
              </Link>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </>
  )
}
