'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm]       = useState({ email: '', password: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await signIn('credentials', {
      email:    form.email,
      password: form.password,
      redirect: false,
    })

    setLoading(false)

    if (res?.error) {
      setError('Invalid email or password.')
      return
    }

    const sessionRes  = await fetch('/api/auth/session')
    const sessionData = await sessionRes.json()
    const role        = sessionData?.user?.role
    const approval    = sessionData?.user?.approvalStatus

    if (role === 'ADMIN')                          { router.push('/admin');       return }
    if (role === 'AGENT' || role === 'INSTITUTION') { router.push('/institution'); return }
    if (role === 'TRAINER') {
      if (approval === 'PENDING')  { router.push('/auth/pending');  return }
      if (approval === 'REJECTED') { router.push('/auth/rejected'); return }
      router.push('/trainer')
      return
    }

    router.push('/dashboard')
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl text-white font-light mb-2">Welcome back</h1>
        <p className="text-white/40 text-sm">Sign in to continue</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-none px-4 py-3 text-red-400 text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-white/50 text-xs tracking-wide mb-1.5">Email</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            placeholder="you@example.com"
            className="w-full bg-white/5 border border-white/10 rounded-none px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#c71430]/50 transition-colors"
          />
        </div>

        <div>
          <label className="block text-white/50 text-xs tracking-wide mb-1.5">Password</label>
          <input
            type="password"
            required
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            placeholder="••••••••"
            className="w-full bg-white/5 border border-white/10 rounded-none px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#c71430]/50 transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#c71430] hover:bg-[#e8203c] disabled:opacity-50 text-white py-3 rounded-none text-sm font-medium tracking-wide transition-colors mt-2"
        >
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>

      <p className="text-center text-white/30 text-xs mt-8">
        New to Loida British?{' '}
        <Link href="/auth/register" className="text-white/60 hover:text-white underline transition-colors">
          Register as Trainer or Institution
        </Link>
      </p>
    </div>
  )
}
