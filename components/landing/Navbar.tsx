'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

// Exact widths from Wix HeaderSITEHEADER component
// href: go to a page directly | anchor: scroll to section on homepage
const links: { label: string; width: string; anchor?: string; href?: string }[] = [
  { label: 'HOME',           anchor: 'home',           width: '75px'  },
  { label: 'WHO WE ARE',    anchor: 'who-we-are',      width: '127px' },
  { label: 'WHAT WE OFFER', anchor: 'what-we-offer',   width: '151px' },
  { label: 'BUSINESS CLOCK',anchor: 'business-clock',  width: '159px' },
  { label: 'LOCATION',      anchor: 'location',        width: '105px' },
  { label: 'CONTACT US',    href: '/contact',           width: '125px' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('HOME')
  const pathname = usePathname()
  const router = useRouter()
  const isHome = pathname === '/'

  // Highlight active section on homepage via IntersectionObserver
  useEffect(() => {
    if (!isHome) return
    const observers: IntersectionObserver[] = []
    links.forEach(l => {
      const el = l.anchor ? document.getElementById(l.anchor) : null
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(l.label) },
        { rootMargin: '-40% 0px -55% 0px' }
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach(o => o.disconnect())
  }, [isHome])

  const handleClick = (label: string, anchor?: string, href?: string) => {
    setOpen(false)
    setActive(label)
    if (href) {
      router.push(href)
      return
    }
    if (!anchor) return
    if (isHome) {
      const el = document.getElementById(anchor)
      el?.scrollIntoView({ behavior: 'smooth' })
    } else {
      router.push(`/#${anchor}`)
    }
  }

  return (
    /* bg-color-grey-96 = #f0f7f9, height 117px, sticky, z-[99] */
    <header className="fixed top-0 inset-x-0 z-[99] bg-[#f0f7f9]">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-[117px]">


        {/* Desktop nav — ALL CAPS, 14.8px, #444, Inter */}
        <nav className="hidden lg:flex items-center h-[30px]">
          {links.map(l => (
            <button
              key={l.label}
              onClick={() => handleClick(l.label, l.anchor, l.href)}
              style={{ width: l.width }}
              className={cn(
                'flex items-center justify-center leading-[30px] text-[14.8px] font-normal font-[Inter,sans-serif] cursor-pointer transition-colors whitespace-nowrap px-[6px]',
                active === l.label
                  ? 'bg-[#c0c8da] text-[#444]'
                  : 'text-[#444] hover:bg-[#c0c8da]/60'
              )}
            >
              {l.label}
            </button>
          ))}
        </nav>

        {/* Log In — #607980, 17.3px, line-height 31.5px */}
        <div className="hidden lg:flex items-center">
          <Link
            href="/auth/login"
            className="flex items-center py-1.5 pl-[7px] pr-0 text-[#607980] hover:text-[#022269] transition-colors font-['Inter']"
          >
            <span className="h-[26px] w-[26px] flex items-center justify-center mr-[7px]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
              </svg>
            </span>
            <span className="text-[17.3px] leading-[31.5px]">Log In</span>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button className="lg:hidden text-[#444] p-1" onClick={() => setOpen(!open)}>
          <div className="space-y-1.5">
            <span className={cn('block w-6 h-0.5 bg-[#444] transition-all', open && 'rotate-45 translate-y-2')} />
            <span className={cn('block w-6 h-0.5 bg-[#444] transition-all', open && 'opacity-0')} />
            <span className={cn('block w-6 h-0.5 bg-[#444] transition-all', open && '-rotate-45 -translate-y-2')} />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-[#f0f7f9] border-t border-gray-200 px-6 py-4 flex flex-col gap-1">
          {links.map(l => (
            <button
              key={l.label}
              onClick={() => handleClick(l.label, l.anchor, l.href)}
              className={cn(
                'text-left text-[14.8px] py-2.5 border-b border-gray-200 font-normal font-[Inter,sans-serif] transition-colors',
                active === l.label ? 'bg-[#c0c8da] px-2 text-[#444]' : 'text-[#444]'
              )}
            >
              {l.label}
            </button>
          ))}
          <Link href="/auth/login" className="text-[#607980] text-[17.3px] font-normal py-2 mt-1 font-['Inter']">
            Log In
          </Link>
        </div>
      )}
    </header>
  )
}
