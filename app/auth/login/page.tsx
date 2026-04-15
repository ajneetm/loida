'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm]     = useState({ email: '', password: '' })
  const [error, setError]   = useState('')
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
      setError('البريد الإلكتروني أو كلمة المرور غير صحيحة.')
      return
    }

    // Fetch session to determine role
    const sessionRes  = await fetch('/api/auth/session')
    const sessionData = await sessionRes.json()
    const role        = sessionData?.user?.role
    const approval    = sessionData?.user?.approvalStatus

    if (role === 'ADMIN')  { router.push('/admin');   return }
    if (role === 'AGENT')  { router.push('/agent');   return }
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
        <h1 className="font-display text-3xl text-white font-light mb-2">مرحباً بعودتك</h1>
        <p className="text-white/40 text-sm">سجّل دخولك للمتابعة</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-none px-4 py-3 text-red-400 text-sm text-right">
            {error}
          </div>
        )}

        <div>
          <label className="block text-white/50 text-xs tracking-wide mb-1.5 text-right">
            البريد الإلكتروني
          </label>
          <input
            type="email"
            required
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            placeholder="you@example.com"
            dir="ltr"
            className="w-full bg-white/5 border border-white/10 rounded-none px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#c71430]/50 transition-colors"
          />
        </div>

        <div>
          <label className="block text-white/50 text-xs tracking-wide mb-1.5 text-right">
            كلمة المرور
          </label>
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
          {loading ? 'جاري تسجيل الدخول…' : 'تسجيل الدخول'}
        </button>
      </form>

      <p className="text-center text-white/20 text-xs mt-8">
        للمساعدة تواصل مع مسؤول النظام
      </p>
    </div>
  )
}
