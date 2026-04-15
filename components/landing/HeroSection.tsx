'use client'
import Link from 'next/link'
import Image from 'next/image'

export default function HeroSection() {
  return (
    <section id="home" className="relative min-h-[600px] flex items-center overflow-hidden pt-[117px]">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-bg.jpg"
          alt=""
          fill
          className="object-cover object-center"
          priority
        />
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(to right, rgba(1,19,68,0.95) 0%, rgba(2,34,105,0.85) 55%, rgba(2,34,105,0.55) 100%)',
      }} />

      {/* Content — logo left, text right */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 w-full">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-12 md:gap-20">

          {/* Logo block */}
          <div className="flex-shrink-0 flex flex-col items-center gap-3">
            <div className="w-28 h-28 relative">
              <Image
                src="/images/logo.png"
                alt="Loida British"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="text-center">
              <p className="text-white text-[13px] font-bold tracking-[0.18em] leading-none font-['Raleway']">LOIDA BRITISH</p>
              <p className="text-blue-300 text-[9px] tracking-[0.22em] uppercase mt-1.5 font-['Inter']">Learning & Training</p>
            </div>
          </div>

          {/* Text block */}
          <div className="max-w-xl">
            <h1
              className="text-white font-bold leading-tight mb-6 font-['Raleway']"
              style={{ fontSize: 'clamp(32px, 5vw, 66px)' }}
            >
              We Pave The Path<br />
              To <span style={{ color: '#c71430' }}>Excellence.</span>
            </h1>

            <p className="text-blue-100/90 leading-relaxed mb-10 font-['Tajawal']" style={{ fontSize: '19px' }}>
              At Loida British Ltd we embark on a transformative journey where aspirations become achievements that shape a brighter future.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#who-we-are"
                onClick={(e) => { e.preventDefault(); document.querySelector('#who-we-are')?.scrollIntoView({ behavior: 'smooth' }) }}
                className="bg-[#c71430] hover:bg-[#a01028] text-white font-semibold flex items-center justify-center px-8 h-[46px] cursor-pointer font-['Inter'] transition-colors"
                style={{ fontSize: '15px', letterSpacing: '0.5px' }}
              >
                Discover More
              </a>
              <Link
                href="/auth/signup"
                className="border-2 border-white/60 text-white hover:bg-white/10 font-semibold flex items-center justify-center h-[46px] px-8 font-['Inter'] transition-colors"
                style={{ fontSize: '15px' }}
              >
                Get Started
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
