import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const adminNav = [
  { label: 'Overview',    href: '/admin' },
  { label: 'Users',       href: '/admin/users' },
  { label: 'Coaches',     href: '/admin/coaches' },
  { label: 'Programs',    href: '/admin/programs' },
  { label: 'Assessments', href: '/admin/assessments' },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user) redirect('/auth/login')
  if ((session.user as any).role !== 'ADMIN') redirect('/dashboard')

  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      {/* Admin topbar */}
      <header className="bg-[#022269] text-white px-6 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <div>
            <p className="text-xs font-semibold tracking-widest text-white/80">LOIDA BRITISH</p>
            <p className="text-[9px] text-[#c71430] tracking-widest uppercase">Admin Panel</p>
          </div>
          <nav className="hidden md:flex items-center gap-1">
            {adminNav.map(item => (
              <Link key={item.href} href={item.href}
                className="px-3 py-1.5 text-[12px] text-white/60 hover:text-white hover:bg-white/8 rounded-none transition-all">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-xs text-white/40 hover:text-white/70 transition-colors">
            ← User Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  )
}
