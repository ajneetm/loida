'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'

const links = [
  { label: 'Platform',   href: '#domains' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Membership', href: '#membership' },
  { label: 'Articles',   href: '/articles' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (href: string) => {
    setOpen(false)
    if (href.startsWith('#')) {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header className={cn(
      'fixed top-0 inset-x-0 z-50 transition-all duration-500',
      scrolled
        ? 'bg-[#0A1628]/95 backdrop-blur-md border-b border-white/8 py-3'
        : 'bg-transparent py-5'
    )}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 relative">
            <Image
              src="https://static.wixstatic.com/media/706dde_227e86ca03734151ba9b38890bb65bd0~mv2.png/v1/fill/w_305,h_299,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/logo%209989-13.png"
              alt="Loida British"
              fill
              className="object-contain brightness-0 invert"
            />
          </div>
          <div>
            <p className="text-white text-[13px] font-semibold tracking-[0.15em] leading-none">LOIDA BRITISH</p>
            <p className="text-[#B8973A] text-[9px] tracking-[0.2em] uppercase mt-0.5">Learning & Training</p>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <button
              key={l.label}
              onClick={() => scrollTo(l.href)}
              className="text-[13px] text-white/70 hover:text-white tracking-wide transition-colors"
            >
              {l.label}
            </button>
          ))}
        </nav>

        {/* CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/auth/login" className="text-[13px] text-white/70 hover:text-white tracking-wide transition-colors px-3 py-1.5">
            Sign In
          </Link>
          <Link
            href="/auth/signup"
            className="bg-[#B8973A] hover:bg-[#D4B05A] text-white text-[13px] font-medium px-5 py-2 rounded-full tracking-wide transition-colors"
          >
            Start Your Journey
          </Link>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-white p-1" onClick={() => setOpen(!open)}>
          <div className="space-y-1.5">
            <span className={cn('block w-6 h-0.5 bg-white transition-all', open && 'rotate-45 translate-y-2')} />
            <span className={cn('block w-6 h-0.5 bg-white transition-all', open && 'opacity-0')} />
            <span className={cn('block w-6 h-0.5 bg-white transition-all', open && '-rotate-45 -translate-y-2')} />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#0A1628]/98 border-t border-white/10 px-6 py-6 flex flex-col gap-4">
          {links.map(l => (
            <button key={l.label} onClick={() => scrollTo(l.href)} className="text-left text-white/80 text-sm py-1">
              {l.label}
            </button>
          ))}
          <hr className="border-white/10" />
          <Link href="/auth/login" className="text-white/70 text-sm">Sign In</Link>
          <Link href="/auth/signup" className="bg-[#B8973A] text-white text-sm font-medium px-5 py-2.5 rounded-full text-center">
            Start Your Journey
          </Link>
        </div>
      )}
    </header>
  )
}
