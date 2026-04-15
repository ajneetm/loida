'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CheckSquare, Square } from 'lucide-react'

interface Curriculum {
  id: string
  name: string
  domain: string
}

export default function NewTrainerPage() {
  const router = useRouter()
  const [form, setForm]         = useState({ name: '', email: '', phone: '' })
  const [selected, setSelected] = useState<string[]>([])
  const [curricula, setCurricula] = useState<Curriculum[]>([])
  const [errors, setErrors]     = useState<Record<string, string>>({})
  const [loading, setLoading]   = useState(false)
  const [created, setCreated]   = useState<{ email: string; tempPassword: string } | null>(null)

  useEffect(() => {
    fetch('/api/curricula').then(r => r.json()).then(setCurricula)
  }, [])

  function toggleCurriculum(id: string) {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrors({})

    if (!form.name.trim())  return setErrors({ name: 'Name is required' })
    if (!form.email.trim()) return setErrors({ email: 'Email is required' })
    if (selected.length === 0) return setErrors({ curricula: 'Select at least one curriculum' })

    setLoading(true)
    const res = await fetch('/api/trainers', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ ...form, curriculumIds: selected }),
    })
    setLoading(false)

    if (res.ok) {
      const data = await res.json()
      setCreated({ email: data.email, tempPassword: data.tempPassword })
    } else {
      const data = await res.json()
      setErrors({ form: data.error || 'Something went wrong.' })
    }
  }

  if (created) {
    return (
      <div className="max-w-md mx-auto mt-16 bg-white border border-[#E8E4DC] p-8 text-center space-y-4">
        <div className="w-12 h-12 bg-green-100 flex items-center justify-center mx-auto">
          <span className="text-green-600 text-xl">✓</span>
        </div>
        <h2 className="text-xl font-semibold text-[#1C2B39]">Account Created</h2>
        <div className="bg-[#F8F7F4] p-4 text-sm text-left space-y-2">
          <p><span className="text-[#6B8F9E]">Email:</span> {created.email}</p>
          <p><span className="text-[#6B8F9E]">Temp Password:</span> <code className="font-mono font-bold">{created.tempPassword}</code></p>
        </div>
        <p className="text-xs text-[#6B8F9E]">Send these credentials to the trainer.</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => router.push('/agent')}
            className="px-4 py-2 bg-[#1C2B39] text-white text-sm hover:bg-[#2a3f52] transition-colors"
          >
            Back to Dashboard
          </button>
          <button
            onClick={() => { setCreated(null); setForm({ name: '', email: '', phone: '' }); setSelected([]) }}
            className="px-4 py-2 border border-[#E8E4DC] text-[#1C2B39] text-sm hover:bg-[#F8F7F4] transition-colors"
          >
            Add Another
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#1C2B39]">Add New Trainer</h1>
        <p className="text-sm text-[#6B8F9E] mt-1">A Loida account will be created for this trainer</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-[#E8E4DC] p-6 space-y-5">
        {errors.form && (
          <div className="bg-red-50 text-red-600 text-sm p-3">{errors.form}</div>
        )}

        <Field label="Full Name" error={errors.name}>
          <input type="text" value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            className="w-full border border-[#E8E4DC] px-3 py-2 text-sm focus:outline-none focus:border-[#1C2B39]"
            placeholder="John Smith" />
        </Field>

        <Field label="Email Address" error={errors.email}>
          <input type="email" value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            className="w-full border border-[#E8E4DC] px-3 py-2 text-sm focus:outline-none focus:border-[#1C2B39]"
            placeholder="trainer@example.com" />
        </Field>

        <Field label="Phone (optional)">
          <input type="tel" value={form.phone}
            onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
            className="w-full border border-[#E8E4DC] px-3 py-2 text-sm focus:outline-none focus:border-[#1C2B39]"
            placeholder="+974..." />
        </Field>

        {/* Curriculum selection */}
        <Field label="Curriculum" error={errors.curricula}>
          {curricula.length === 0 ? (
            <p className="text-xs text-[#6B8F9E] py-2">Loading curricula…</p>
          ) : (
            <div className="space-y-2 mt-1">
              {curricula.map(c => {
                const isSelected = selected.includes(c.id)
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => toggleCurriculum(c.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 border text-left transition-colors ${
                      isSelected
                        ? 'border-[#1C2B39] bg-[#1C2B39] text-white'
                        : 'border-[#E8E4DC] bg-white text-[#1C2B39] hover:border-[#1C2B39]'
                    }`}
                  >
                    {isSelected
                      ? <CheckSquare className="w-4 h-4 flex-shrink-0" />
                      : <Square className="w-4 h-4 flex-shrink-0 opacity-40" />
                    }
                    <div>
                      <p className="text-sm font-medium">{c.name}</p>
                      <p className={`text-xs mt-0.5 ${isSelected ? 'text-white/60' : 'text-[#6B8F9E]'}`}>{c.domain}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </Field>

        <button type="submit" disabled={loading}
          className="w-full bg-[#1C2B39] text-white py-2.5 text-sm font-medium hover:bg-[#2a3f52] transition-colors disabled:opacity-50">
          {loading ? 'Creating account…' : 'Create Account'}
        </button>
      </form>
    </div>
  )
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-[#1C2B39]">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}
