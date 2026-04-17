import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'

export const metadata = {
  title: 'The Business Clock (DING) | Loida British',
  description: 'The Ajnee Business Clock (DING) — an integrated management system that mentors companies and business owners through every business function.',
}

const modules = [
  {
    number: '2',
    label: 'INCORPORATE',
    color: '#022269',
    position: 'top-left',
    desc: 'Relying on preparation, planning, and final decision-making for operations, including decisions on identity, legal entity, resources, and necessary infrastructure.',
  },
  {
    number: '3',
    label: 'NAVIGATE',
    color: '#607980',
    position: 'top-right',
    desc: 'Efficiently managing and operating the business, leveraging marketing efforts to increase sales and ensure sustainability in the market.',
  },
  {
    number: '1',
    label: 'DRAFT',
    color: '#c71430',
    position: 'bottom-left',
    desc: 'Depending on critical thinking and logical market analysis to determine the optimal solutions for the product. Devise market penetration strategies and plan for operations.',
  },
  {
    number: '4',
    label: 'GENERATE',
    color: '#022269',
    position: 'bottom-right',
    desc: 'Generating revenue and estimating net income to evaluate returns, review overall performance, and assess specific performance at the level of each function within the business clock.',
  },
]

export default function BusinessClockPage() {
  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="pt-[117px] bg-[#022269]">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <p className="text-[#c71430] text-xs tracking-[0.3em] uppercase font-semibold mb-3 font-['Inter']">
            Our Philosophy
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white font-['Raleway'] leading-tight">
            The Business Clock
            <span className="text-[#c71430]"> (DING)</span>
          </h1>
          <p className="text-blue-200 mt-3 font-['Tajawal'] text-xl max-w-2xl">
            We support your project <strong className="text-white">Hour by Hour</strong>
          </p>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="bg-[#f0f7f9] border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-2 text-sm font-['Inter']">
          <Link href="/" className="text-[#022269] hover:underline">Home</Link>
          <span className="text-gray-400">›</span>
          <span className="text-gray-500">Business Clock</span>
        </div>
      </div>

      <main>
        {/* Intro */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-6 py-14">
            <div className="max-w-3xl">
              <div className="w-14 h-1 bg-[#c71430] mb-6" />
              <p className="text-[#022269] text-xl leading-relaxed font-['Tajawal'] mb-4">
                The Ajnee Business Clock (DING) is an integrated management system that mentors
                companies and business owners through business functions.
              </p>
              <p className="text-gray-500 leading-relaxed font-['Inter']">
                It provides a clear roadmap with tailored support to help businesses maximise their
                potential and achieve sustainable success. Whether entering the market or optimising
                operations, the Ajnee Business Clock guides effective management and growth, assisting
                in planning, executing, and reviewing business strategies and performance.
              </p>
            </div>
          </div>
        </div>

        {/* DING Modules — Clock layout */}
        <div className="bg-[#f8f9fc] py-16">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex items-center gap-3 mb-12">
              <div className="w-8 h-0.5 bg-[#c71430]" />
              <h2 className="text-2xl font-bold text-[#022269] font-['Raleway']">DING MODULE</h2>
            </div>

            {/* Clock + 4 quadrant layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">

              {/* Left modules */}
              <div className="flex flex-col gap-6">
                {modules.filter(m => m.position.includes('left')).map(mod => (
                  <div
                    key={mod.number}
                    className="bg-white border-r-4 p-6 shadow-sm hover:shadow-md transition-shadow text-right"
                    style={{ borderColor: mod.color }}
                  >
                    <p className="text-xs font-bold tracking-[0.25em] uppercase font-['Inter'] mb-1"
                      style={{ color: mod.color }}>
                      {mod.number} — {mod.label}
                    </p>
                    <p className="text-gray-500 text-sm leading-relaxed font-['Inter']">{mod.desc}</p>
                  </div>
                ))}
              </div>

              {/* Clock image — center */}
              <div className="flex justify-center">
                <div className="relative w-72 h-72 md:w-80 md:h-80">
                  <Image
                    src="/images/business-clock.png"
                    alt="The Ajnee Business Clock (DING)"
                    fill
                    className="object-contain drop-shadow-2xl"
                  />
                </div>
              </div>

              {/* Right modules */}
              <div className="flex flex-col gap-6">
                {modules.filter(m => m.position.includes('right')).map(mod => (
                  <div
                    key={mod.number}
                    className="bg-white border-l-4 p-6 shadow-sm hover:shadow-md transition-shadow"
                    style={{ borderColor: mod.color }}
                  >
                    <p className="text-xs font-bold tracking-[0.25em] uppercase font-['Inter'] mb-1"
                      style={{ color: mod.color }}>
                      {mod.number} — {mod.label}
                    </p>
                    <p className="text-gray-500 text-sm leading-relaxed font-['Inter']">{mod.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile: show all as cards */}
            <div className="lg:hidden mt-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[...modules].sort((a,b) => +a.number - +b.number).map(mod => (
                <div
                  key={mod.number}
                  className="bg-white border-t-4 p-6 shadow-sm"
                  style={{ borderColor: mod.color }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 flex items-center justify-center text-white font-bold text-sm font-['Raleway']"
                      style={{ background: mod.color }}>
                      {mod.number}
                    </div>
                    <p className="text-xs font-bold tracking-[0.25em] uppercase font-['Inter']"
                      style={{ color: mod.color }}>
                      {mod.label}
                    </p>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed font-['Inter']">{mod.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-[#022269] py-16">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white font-['Raleway'] mb-3">
              Ready to transform your business with the Ajnee Business Clock?
            </h2>
            <p className="text-blue-200 font-['Tajawal'] mb-3 max-w-2xl mx-auto">
              Contact us today to schedule a consultation and embark on your journey towards sustainable success.
            </p>
            <p className="text-blue-300 font-['Inter'] text-sm mb-8 max-w-2xl mx-auto">
              Our team blends extensive market experience with profound academic expertise, enabling us to
              innovate at every hour with highly effective practical models.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-[#c71430] hover:bg-[#a01028] text-white font-semibold px-10 py-3 font-['Inter'] text-sm transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
