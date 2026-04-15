'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cn, getInitials } from '@/lib/utils'
import { signOut } from 'next-auth/react'

const navItems = [
  { label: 'Overview',        href: '/dashboard',             icon: '⊞', roles: ['USER','COACH','ADMIN'] },
  { label: 'Assessments',     href: '/dashboard/assessments', icon: '◎', roles: ['USER','COACH','ADMIN'] },
  { label: 'Programs',        href: '/dashboard/programs',    icon: '◈', roles: ['USER','COACH','ADMIN'] },
  { label: 'My Sessions',     href: '/dashboard/sessions',    icon: '◉', roles: ['USER','COACH','ADMIN'] },
  { label: 'Coaches',         href: '/dashboard/coaches',     icon: '◆', roles: ['USER','COACH','ADMIN'] },
  { label: 'Articles',        href: '/dashboard/articles',    icon: '◇', roles: ['USER','COACH','ADMIN'] },
  { label: 'Membership',      href: '/dashboard/membership',  icon: '✦', roles: ['USER','COACH','ADMIN'] },
  { label: 'Profile',         href: '/dashboard/profile',     icon: '◐', roles: ['USER','COACH','ADMIN'] },
  { label: 'Coach Dashboard', href: '/coach',                 icon: '★', roles: ['COACH','ADMIN'] },
  { label: 'My Schedule',     href: '/coach/sessions',        icon: '⌚', roles: ['COACH','ADMIN'] },
  { label: 'Availability',    href: '/coach/availability',    icon: '◷', roles: ['COACH','ADMIN'] },
  { label: 'Admin Panel',     href: '/admin',                 icon: '⚙', roles: ['ADMIN'] },
]

interface Props {
  user: { name?: string | null; email?: string | null; image?: string | null }
}

export default function DashboardSidebar({ user }: Props) {
  const pathname = usePathname()
  const role = (user as any).role ?? 'USER'

  const userItems  = navItems.filter(i => i.roles.includes('USER') && i.roles.includes(role))
  const coachItems = navItems.filter(i => !i.roles.includes('USER') && i.roles.includes('COACH') && role !== 'USER')
  const adminItems = navItems.filter(i => i.roles.length === 1 && i.roles[0] === 'ADMIN' && role === 'ADMIN')

  const renderItem = (item: typeof navItems[0]) => {
    const active = pathname === item.href ||
      (item.href !== '/dashboard' && item.href !== '/coach' && item.href !== '/admin' && pathname.startsWith(item.href))
    return (
      <Link key={item.href} href={item.href}
        className={cn(
          'flex items-center gap-3 px-4 py-2.5 text-[13px] transition-all duration-150 border-l-2',
          active
            ? 'bg-[#c71430] text-white font-medium border-white'
            : 'text-white/60 hover:text-white hover:bg-white/8 border-transparent'
        )}>
        <span className="text-base leading-none w-4 flex-shrink-0">{item.icon}</span>
        {item.label}
      </Link>
    )
  }

  return (
    <aside className="hidden md:flex w-60 flex-col bg-[#022269] text-white min-h-screen sticky top-0 h-screen">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 relative flex-shrink-0">
            <Image src="/images/logo.png" alt="Loida British" fill className="object-contain brightness-0 invert" />
          </div>
          <div>
            <p className="text-[11px] font-bold tracking-[0.18em] text-white font-['Raleway']">LOIDA BRITISH</p>
            <p className="text-[8px] tracking-[0.2em] text-[#c71430] uppercase font-['Inter']">Learning Hub</p>
          </div>
        </Link>
      </div>

      {/* User card */}
      <div className="px-4 py-4 border-b border-white/10">
        <div className="flex items-center gap-3 p-3 bg-white/6">
          <div className="w-9 h-9 bg-[#c71430] flex items-center justify-center text-white text-xs font-bold flex-shrink-0 font-['Raleway']">
            {getInitials(user.name)}
          </div>
          <div className="min-w-0">
            <p className="text-white text-xs font-semibold truncate">{user.name ?? 'Member'}</p>
            <p className="text-white/40 text-[10px] truncate uppercase tracking-wide">{role}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-2 overflow-y-auto">
        {userItems.map(renderItem)}
        {coachItems.length > 0 && (
          <>
            <div className="px-5 pt-5 pb-2">
              <p className="text-white/25 text-[9px] tracking-[0.25em] uppercase font-['Inter']">Coach</p>
            </div>
            {coachItems.map(renderItem)}
          </>
        )}
        {adminItems.length > 0 && (
          <>
            <div className="px-5 pt-5 pb-2">
              <p className="text-white/25 text-[9px] tracking-[0.25em] uppercase font-['Inter']">Admin</p>
            </div>
            {adminItems.map(renderItem)}
          </>
        )}
      </nav>

      {/* External platforms */}
      <div className="px-4 py-4 border-t border-white/10">
        <p className="text-white/25 text-[9px] tracking-[0.25em] uppercase mb-3 px-1 font-['Inter']">Platforms</p>
        {[
          { name: 'Harmony',        color: '#607980', href: 'https://harmony.loidabritish.com' },
          { name: 'Career',         color: '#c71430', href: 'https://career.loidabritish.com' },
          { name: 'Business Clock', color: '#a0b8c0', href: 'https://businessclock.loidabritish.com' },
        ].map(p => (
          <a key={p.name} href={p.href} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-2 py-1.5 text-white/40 hover:text-white/70 text-xs transition-colors font-['Inter']">
            <span className="w-1.5 h-1.5 flex-shrink-0" style={{ background: p.color }} />
            {p.name}
            <span className="ml-auto text-[10px] opacity-40">↗</span>
          </a>
        ))}
      </div>

      {/* Sign out */}
      <div className="px-4 py-3 border-t border-white/10">
        <button onClick={() => signOut({ callbackUrl: '/' })}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-white/35 hover:text-white/70 text-[13px] transition-colors font-['Inter']">
          <span>⇥</span> Sign Out
        </button>
      </div>
    </aside>
  )
}
