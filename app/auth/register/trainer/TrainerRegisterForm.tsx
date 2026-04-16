'use client'

import { useState } from 'react'
import Link from 'next/link'

const LANGUAGES = [
  'Arabic', 'English', 'French', 'Spanish', 'German',
  'Turkish', 'Urdu', 'Hindi', 'Malay', 'Mandarin',
]

interface Institution { id: string; institutionName: string; nationality: string }

export default function TrainerRegisterForm({ institutions }: { institutions: Institution[] }) {
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    phone: '', nationality: '', residence: '', institutionId: '',
  })
  const [languages, setLanguages]   = useState<string[]>([])
  const [cvFile, setCvFile]         = useState<File | null>(null)
  const [errors, setErrors]         = useState<Record<string, string>>({})
  const [loading, setLoading]       = useState(false)
  const [done, setDone]             = useState(false)

  function set(key: string, value: string) { setForm(f => ({ ...f, [key]: value })) }
  function toggleLang(lang: string) {
    setLanguages(prev => prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang])
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs: Record<string, string> = {}

    if (!form.name.trim())        errs.name        = 'Required'
    if (!form.email.trim())       errs.email       = 'Required'
    if (form.password.length < 8) errs.password    = 'Minimum 8 characters'
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match'
    if (!form.phone.trim())       errs.phone       = 'Required'
    if (!form.nationality.trim()) errs.nationality = 'Required'
    if (!form.residence.trim())   errs.residence   = 'Required'
    if (languages.length === 0)   errs.languages   = 'Select at least one language'

    if (Object.keys(errs).length) return setErrors(errs)
    setErrors({})
    setLoading(true)

    const body = new FormData()
    Object.entries(form).forEach(([k, v]) => body.append(k, v))
    body.append('languages', JSON.stringify(languages))
    if (cvFile) body.append('cv', cvFile)

    const res = await fetch('/api/auth/register/trainer', { method: 'POST', body })
    setLoading(false)

    if (res.ok) {
      setDone(true)
    } else {
      const data = await res.json()
      setErrors({ form: data.error || 'Something went wrong.' })
    }
  }

  if (done) {
    return (
      <div className="bg-white border border-[#E8E4DC] p-10 text-center space-y-4">
        <div className="w-14 h-14 bg-amber-50 flex items-center justify-center mx-auto text-3xl">⏳</div>
        <h2 className="font-semibold text-[#1C2B39] text-lg">Application Submitted</h2>
        <p className="text-sm text-[#6B8F9E] max-w-sm mx-auto">
          Your application is under review. We'll contact you at <strong>{form.email}</strong> once a decision is made.
        </p>
        <Link href="/auth/login" className="inline-block mt-2 text-sm text-[#1C2B39] font-medium hover:underline">
          Back to Login
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-[#E8E4DC] p-6 space-y-5">
      {errors.form && <div className="bg-red-50 border border-red-100 text-red-600 text-sm p-3">{errors.form}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Full Name" error={errors.name}>
          <input type="text" value={form.name} onChange={e => set('name', e.target.value)}
            className={input} placeholder="John Smith" />
        </Field>
        <Field label="Email" error={errors.email}>
          <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
            className={input} placeholder="you@example.com" />
        </Field>
        <Field label="Password" error={errors.password}>
          <input type="password" value={form.password} onChange={e => set('password', e.target.value)}
            className={input} placeholder="Min. 8 characters" />
        </Field>
        <Field label="Confirm Password" error={errors.confirmPassword}>
          <input type="password" value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)}
            className={input} />
        </Field>
        <Field label="Phone" error={errors.phone}>
          <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)}
            className={input} placeholder="+974..." />
        </Field>
        <Field label="Nationality" error={errors.nationality}>
          <input type="text" value={form.nationality} onChange={e => set('nationality', e.target.value)}
            className={input} placeholder="e.g. British" />
        </Field>
        <Field label="Country of Residence" error={errors.residence}>
          <input type="text" value={form.residence} onChange={e => set('residence', e.target.value)}
            className={input} placeholder="e.g. Qatar" />
        </Field>
        <Field label="Institution (optional)">
          <select value={form.institutionId} onChange={e => set('institutionId', e.target.value)} className={input}>
            <option value="">— Independent —</option>
            {institutions.map(i => (
              <option key={i.id} value={i.id}>{i.institutionName} ({i.nationality})</option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="CV / Resume" hint="PDF or Word document">
        <input type="file" accept=".pdf,.doc,.docx"
          onChange={e => setCvFile(e.target.files?.[0] ?? null)}
          className="w-full border border-[#E8E4DC] px-3 py-2 text-sm text-[#6B8F9E] file:mr-3 file:border-0 file:bg-[#1C2B39] file:text-white file:px-3 file:py-1 file:text-xs cursor-pointer" />
      </Field>

      <Field label="Languages I Speak" error={errors.languages}>
        <div className="flex flex-wrap gap-2 mt-1">
          {LANGUAGES.map(lang => {
            const selected = languages.includes(lang)
            return (
              <button key={lang} type="button" onClick={() => toggleLang(lang)}
                className={`px-3 py-1 text-xs border transition-colors ${
                  selected
                    ? 'bg-[#1C2B39] text-white border-[#1C2B39]'
                    : 'bg-white text-[#6B8F9E] border-[#E8E4DC] hover:border-[#1C2B39] hover:text-[#1C2B39]'
                }`}>
                {lang}
              </button>
            )
          })}
        </div>
      </Field>

      <button type="submit" disabled={loading}
        className="w-full bg-[#1C2B39] text-white py-3 text-sm font-medium hover:bg-[#2a3f52] transition-colors disabled:opacity-50">
        {loading ? 'Submitting…' : 'Submit Application'}
      </button>

      <p className="text-center text-xs text-[#6B8F9E]">
        Already have an account?{' '}
        <Link href="/auth/login" className="text-[#1C2B39] font-medium hover:underline">Sign in</Link>
      </p>
    </form>
  )
}

const input = 'w-full border border-[#E8E4DC] px-3 py-2 text-sm focus:outline-none focus:border-[#1C2B39]'

function Field({ label, error, hint, children }: {
  label: string; error?: string; hint?: string; children: React.ReactNode
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-[#1C2B39]">
        {label} {hint && <span className="text-[#6B8F9E] font-normal text-xs">({hint})</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
