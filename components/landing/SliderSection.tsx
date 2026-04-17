'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import LiveClock from './LiveClock'

type Slide = {
  id: number
  src: string
  alt: string
  tag: string
  title: string
  body: string
  cta: { label: string; href: string }
  align: 'left' | 'right'
  clockOverlay?: boolean
  imageOverlay?: string
  logoOverlay?: string
  tagColor?: string
  bgColor?: string
  overlayStrength?: 'normal' | 'strong'
}

const slides: Slide[] = [
  {
    id: 1,
    src: '',
    bgColor: '#090E34',
    alt: 'The Business Clock',
    tag: 'The Business Clock',
    title: 'Your Competitive Tool\nTowards Excellence',
    body: 'Discover your competitive advantages with The Business Clock — an integrated management system that mentors businesses and entrepreneurs through every stage of growth.',
    cta: { label: 'Test Your Business Position', href: 'https://ajnee.com/dashboard/assessment' },
    align: 'left' as const,
    tagColor: '#ef4444',
    clockOverlay: true,
  },
  {
    id: 2,
    src: '/images/team.jpg',
    alt: 'Business Mentoring',
    tag: 'Business Mentoring',
    title: 'Reach Your\nHighest Potential',
    body: 'Personalised guidance, expert advice, and strategic insights to empower individuals and organisations toward substantial growth and success.',
    cta: { label: 'Start Mentoring', href: '/programs/business-mentoring' },
    align: 'left' as const,
    overlayStrength: 'strong',
  },
  {
    id: 3,
    src: '',
    alt: 'Networking and Collaboration',
    tag: 'Life Skills',
    title: 'Build the Skills\nfor a Fresh Start',
    body: 'Communication, problem-solving, financial literacy, and career readiness — practical lessons designed to be directly applicable to real-life situations.',
    cta: { label: 'Join the Programme', href: '/programs/life-skills' },
    align: 'right' as const,
    imageOverlay: '/images/career.png',
  },
  {
    id: 4,
    src: '/images/slide-3.jpg',
    alt: 'Public Sector Training',
    tag: 'Public Sector Training',
    title: 'Shaping Future\nLeaders in Public Service',
    body: 'Targeted, high-impact training programmes for civil servants and public service professionals — delivered by experienced practitioners with deep sectoral knowledge.',
    cta: { label: 'Request Training', href: '/programs/public-sector' },
    align: 'left' as const,
  },
  {
    id: 5,
    src: '/images/esol-hero.jpg',
    alt: 'ESOL English Qualifications',
    tag: 'ESOL Award',
    title: 'English Qualifications\nfor Every Level',
    body: 'Internationally recognised ESOL qualifications covering all linguistic modes — Reading, Writing, Speaking & Listening — from Entry 1 through Level 2.',
    cta: { label: 'Enrol in ESOL', href: '/programs/esol' },
    align: 'right' as const,
  },
  {
    id: 6,
    src: '',
    alt: 'Harmony — Self-Leadership Platform',
    tag: 'Harmony',
    title: 'Lead Yourself\nto a Better Life',
    body: 'An advanced platform dedicated to self-leadership — helping you understand yourself, diagnose imbalances, and redirect your behaviour toward a more balanced and impactful life.',
    cta: { label: 'Talk to Mr. Harmony', href: 'https://www.harmonymold.com' },
    align: 'left' as const,
    tagColor: '#e53e3e',
    bgColor: '#0a0a0a',
    imageOverlay: '/images/harmony-faces.png',
    logoOverlay: '/images/harmony-logo.svg',
  },
]

export default function SliderSection() {
  const [current, setCurrent] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const touchStartX = useRef<number | null>(null)

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

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev()
    touchStartX.current = null
  }

  const slide = slides[current]
  const isRight = slide.align === 'right'

  return (
    <section
      className="relative w-full overflow-hidden min-h-[480px] md:h-[520px]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Background slides — cross-fade */}
      {slides.map((s, i) => (
        <div
          key={s.id}
          className="absolute inset-0"
          style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0, background: s.bgColor ?? '#022269' }}
        >
          {s.src && (
            <>
              <Image
                src={s.src}
                alt={s.alt}
                fill
                className="object-cover object-center"
                priority={i === 0}
                sizes="100vw"
              />
              <div
                className="absolute inset-0"
                style={{
                  background: s.overlayStrength === 'strong'
                    ? s.align === 'right'
                      ? 'linear-gradient(to left, rgba(2,34,105,0.97) 0%, rgba(2,34,105,0.93) 50%, rgba(2,34,105,0.82) 100%)'
                      : 'linear-gradient(to right, rgba(2,34,105,0.97) 0%, rgba(2,34,105,0.93) 50%, rgba(2,34,105,0.82) 100%)'
                    : s.align === 'right'
                      ? 'linear-gradient(to left, rgba(2,34,105,0.92) 0%, rgba(2,34,105,0.70) 45%, rgba(2,34,105,0.15) 100%)'
                      : 'linear-gradient(to right, rgba(2,34,105,0.92) 0%, rgba(2,34,105,0.70) 45%, rgba(2,34,105,0.15) 100%)',
                }}
              />
            </>
          )}
        </div>
      ))}

      {/* Text + clock layout */}
      <div className="absolute inset-0 z-10 flex items-center">
        <div className="max-w-6xl mx-auto px-6 w-full flex items-center">

          {/* Overlay — left side when text is on the right */}
          {isRight && (slide.imageOverlay || slide.clockOverlay) && (
            <div className="hidden md:flex flex-shrink-0 items-center justify-center mr-12 opacity-90">
              {slide.clockOverlay && <LiveClock size={340} />}
              {slide.imageOverlay && (
                <div className="relative w-[520px] h-[520px]">
                  <Image src={slide.imageOverlay} alt="" fill className="object-contain drop-shadow-2xl" />
                </div>
              )}
            </div>
          )}

          {/* Text block */}
          <div className={`flex-1 ${isRight ? 'ml-auto text-right' : ''}`}>
            <div className={`max-w-lg ${isRight ? 'ml-auto' : ''}`}>

              {/* Logo overlay */}
              {slide.logoOverlay && (
                <div className={`mb-5 ${isRight ? 'flex justify-end' : ''}`}>
                  <div className="relative h-14 w-40">
                    <Image src={slide.logoOverlay} alt={slide.tag} fill className="object-contain object-left" />
                  </div>
                </div>
              )}

              {/* Tag */}
              <div className={`flex items-center gap-2 mb-4 ${isRight ? 'justify-end' : ''}`}>
                <div className={`w-6 h-0.5 ${isRight ? 'order-last' : ''}`} style={{ background: slide.tagColor ?? '#c71430' }} />
                <span
                  key={`tag-${current}`}
                  className="text-xs font-bold tracking-[0.3em] uppercase font-['Inter'] animate-fade-in"
                  style={{ color: slide.tagColor ?? '#c71430' }}
                >
                  {slide.tag}
                </span>
              </div>

              {/* Title */}
              <h2
                key={`title-${current}`}
                className="text-white font-bold leading-tight mb-5 font-['Raleway'] animate-fade-in"
                style={{ fontSize: 'clamp(24px, 3.8vw, 52px)', whiteSpace: 'pre-line' }}
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
                target={slide.cta.href.startsWith('http') ? '_blank' : undefined}
                rel={slide.cta.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="inline-flex items-center gap-2 text-white font-semibold px-7 h-[44px] font-['Inter'] transition-colors text-sm animate-fade-in"
                style={{ background: slide.tagColor ?? '#c71430' }}
              >
                {slide.cta.label}
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7H12M8 3L12 7L8 11" stroke="white" strokeWidth="1.5" strokeLinecap="square"/>
                </svg>
              </Link>
            </div>
          </div>

          {/* Overlay — right side when text is on the left */}
          {!isRight && (slide.imageOverlay || slide.clockOverlay) && (
            <div className="hidden md:flex flex-shrink-0 items-center justify-center ml-12 opacity-90">
              {slide.clockOverlay && <LiveClock size={340} />}
              {slide.imageOverlay && (
                <div className="relative w-[520px] h-[520px]">
                  <Image src={slide.imageOverlay} alt="" fill className="object-contain drop-shadow-2xl" />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Prev / Next arrows — desktop only */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/15 hover:bg-white/35 text-white items-center justify-center transition-colors border border-white/20"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M11 4L6 9L11 14" stroke="white" strokeWidth="1.8" strokeLinecap="square"/>
        </svg>
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/15 hover:bg-white/35 text-white items-center justify-center transition-colors border border-white/20"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M7 4L12 9L7 14" stroke="white" strokeWidth="1.8" strokeLinecap="square"/>
        </svg>
      </button>

      {/* Dot indicators */}
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

      {/* Slide number — desktop only */}
      <div className="hidden md:block absolute bottom-5 right-6 z-20 text-white/40 text-xs font-['Inter'] tabular-nums">
        {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
      </div>
    </section>
  )
}
