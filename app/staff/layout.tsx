import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LogOut } from 'lucide-react'

export default async function StaffLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  const role    = (session?.user as any)?.role
  if (!session || !['STAFF', 'ADMIN'].includes(role)) redirect('/auth/login')

  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      <header className="bg-[#022269] px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div>
          <p className="text-white text-xs font-bold tracking-widest uppercase font-['Raleway']">Loida British</p>
          <p className="text-[#c71430] text-[9px] tracking-widest uppercase mt-0.5">Staff Portal</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-white/50 text-xs hidden sm:block">{session.user?.name ?? session.user?.email}</span>
          <Link href="/auth/login"
            className="flex items-center gap-1.5 text-white/50 hover:text-white text-xs transition-colors">
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </Link>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>
    </div>
  )
}
