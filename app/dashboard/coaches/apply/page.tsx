'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getDomainColor, getDomainLabel } from '@/lib/utils'

const domains   = ['HARMONY', 'CAREER', 'BUSINESS']
const specialtyOptions = [
  'Life Coaching', 'Career Counselling', 'Business Strategy', 'Leadership',
  'Emotional Intelligence', 'CV & Interview', 'Startup Mentoring', 'Public Speaking',
  'Work-Life Balance', 'Financial Literacy', 'Personal Branding', 'Team Management',
]

export default function CoachApplyPage() {
  const router = useRouter()
  const [step, setStep]         = useState<1 | 2 | 3>(1)
  const [saving, setSaving]     = useState(false)
  const [error, setError]       = useState('')
  const [form, setForm] = useState({
    bio:         '',
    domains:     [] as string[],
    specialties: [] as string[],
    hourlyRate:  '',
    linkedinUrl: '',
    cvUrl:       '',
    motivation:  '',
  })

  const set = (k: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm(p => ({ ...p, [k]: e.target.value }))

  const toggleArr = (key: 'domains' | 'specialties', val: string) =>
    setForm(p => ({
      ...p,
      [key]: p[key].includes(val) ? p[key].filter(v => v !== val) : [...p[key], val],
    }))

  const handleSubmit = async () => {
    setSaving(true); setError('')
    try {
      const res = await fetch('/api/coaches/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const d = await res.json()
        setError(d.message ?? 'Something went wrong.')
        setSaving(false); return
      }
      router.push('/dashboard/coaches/apply/success')
    } catch {
      setError('Something went wrong.')
      setSaving(false)
    }
  }

  const inputCls = 'w-full border border-stone-200 rounded-none px-4 py-2.5 text-sm text-[#022269] focus:outline-none focus:border-[#c71430]/60 transition-colors placeholder:text-stone-300'

  const steps = ['About You', 'Domains & Skills', 'Finalise']

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-[#022269] rounded-none p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_50%,#011344,transparent)]" />
        <div className="relative z-10">
          <p className="text-[#c71430] text-xs tracking-[0.2em] uppercase mb-2">Become a Coach</p>
          <h2 className="font-display text-3xl text-white font-light mb-2">
            Share Your Expertise
          </h2>
          <p className="text-white/40 text-sm max-w-md">
            Join our certified coach network and help transform lives across the Loida British ecosystem.
          </p>
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-0 bg-white border border-stone-100 rounded-none p-2">
        {steps.map((s, i) => {
          const n = (i + 1) as 1 | 2 | 3
          const active = step === n
          const done   = step > n
          return (
            <div key={s} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-none text-xs font-medium transition-all ${active ? 'bg-[#022269] text-white' : done ? 'text-[#c71430]' : 'text-stone-400'}`}>
              <span className={`w-5 h-5 rounded-none flex items-center justify-center text-[10px] border ${active ? 'border-white/30 bg-white/10' : done ? 'border-[#c71430]/30 bg-[#c71430]/10' : 'border-stone-200'}`}>
                {done ? '✓' : n}
              </span>
              <span className="hidden sm:inline">{s}</span>
            </div>
          )
        })}
      </div>

      {/* Form card */}
      <div className="bg-white rounded-none border border-stone-100 p-8 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-500 text-sm px-4 py-3 rounded-none">{error}</div>
        )}

        {/* ── Step 1: About ── */}
        {step === 1 && (
          <>
            <div>
              <label className="block text-stone-400 text-xs tracking-wide mb-1.5">Professional Bio *</label>
              <textarea
                value={form.bio}
                onChange={set('bio')}
                rows={4}
                required
                placeholder="Describe your background, experience, and what makes you a great coach…"
                className={inputCls + ' resize-none'}
              />
              <p className="text-stone-300 text-xs mt-1">{form.bio.length}/500</p>
            </div>
            <div>
              <label className="block text-stone-400 text-xs tracking-wide mb-1.5">Why do you want to coach with Loida British? *</label>
              <textarea
                value={form.motivation}
                onChange={set('motivation')}
                rows={3}
                required
                placeholder="Tell us what motivates you to join our platform…"
                className={inputCls + ' resize-none'}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-stone-400 text-xs tracking-wide mb-1.5">LinkedIn URL</label>
                <input type="url" value={form.linkedinUrl} onChange={set('linkedinUrl')} placeholder="https://linkedin.com/in/..." className={inputCls} />
              </div>
              <div>
                <label className="block text-stone-400 text-xs tracking-wide mb-1.5">CV / Portfolio URL</label>
                <input type="url" value={form.cvUrl} onChange={set('cvUrl')} placeholder="https://..." className={inputCls} />
              </div>
            </div>
          </>
        )}

        {/* ── Step 2: Domains & Skills ── */}
        {step === 2 && (
          <>
            <div>
              <label className="block text-stone-400 text-xs tracking-wide mb-3">Which domains do you coach in? *</label>
              <div className="space-y-2">
                {domains.map(d => {
                  const sel = form.domains.includes(d)
                  const color = getDomainColor(d)
                  return (
                    <button key={d} type="button" onClick={() => toggleArr('domains', d)}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-none border text-left transition-all"
                      style={sel ? { borderColor: color, background: `${color}08`, color } : { borderColor: '#e7e5e4', color: '#78716c' }}>
                      <div className="w-3 h-3 rounded-none flex-shrink-0" style={{ background: color }} />
                      <span className="text-sm font-medium">{getDomainLabel(d)}</span>
                      {sel && <span className="ml-auto text-xs">✓</span>}
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <label className="block text-stone-400 text-xs tracking-wide mb-3">Your specialties</label>
              <div className="flex flex-wrap gap-2">
                {specialtyOptions.map(s => {
                  const sel = form.specialties.includes(s)
                  return (
                    <button key={s} type="button" onClick={() => toggleArr('specialties', s)}
                      className={`px-3 py-1.5 rounded-none text-xs border transition-all ${sel ? 'bg-[#022269] text-white border-[#022269]' : 'border-stone-200 text-stone-500 hover:border-stone-400'}`}>
                      {s}
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <label className="block text-stone-400 text-xs tracking-wide mb-1.5">Hourly rate (GBP)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 text-sm">£</span>
                <input type="number" min="0" value={form.hourlyRate} onChange={set('hourlyRate')} placeholder="75" className={inputCls + ' pl-8'} />
              </div>
              <p className="text-stone-300 text-xs mt-1">Leave blank if you offer free sessions</p>
            </div>
          </>
        )}

        {/* ── Step 3: Review ── */}
        {step === 3 && (
          <div className="space-y-5">
            <h3 className="font-display text-xl text-[#022269]">Review your application</h3>

            {[
              { label: 'Bio',        value: form.bio || '—' },
              { label: 'Motivation', value: form.motivation || '—' },
              { label: 'Domains',    value: form.domains.map(d => getDomainLabel(d)).join(', ') || '—' },
              { label: 'Specialties',value: form.specialties.join(', ') || '—' },
              { label: 'Hourly Rate',value: form.hourlyRate ? `£${form.hourlyRate}/hr` : 'Not specified' },
              { label: 'LinkedIn',   value: form.linkedinUrl || '—' },
            ].map(row => (
              <div key={row.label} className="flex flex-col gap-1 py-3 border-b border-stone-50">
                <p className="text-stone-400 text-xs tracking-wide">{row.label}</p>
                <p className="text-[#022269] text-sm leading-relaxed">{row.value}</p>
              </div>
            ))}

            <div className="bg-amber-50 border border-amber-100 rounded-none p-4 text-sm text-amber-700">
              <p className="font-medium mb-1">📋 What happens next?</p>
              <p className="text-amber-600 text-xs leading-relaxed">
                Our team will review your application within 3–5 business days. If approved, you will receive an email with next steps including an onboarding call.
              </p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-stone-50">
          {step > 1 ? (
            <button onClick={() => setStep(s => (s - 1) as any)} className="text-stone-400 hover:text-stone-600 text-sm transition-colors">
              ← Back
            </button>
          ) : <div />}

          {step < 3 ? (
            <button
              onClick={() => {
                if (step === 1 && (!form.bio || !form.motivation)) { setError('Please fill in all required fields.'); return }
                if (step === 2 && form.domains.length === 0) { setError('Select at least one domain.'); return }
                setError(''); setStep(s => (s + 1) as any)
              }}
              className="bg-[#022269] hover:bg-[#011344] text-white text-sm font-medium px-6 py-2.5 rounded-none transition-colors"
            >
              Continue →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="bg-[#c71430] hover:bg-[#e8203c] disabled:opacity-50 text-white text-sm font-medium px-6 py-2.5 rounded-none transition-colors"
            >
              {saving ? 'Submitting…' : 'Submit Application'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
