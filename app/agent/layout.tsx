'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { Users, LayoutDashboard, Menu, X } from 'lucide-react'

const navItems = [
  { label: 'Dashboard', href: '/agent',         icon: LayoutDashboard },
  { label: 'Trainers',  href: '/agent/trainers', icon: Users },
]

export default function AgentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#F8F7F4] flex">

      {open && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setOpen(false)} />
      )}

      {/* Sidebar — matches DashboardSidebar style */}
      <aside className={`
        fixed top-0 left-0 h-full w-60 bg-[#022269] text-white flex flex-col z-50
        transform transition-transform duration-200
        ${open ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:flex lg:min-h-screen lg:h-auto lg:sticky lg:top-0 lg:self-stretch
      `}>
        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/10 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 relative flex-shrink-0">
              <Image src="/images/logo.png" alt="Loida British" fill className="object-contain brightness-0 invert" />
            </div>
            <div>
              <p className="text-[11px] font-bold tracking-[0.18em] text-white">LOIDA BRITISH</p>
              <p className="text-[8px] tracking-[0.2em] text-[#c71430] uppercase">Agent Portal</p>
            </div>
          </Link>
          <button type="button" onClick={() => setOpen(false)} className="lg:hidden text-white/40 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-2 overflow-y-auto">
          {navItems.map(item => {
            const active = item.href === '/agent'
              ? pathname === '/agent'
              : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 text-[13px] transition-all border-l-2 ${
                  active
                    ? 'bg-[#c71430] text-white font-medium border-white'
                    : 'text-white/60 hover:text-white hover:bg-white/8 border-transparent'
                }`}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Sign out */}
        <div className="px-4 py-3 border-t border-white/10">
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: '/auth/login' })}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-white/35 hover:text-white/70 text-[13px] transition-colors"
          >
            <span>⇥</span> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile topbar */}
        <header className="lg:hidden bg-white border-b border-stone-200 px-4 py-3 flex items-center gap-3 sticky top-0 z-30">
          <button type="button" onClick={() => setOpen(true)} className="text-[#022269]">
            <Menu className="w-5 h-5" />
          </button>
          <p className="text-[#022269] text-sm font-semibold">Agent Portal</p>
        </header>

        <main className="flex-1 p-6 md:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
