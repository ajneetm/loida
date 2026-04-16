import type { Metadata } from 'next'
import './globals.css'
import { auth } from '@/lib/auth'
import { SessionProvider } from 'next-auth/react'

export const metadata: Metadata = {
  title: { default: 'Loida British | United Kingdom', template: '%s | Loida British' },
  description: 'The central hub for lifelong learning, coaching, and career transformation.',
  keywords: ['coaching', 'career', 'business', 'self-development', 'training'],
  openGraph: {
    title: 'Loida British | United Kingdom',
    description: 'We Pave The Path To Excellence.',
    url: 'https://loidabritish.com',
    siteName: 'Loida British',
    locale: 'en_GB',
    type: 'website',
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
