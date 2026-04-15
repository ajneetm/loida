import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import DashboardSidebar from '@/components/dashboard/Sidebar'
import DashboardTopbar from '@/components/dashboard/Topbar'

export default async function TrainerLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user) redirect('/auth/login')
  const role = (session.user as any).role
  if (role !== 'TRAINER' && role !== 'ADMIN') redirect('/dashboard')

  return (
    <div className="min-h-screen bg-[#F8F7F4] flex">
      <DashboardSidebar user={session.user} />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardTopbar user={session.user} />
        <main className="flex-1 p-6 md:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
