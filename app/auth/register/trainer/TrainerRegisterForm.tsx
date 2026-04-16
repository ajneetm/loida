'use client'

import { useState } from 'react'
import Link from 'next/link'
import { COUNTRIES } from '@/lib/countries'

type Curriculum = { id: string; name: string; domain: string }

const LANGUAGES = [
  'Arabic','English','French','Spanish','German',
  'Turkish','Urdu','Hindi','Malay','Mandarin','Italian','Portuguese','Russian',
]

const DOMAIN_STYLE: Record<string, string> = {
  HARMONY:  'border-purple-300 bg-purple-50 text-purple-800',
  CAREER:   'border-blue-300 bg-blue-50 text-blue-800',
  BUSINESS: 'border-amber-300 bg-amber-50 text-amber-800',
}

export default function TrainerRegisterForm({ curricula }: { curricula: Curriculum[] }) {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    phone: '', nationality: '', residence: '',
  })
  const [selectedCurricula, setSelectedCurricula] = useState<string[]>([])
  const [languages, setLanguages] = useState<string[]>([])
  const [cvFile, setCvFile]       = useState<File | null>(null)
  const [errors, setErrors]       = useState<Record<string, string>>({})
  const [loading, setLoading]     = useState(false)
  const [done, setDone]           = useState(false)

  function set(k: string, v: string) { setForm(f => ({ ...f, [k]: v })) }
  function toggleLang(l: string) {
    setLanguages(p => p.includes(l) ? p.filter(x => x !== l) : [...p, l])
  }
  function toggleCurriculum(id: string) {
    setSelectedCurricula(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])
  }

  function validateStep1() {
    const e: Record<string, string> = {}
    if (!form.name.trim())              e.name            = 'Required'
    if (!form.email.trim())             e.email           = 'Required'
    if (form.password.length < 8)       e.password        = 'Minimum 8 characters'
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match'
    return e
  }

  function validateStep2() {
    const e: Record<string, string> = {}
    if (!form.phone.trim())             e.phone       = 'Required'
    if (!form.nationality.trim())       e.nationality = 'Required'
    if (!form.residence.trim())         e.residence   = 'Required'
    if (selectedCurricula.length === 0) e.curricula   = 'Select at least one curriculum'
    return e
  }

  function validateStep3() {
    const e: Record<string, string> = {}
    if (languages.length === 0) e.languages = 'Select at least one language'
    return e
  }

  function next() {
    const errs = step === 1 ? validateStep1() : validateStep2()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setStep(s => s + 1)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validateStep3()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setLoading(true)

    const body = new FormData()
    Object.entries(form).forEach(([k, v]) => body.append(k, v))
    body.append('languages',         JSON.stringify(languages))
    body.append('selectedCurricula', JSON.stringify(selectedCurricula))
    if (cvFile) body.append('cvName', cvFile.name)

    const res = await fetch('/api/auth/register/trainer', { method: 'POST', body })
    setLoading(false)
    if (res.ok) setDone(true)
    else {
      const data = await res.json()
      setErrors({ form: data.error || 'Something went wrong.' })
    }
  }

  if (done) return (
    <div className="bg-white border border-[#E8E4DC] p-10 text-center space-y-4">
      <div className="w-14 h-14 bg-amber-50 flex items-center justify-center mx-auto text-3xl">⏳</div>
      <h2 className="font-semibold text-[#1C2B39] text-lg">Application Submitted</h2>
      <p className="text-sm text-[#6B8F9E]">
        Your application is under review. We'll contact you at <strong>{form.email}</strong>.
      </p>
      <Link href="/auth/login" className="inline-block text-sm text-[#1C2B39] font-medium hover:underline">
        Back to Login
      </Link>
    </div>
  )

  return (
    <div className="bg-white border border-[#E8E4DC]">
      {/* Progress */}
      <div className="flex border-b border-[#E8E4DC]">
        {['Account', 'Details', 'Languages & CV'].map((label, i) => (
          <div key={i} className={`flex-1 py-3 text-center text-xs font-medium border-b-2 transition-colors ${
            step === i + 1
              ? 'border-[#1C2B39] text-[#1C2B39]'
              : step > i + 1
              ? 'border-green-500 text-green-600'
              : 'border-transparent text-[#6B8F9E]'
          }`}>
            {step > i + 1 ? '✓ ' : ''}{label}
          </div>
        ))}
      </div>

      <div className="p-6">
        {errors.form && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-sm p-3 mb-4">{errors.form}</div>
        )}

        {/* Step 1 — Account */}
        {step === 1 && (
          <div className="space-y-4">
            <Field label="Full Name" error={errors.name}>
              <input type="text" value={form.name} onChange={e => set('name', e.target.value)}
                className={inp} placeholder="John Smith" autoFocus />
            </Field>
            <Field label="Email" error={errors.email}>
              <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                className={inp} placeholder="you@example.com" />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Password" error={errors.password}>
                <input type="password" value={form.password} onChange={e => set('password', e.target.value)}
                  className={inp} placeholder="Min. 8 characters" />
              </Field>
              <Field label="Confirm Password" error={errors.confirmPassword}>
                <input type="password" value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)}
                  className={inp} placeholder="Repeat password" />
              </Field>
            </div>
            <button type="button" onClick={next}
              className="w-full bg-[#1C2B39] text-white py-3 text-sm font-medium hover:bg-[#2a3f52] transition-colors">
              Continue →
            </button>
          </div>
        )}

        {/* Step 2 — Details + Curricula */}
        {step === 2 && (
          <div className="space-y-4">
            <Field label="Phone" error={errors.phone}>
              <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)}
                className={inp} placeholder="+974 5000 0000" autoFocus />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Nationality" error={errors.nationality}>
                <select value={form.nationality} onChange={e => set('nationality', e.target.value)} className={inp}>
                  <option value="">Select country</option>
                  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Country of Residence" error={errors.residence}>
                <select value={form.residence} onChange={e => set('residence', e.target.value)} className={inp}>
                  <option value="">Select country</option>
                  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
            </div>

            <Field label="Curricula I Want to Teach" error={errors.curricula}>
              {curricula.length === 0 ? (
                <p className="text-sm text-[#6B8F9E]">No curricula available yet.</p>
              ) : (
                <div className="grid grid-cols-1 gap-2 mt-1">
                  {curricula.map(c => {
                    const sel = selectedCurricula.includes(c.id)
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => toggleCurriculum(c.id)}
                        className={`flex items-center gap-3 px-4 py-3 border text-left transition-colors ${
                          sel
                            ? 'border-[#1C2B39] bg-[#1C2B39]/5'
                            : 'border-[#E8E4DC] hover:border-[#1C2B39]'
                        }`}
                      >
                        <div className={`w-4 h-4 border-2 flex-shrink-0 flex items-center justify-center ${
                          sel ? 'border-[#1C2B39] bg-[#1C2B39]' : 'border-[#E8E4DC]'
                        }`}>
                          {sel && <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="square" strokeLinejoin="miter" d="M5 13l4 4L19 7" />
                          </svg>}
                        </div>
                        <div className="min-w-0">
                          <span className="text-sm font-medium text-[#1C2B39]">{c.name}</span>
                          <span className={`ml-2 text-[10px] px-1.5 py-0.5 border font-medium ${DOMAIN_STYLE[c.domain] ?? 'border-stone-200 bg-stone-50 text-stone-600'}`}>
                            {c.domain}
                          </span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </Field>

            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(1)}
                className="flex-1 border border-[#E8E4DC] text-[#1C2B39] py-3 text-sm hover:bg-[#F8F7F4] transition-colors">
                ← Back
              </button>
              <button type="button" onClick={next}
                className="flex-1 bg-[#1C2B39] text-white py-3 text-sm font-medium hover:bg-[#2a3f52] transition-colors">
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* Step 3 — Languages & CV */}
        {step === 3 && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Languages I Speak" error={errors.languages}>
              <div className="flex flex-wrap gap-2 mt-1">
                {LANGUAGES.map(lang => {
                  const sel = languages.includes(lang)
                  return (
                    <button key={lang} type="button" onClick={() => toggleLang(lang)}
                      className={`px-3 py-1.5 text-xs border transition-colors ${
                        sel ? 'bg-[#1C2B39] text-white border-[#1C2B39]'
                            : 'bg-white text-[#6B8F9E] border-[#E8E4DC] hover:border-[#1C2B39] hover:text-[#1C2B39]'
                      }`}>
                      {lang}
                    </button>
                  )
                })}
              </div>
            </Field>
            <Field label="CV / Resume" hint="optional — PDF or Word">
              <input type="file" accept=".pdf,.doc,.docx"
                onChange={e => setCvFile(e.target.files?.[0] ?? null)}
                className="w-full border border-[#E8E4DC] px-3 py-2 text-sm text-[#6B8F9E] file:mr-3 file:border-0 file:bg-[#1C2B39] file:text-white file:px-3 file:py-1 file:text-xs cursor-pointer" />
              {cvFile && <p className="text-xs text-green-600 mt-1">✓ {cvFile.name}</p>}
            </Field>
            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(2)}
                className="flex-1 border border-[#E8E4DC] text-[#1C2B39] py-3 text-sm hover:bg-[#F8F7F4] transition-colors">
                ← Back
              </button>
              <button type="submit" disabled={loading}
                className="flex-1 bg-[#1C2B39] text-white py-3 text-sm font-medium hover:bg-[#2a3f52] transition-colors disabled:opacity-50">
                {loading ? 'Submitting…' : 'Submit Application'}
              </button>
            </div>
          </form>
        )}
      </div>

      <p className="text-center text-xs text-[#6B8F9E] pb-4">
        Already have an account?{' '}
        <Link href="/auth/login" className="text-[#1C2B39] font-medium hover:underline">Sign in</Link>
      </p>
    </div>
  )
}

const inp = 'w-full border border-[#E8E4DC] px-3 py-2 text-sm focus:outline-none focus:border-[#1C2B39] bg-white'

function Field({ label, error, hint, children }: {
  label: string; error?: string; hint?: string; children: React.ReactNode
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-[#1C2B39]">
        {label}{hint && <span className="text-[#6B8F9E] font-normal text-xs ml-1">({hint})</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
