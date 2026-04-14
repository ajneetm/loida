'use client'
import { useState } from 'react'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

const domains = [
  { id: 'HARMONY', label: 'Harmony', desc: 'Self-awareness & personal growth', color: '#6B8F9E' },
  { id: 'CAREER',  label: 'Career',  desc: 'Career path & professional dev', color: '#B8973A' },
  { id: 'BUSINESS',label: 'Business',desc: 'Entrepreneurship & strategy',      color: '#2C4A3E' },
]

export default function SignupPage() {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2>(1)
  const [selected, setSelected] = useState<string[]>([])
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const toggleDomain = (id: string) =>
    setSelected(prev => prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, interests: selected }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.message ?? 'Something went wrong.'); setLoading(false); return }
      await signIn('credentials', { email: form.email, password: form.password, redirect: false })
      router.push('/dashboard')
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl text-white font-light mb-2">Begin your journey</h1>
        <p className="text-white/40 text-sm">Create your Loida British account</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2].map(s => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
              s === step ? 'bg-[#B8973A] text-white' : s < step ? 'bg-[#B8973A]/30 text-[#B8973A]' : 'bg-white/8 text-white/30'
            }`}>
              {s}
            </div>
            {s < 2 && <div className={`w-12 h-px ${step > 1 ? 'bg-[#B8973A]/50' : 'bg-white/10'}`} />}
          </div>
        ))}
        <span className="text-white/30 text-xs ml-2">{step === 1 ? 'Your interests' : 'Account details'}</span>
      </div>

      {step === 1 ? (
        <div>
          <p className="text-white/60 text-sm mb-5">Which platform interests you most? Select all that apply.</p>
          <div className="space-y-3 mb-8">
            {domains.map(d => (
              <button
                key={d.id}
                onClick={() => toggleDomain(d.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${
                  selected.includes(d.id)
                    ? 'border-[#B8973A]/60 bg-[#B8973A]/8'
                    : 'border-white/8 bg-white/3 hover:border-white/20'
                }`}
              >
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: d.color }} />
                <div>
                  <p className="text-white text-sm font-medium">{d.label}</p>
                  <p className="text-white/40 text-xs">{d.desc}</p>
                </div>
                {selected.includes(d.id) && (
                  <span className="ml-auto text-[#B8973A] text-xs">✓</span>
                )}
              </button>
            ))}
          </div>
          <button
            onClick={() => setStep(2)}
            className="w-full bg-[#B8973A] hover:bg-[#D4B05A] text-white py-3 rounded-xl text-sm font-medium tracking-wide transition-colors"
          >
            Continue →
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">
              {error}
            </div>
          )}
          <div>
            <label className="block text-white/50 text-xs tracking-wide mb-1.5">Full Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="Your full name"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#B8973A]/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-white/50 text-xs tracking-wide mb-1.5">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#B8973A]/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-white/50 text-xs tracking-wide mb-1.5">Password</label>
            <input
              type="password"
              required
              minLength={8}
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="Min 8 characters"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#B8973A]/50 transition-colors"
            />
          </div>

          <p className="text-white/25 text-xs leading-relaxed">
            By creating an account you agree to our{' '}
            <Link href="/policies/terms" className="text-white/40 underline">Terms</Link> and{' '}
            <Link href="/policies/privacy" className="text-white/40 underline">Privacy Policy</Link>.
          </p>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 border border-white/10 text-white/50 hover:text-white py-3 rounded-xl text-sm transition-colors"
            >
              ← Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#B8973A] hover:bg-[#D4B05A] disabled:opacity-50 text-white py-3 rounded-xl text-sm font-medium transition-colors"
            >
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </div>
        </form>
      )}

      <p className="text-center text-white/30 text-sm mt-6">
        Already have an account?{' '}
        <Link href="/auth/login" className="text-[#B8973A] hover:text-[#D4B05A] transition-colors">Sign in</Link>
      </p>
    </div>
  )
}
