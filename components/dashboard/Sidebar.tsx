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
          'flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] transition-all duration-150',
          active ? 'bg-[#B8973A] text-white font-medium' : 'text-white/50 hover:text-white hover:bg-white/6'
        )}>
        <span className="text-base leading-none">{item.icon}</span>
        {item.label}
      </Link>
    )
  }

  return (
    <aside className="hidden md:flex w-60 flex-col bg-[#0A1628] text-white min-h-screen sticky top-0 h-screen">
      <div className="p-6 border-b border-white/8">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 relative flex-shrink-0">
            <Image src="https://static.wixstatic.com/media/706dde_227e86ca03734151ba9b38890bb65bd0~mv2.png/v1/fill/w_305,h_299,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/logo%209989-13.png"
              alt="Loida British" fill className="object-contain brightness-0 invert" />
          </div>
          <div>
            <p className="text-[11px] font-semibold tracking-[0.15em] text-white">LOIDA BRITISH</p>
            <p className="text-[8px] tracking-[0.2em] text-[#B8973A] uppercase">Hub</p>
          </div>
        </Link>
      </div>

      <div className="p-4 border-b border-white/8">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-white/4">
          <div className="w-8 h-8 rounded-full bg-[#B8973A]/20 flex items-center justify-center text-[#B8973A] text-xs font-semibold flex-shrink-0">
            {getInitials(user.name)}
          </div>
          <div className="min-w-0">
            <p className="text-white text-xs font-medium truncate">{user.name ?? 'Member'}</p>
            <p className="text-white/35 text-[10px] truncate">{role}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {userItems.map(renderItem)}
        {coachItems.length > 0 && (
          <>
            <div className="px-3 pt-4 pb-1"><p className="text-white/20 text-[9px] tracking-[0.2em] uppercase">Coach</p></div>
            {coachItems.map(renderItem)}
          </>
        )}
        {adminItems.length > 0 && (
          <>
            <div className="px-3 pt-4 pb-1"><p className="text-white/20 text-[9px] tracking-[0.2em] uppercase">Admin</p></div>
            {adminItems.map(renderItem)}
          </>
        )}
      </nav>

      <div className="p-4 border-t border-white/8">
        <p className="text-white/20 text-[9px] tracking-[0.2em] uppercase mb-2 px-2">Platforms</p>
        {[
          { name: 'Harmony',        color: '#6B8F9E', href: 'https://harmony.loidabritish.com' },
          { name: 'Career',         color: '#B8973A', href: 'https://career.loidabritish.com' },
          { name: 'Business Clock', color: '#2C4A3E', href: 'https://businessclock.loidabritish.com' },
        ].map(p => (
          <a key={p.name} href={p.href} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-white/40 hover:text-white/70 text-xs transition-colors">
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: p.color }} />
            {p.name}
            <span className="ml-auto text-[10px] opacity-50">↗</span>
          </a>
        ))}
      </div>

      <div className="p-4 border-t border-white/8">
        <button onClick={() => signOut({ callbackUrl: '/' })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/35 hover:text-white/60 text-[13px] transition-colors">
          <span>⇥</span> Sign Out
        </button>
      </div>
    </aside>
  )
}
