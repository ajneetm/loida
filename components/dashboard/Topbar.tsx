'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const breadcrumbs: Record<string, string> = {
  '/dashboard':             'Overview',
  '/dashboard/assessments': 'Assessments',
  '/dashboard/programs':    'Programs',
  '/dashboard/sessions':    'My Sessions',
  '/dashboard/coaches':     'Find a Coach',
  '/dashboard/articles':    'Articles',
  '/dashboard/membership':  'Membership',
  '/dashboard/profile':     'Profile',
}

interface Props {
  user: { name?: string | null }
}

export default function DashboardTopbar({ user }: Props) {
  const pathname = usePathname()
  const title = breadcrumbs[pathname] ?? 'Dashboard'

  return (
    <header className="bg-white border-b border-stone-200 px-6 md:px-8 py-4 flex items-center justify-between sticky top-0 z-20">
      <div>
        <h1 className="font-display text-xl text-[#0A1628] font-medium">{title}</h1>
        <p className="text-stone-400 text-xs mt-0.5">
          Welcome back, {user.name?.split(' ')[0] ?? 'Member'}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/assessments"
          className="hidden sm:inline-flex bg-[#0A1628] hover:bg-[#1A2B4A] text-white text-xs font-medium px-4 py-2 rounded-full transition-colors"
        >
          + New Assessment
        </Link>
      </div>
    </header>
  )
}
