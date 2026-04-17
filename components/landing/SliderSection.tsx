'use client'
import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import LiveClock from './LiveClock'

const slides = [
  {
    id: 1,
    src: '/images/slide-1.jpg',
    alt: 'Seize Business Opportunities',
    tag: 'Advanced Courses',
    title: 'Seize Business\nOpportunities',
    body: 'Develop general market awareness and effectively manage opportunities and risks — an exclusive programme for entrepreneurs featuring The Business Clock techniques.',
    cta: { label: 'Explore Programme', href: '/programs/advanced' },
    align: 'left' as const,
    clockOverlay: true,
  },
  {
    id: 2,
    src: '/images/slide-2.jpg',
    alt: 'Business Mentoring',
    tag: 'Business Mentoring',
    title: 'Reach Your\nHighest Potential',
    body: 'Personalised guidance, expert advice, and strategic insights to empower individuals and organisations toward substantial growth and success.',
    cta: { label: 'Start Mentoring', href: '/programs/business-mentoring' },
    align: 'left' as const,
  },
  {
    id: 3,
    src: '/images/slide-3.jpg',
    alt: 'Networking and Collaboration',
    tag: 'Life Skills',
    title: 'Build the Skills\nfor a Fresh Start',
    body: 'Communication, problem-solving, financial literacy, and career readiness — practical lessons designed to be directly applicable to real-life situations.',
    cta: { label: 'Join the Programme', href: '/programs/life-skills' },
    align: 'right' as const,
  },
  {
    id: 4,
    src: '/images/slide-4.jpg',
    alt: 'Public Sector Training',
    tag: 'Public Sector Training',
    title: 'Shaping Future\nLeaders in Public Service',
    body: 'Targeted, high-impact training programmes for civil servants and public service professionals — delivered by experienced practitioners with deep sectoral knowledge.',
    cta: { label: 'Request Training', href: '/programs/public-sector' },
    align: 'left' as const,
  },
  {
    id: 5,
    src: '/images/slide-5.jpg',
    alt: 'ESOL English Qualifications',
    tag: 'ESOL Award',
    title: 'English Qualifications\nfor Every Level',
    body: 'Internationally recognised ESOL qualifications covering all linguistic modes — Reading, Writing, Speaking & Listening — from Entry 1 through Level 2.',
    cta: { label: 'Enrol in ESOL', href: '/programs/esol' },
    align: 'right' as const,
  },
]

export default function SliderSection() {
  const [current, setCurrent] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const next = useCallback(() => {
    setCurrent(c => (c + 1) % slides.length)
  }, [])

  const prev = useCallback(() => {
    setCurrent(c => (c - 1 + slides.length) % slides.length)
  }, [])

  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(next, 6000)
    return () => clearInterval(timer)
  }, [isPaused, next])

  const slide = slides[current]
  const isRight = slide.align === 'right'

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: '520px' }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background slides — cross-fade */}
      {slides.map((s, i) => (
        <div
          key={s.id}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
        >
          <Image
            src={s.src}
            alt={s.alt}
            fill
            className="object-cover object-center"
            priority={i === 0}
            sizes="100vw"
          />
          {/* Dark gradient overlay — direction depends on align */}
          <div
            className="absolute inset-0"
            style={{
              background: isRight
                ? 'linear-gradient(to left, rgba(2,34,105,0.92) 0%, rgba(2,34,105,0.70) 45%, rgba(2,34,105,0.15) 100%)'
                : 'linear-gradient(to right, rgba(2,34,105,0.92) 0%, rgba(2,34,105,0.70) 45%, rgba(2,34,105,0.15) 100%)',
            }}
          />
        </div>
      ))}

      {/* Clock overlay for slide 1 */}
      {slide.clockOverlay && (
        <div className="absolute inset-0 z-10 flex items-center justify-end pointer-events-none">
          <div className="mr-16 opacity-90 drop-shadow-2xl">
            <LiveClock size={380} />
          </div>
        </div>
      )}

      {/* Text overlay — switches with slide */}
      <div className="absolute inset-0 z-10 flex items-center">
        <div className="max-w-6xl mx-auto px-6 w-full">
          <div className={`max-w-lg ${isRight ? 'ml-auto text-right' : ''}`}>

            {/* Tag */}
            <div className={`flex items-center gap-2 mb-4 ${isRight ? 'justify-end' : ''}`}>
              <div className={`w-6 h-0.5 bg-[#c71430] ${isRight ? 'order-last' : ''}`} />
              <span
                key={`tag-${current}`}
                className="text-[#c71430] text-xs font-bold tracking-[0.3em] uppercase font-['Inter'] animate-fade-in"
              >
                {slide.tag}
              </span>
            </div>

            {/* Title */}
            <h2
              key={`title-${current}`}
              className="text-white font-bold leading-tight mb-5 font-['Raleway'] animate-fade-in"
              style={{ fontSize: 'clamp(28px, 3.8vw, 52px)', whiteSpace: 'pre-line' }}
            >
              {slide.title}
            </h2>

            {/* Body */}
            <p
              key={`body-${current}`}
              className="text-blue-100/85 leading-relaxed mb-7 font-['Tajawal'] animate-fade-in"
              style={{ fontSize: '16px' }}
            >
              {slide.body}
            </p>

            {/* CTA */}
            <Link
              key={`cta-${current}`}
              href={slide.cta.href}
              className="inline-flex items-center gap-2 bg-[#c71430] hover:bg-[#a01028] text-white font-semibold px-7 h-[44px] font-['Inter'] transition-colors text-sm animate-fade-in"
            >
              {slide.cta.label}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7H12M8 3L12 7L8 11" stroke="white" strokeWidth="1.5" strokeLinecap="square"/>
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Prev / Next arrows */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/15 hover:bg-white/35 text-white flex items-center justify-center transition-colors border border-white/20"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M11 4L6 9L11 14" stroke="white" strokeWidth="1.8" strokeLinecap="square"/>
        </svg>
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/15 hover:bg-white/35 text-white flex items-center justify-center transition-colors border border-white/20"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M7 4L12 9L7 14" stroke="white" strokeWidth="1.8" strokeLinecap="square"/>
        </svg>
      </button>

      {/* Dot indicators + slide counter */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="transition-all duration-300"
            style={{
              width: i === current ? '24px' : '8px',
              height: '4px',
              background: i === current ? '#c71430' : 'rgba(255,255,255,0.45)',
            }}
          />
        ))}
      </div>

      {/* Slide number */}
      <div className="absolute bottom-5 right-6 z-20 text-white/40 text-xs font-['Inter'] tabular-nums">
        {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
      </div>
    </section>
  )
}
