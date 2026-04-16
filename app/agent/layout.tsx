'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Users, LayoutDashboard, Menu, X, LogOut } from 'lucide-react'

const navItems = [
  { label: 'Dashboard', href: '/agent',          icon: LayoutDashboard },
  { label: 'Trainers',  href: '/agent/trainers',  icon: Users },
]

export default function AgentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#F8F7F4] flex">

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-56 bg-[#1C2B39] flex flex-col z-50
        transform transition-transform duration-200
        ${open ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:flex
      `}>
        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/10 flex items-center justify-between">
          <div>
            <p className="text-white text-xs font-semibold tracking-widest">LOIDA BRITISH</p>
            <p className="text-[#6B8F9E] text-[9px] tracking-widest uppercase mt-0.5">Agent Portal</p>
          </div>
          <button onClick={() => setOpen(false)} className="lg:hidden text-white/40 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-0.5">
          {navItems.map(item => {
            const active = item.href === '/agent'
              ? pathname === '/agent'
              : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm transition-colors ${
                  active
                    ? 'bg-white/12 text-white'
                    : 'text-white/50 hover:text-white hover:bg-white/8'
                }`}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-white/10">
          <Link href="/auth/signout"
            className="flex items-center gap-3 px-3 py-2 text-sm text-white/40 hover:text-white hover:bg-white/8 transition-colors">
            <LogOut className="w-4 h-4" />
            Sign Out
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile topbar */}
        <header className="lg:hidden bg-white border-b border-stone-100 px-4 py-3 flex items-center gap-3 sticky top-0 z-30">
          <button onClick={() => setOpen(true)} className="text-[#1C2B39]">
            <Menu className="w-5 h-5" />
          </button>
          <p className="text-[#1C2B39] text-sm font-semibold">Agent Portal</p>
        </header>

        <main className="flex-1 p-6 lg:p-8 max-w-5xl w-full">
          {children}
        </main>
      </div>
    </div>
  )
}
