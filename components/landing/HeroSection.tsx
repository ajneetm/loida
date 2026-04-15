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

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 w-full">
        <div className="max-w-2xl">

          {/* Eyebrow label */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-0.5 bg-[#c71430]" />
            <span className="text-[#c71430] text-xs font-bold tracking-[0.35em] uppercase font-['Inter']">
              Loida British Ltd
            </span>
          </div>

          {/* Heading */}
          <h1
            className="text-white font-bold leading-tight mb-6 font-['Raleway']"
            style={{ fontSize: 'clamp(36px, 5.5vw, 72px)' }}
          >
            We Pave The Path<br />
            To <span style={{ color: '#c71430' }}>Excellence.</span>
          </h1>

          {/* Tagline */}
          <p className="text-blue-100/90 leading-relaxed mb-10 font-['Tajawal']" style={{ fontSize: '19px', maxWidth: '520px' }}>
            At Loida British Ltd we embark on a transformative journey where aspirations become achievements that shape a brighter future.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap items-center gap-4 mb-16">
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

          {/* Stats strip */}
          <div className="flex flex-wrap items-center gap-8">
            {[
              { value: '30+', label: 'Years Experience' },
              { value: '5K+', label: 'Lives Transformed' },
              { value: '5',   label: 'Key Programmes' },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-3">
                {i > 0 && <div className="w-px h-8 bg-white/20" />}
                <div>
                  <p className="text-white font-bold font-['Raleway'] leading-none" style={{ fontSize: '26px' }}>{stat.value}</p>
                  <p className="text-blue-200/70 text-xs tracking-wide mt-0.5 font-['Inter']">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Decorative right-side image panel — visible on large screens */}
      <div className="hidden xl:block absolute right-0 top-0 bottom-0 w-[38%] overflow-hidden">
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to right, rgba(2,34,105,0.95) 0%, transparent 35%)',
          zIndex: 1,
        }} />
        <Image
          src="/images/hero-person.jpg"
          alt="Loida British"
          fill
          className="object-cover object-center"
          priority
        />
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-gray-50 to-transparent" />
    </section>
  )
}
