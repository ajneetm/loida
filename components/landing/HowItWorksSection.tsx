import Link from 'next/link'
import Image from 'next/image'

// Business Clock teaser — matches Wix loidabritish.com homepage "فلسفتنا" section
export default function HowItWorksSection() {
  return (
    <section id="business-clock" className="bg-[#022269] py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Clock image */}
          <div className="flex justify-center order-2 lg:order-1">
            <div className="relative w-72 h-72 md:w-96 md:h-96">
              <Image
                src="/images/business-clock.png"
                alt="The Ajnee Business Clock (DING)"
                fill
                className="object-contain drop-shadow-2xl"
              />
            </div>
          </div>

          {/* Text */}
          <div className="order-1 lg:order-2">
            <p className="text-[#c71430] text-xs tracking-[0.3em] uppercase font-semibold mb-4 font-['Inter']">
              فلسفتنا — Our Philosophy
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-white font-['Raleway'] leading-tight mb-4">
              The Business Clock
            </h2>
            <p className="text-blue-200 text-xl font-['Tajawal'] mb-6">
              We support your project <span className="text-white font-bold">Hour by Hour</span>
            </p>
            <p className="text-blue-300 font-['Inter'] text-sm leading-relaxed mb-10">
              The Ajnee Business Clock (DING) is an integrated management system that mentors companies
              and business owners through every business function — providing a clear roadmap with
              tailored support to achieve sustainable success.
            </p>
            <Link
              href="/business-clock"
              className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-[#022269] font-semibold px-8 py-3 font-['Inter'] text-sm transition-colors"
            >
              Click here
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"/>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
