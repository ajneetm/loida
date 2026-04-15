import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn   = !!req.auth
  const role         = (req.auth?.user as any)?.role as string | undefined

  // Redirect unauthenticated users
  const protectedPaths = ['/dashboard', '/agent', '/trainer']
  if (protectedPaths.some(p => pathname.startsWith(p)) && !isLoggedIn) {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  // Role-based guards
  if (pathname.startsWith('/agent') && role !== 'AGENT' && role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  if (pathname.startsWith('/trainer') && role !== 'TRAINER' && role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // Block PENDING trainers from accessing /trainer
  if (pathname.startsWith('/trainer') && role === 'TRAINER') {
    const approvalStatus = (req.auth?.user as any)?.approvalStatus
    if (approvalStatus === 'PENDING') {
      return NextResponse.redirect(new URL('/auth/pending', req.url))
    }
    if (approvalStatus === 'REJECTED') {
      return NextResponse.redirect(new URL('/auth/rejected', req.url))
    }
  }

  if (pathname.startsWith('/admin') && role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // Redirect logged-in users away from auth pages
  if ((pathname.startsWith('/auth/login') || pathname.startsWith('/auth/signup')) && isLoggedIn) {
    if (role === 'AGENT')   return NextResponse.redirect(new URL('/agent', req.url))
    if (role === 'TRAINER') return NextResponse.redirect(new URL('/trainer', req.url))
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/dashboard/:path*', '/agent/:path*', '/trainer/:path*', '/admin/:path*', '/auth/login', '/auth/signup'],
}
