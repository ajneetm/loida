'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Users, UserCheck, GraduationCap,
  BookOpen, Award, ChevronLeft, Menu, X, LogOut
} from 'lucide-react'

const navGroups = [
  {
    label: 'Overview',
    items: [
      { label: 'Dashboard',  href: '/admin',              icon: LayoutDashboard },
    ],
  },
  {
    label: 'Trainer Network',
    items: [
      { label: 'Agents',     href: '/admin/agents',       icon: UserCheck },
      { label: 'Trainers',   href: '/admin/trainers',     icon: GraduationCap },
      { label: 'Curricula',  href: '/admin/curricula',    icon: BookOpen },
    ],
  },
  {
    label: 'Platform',
    items: [
      { label: 'Users',      href: '/admin/users',        icon: Users },
      { label: 'Coaches',    href: '/admin/coaches',      icon: Award },
    ],
  },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname  = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#F8F7F4] flex">

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-60 bg-[#022269] flex flex-col z-50
        transform transition-transform duration-200
        ${open ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:flex
      `}>
        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/10 flex items-center justify-between">
          <div>
            <p className="text-white text-xs font-semibold tracking-widest">LOIDA BRITISH</p>
            <p className="text-[#c71430] text-[9px] tracking-widest uppercase mt-0.5">Admin Panel</p>
          </div>
          <button onClick={() => setOpen(false)} className="lg:hidden text-white/40 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
          {navGroups.map(group => (
            <div key={group.label}>
              <p className="text-white/30 text-[9px] font-semibold tracking-widest uppercase px-2 mb-1">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.map(item => {
                  const active = item.href === '/admin'
                    ? pathname === '/admin'
                    : pathname.startsWith(item.href)
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors ${
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
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-white/10 space-y-1">
          <Link href="/dashboard"
            className="flex items-center gap-3 px-3 py-2 rounded text-sm text-white/40 hover:text-white hover:bg-white/8 transition-colors">
            <ChevronLeft className="w-4 h-4" />
            User Dashboard
          </Link>
          <Link href="/auth/login"
            className="flex items-center gap-3 px-3 py-2 rounded text-sm text-white/40 hover:text-white hover:bg-white/8 transition-colors">
            <LogOut className="w-4 h-4" />
            Sign Out
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile topbar */}
        <header className="lg:hidden bg-white border-b border-stone-100 px-4 py-3 flex items-center gap-3 sticky top-0 z-30">
          <button onClick={() => setOpen(true)} className="text-[#022269]">
            <Menu className="w-5 h-5" />
          </button>
          <p className="text-[#022269] text-sm font-semibold">Admin Panel</p>
        </header>

        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full">
          {children}
        </main>
      </div>
    </div>
  )
}
