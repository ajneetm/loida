'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function InstitutionRegisterForm() {
  const [form, setForm] = useState({
    institutionName: '', nationality: '', email: '',
    password: '', confirmPassword: '', website: '',
    foundedYear: '', employeeCount: '', address: '',
    founderName: '',
  })
  const [crFile, setCrFile]   = useState<File | null>(null)
  const [errors, setErrors]   = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [done, setDone]       = useState(false)

  function set(key: string, value: string) { setForm(f => ({ ...f, [key]: value })) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs: Record<string, string> = {}

    if (!form.institutionName.trim()) errs.institutionName = 'Required'
    if (!form.nationality.trim())     errs.nationality     = 'Required'
    if (!form.email.trim())           errs.email           = 'Required'
    if (form.password.length < 8)     errs.password        = 'Minimum 8 characters'
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match'
    if (!form.founderName.trim())     errs.founderName     = 'Required'
    if (!crFile)                      errs.cr              = 'Commercial register is required'

    if (Object.keys(errs).length) return setErrors(errs)
    setErrors({})
    setLoading(true)

    const body = new FormData()
    Object.entries(form).forEach(([k, v]) => body.append(k, v))
    if (crFile) body.append('commercialRegister', crFile)

    const res = await fetch('/api/auth/register/institution', { method: 'POST', body })
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
          Your institution application is under review. We'll contact you at <strong>{form.email}</strong> once a decision is made.
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
        <Field label="Institution Name" error={errors.institutionName} full>
          <input type="text" value={form.institutionName} onChange={e => set('institutionName', e.target.value)}
            className={inp} placeholder="Acme Training Co." />
        </Field>

        <Field label="Nationality / Country" error={errors.nationality}>
          <input type="text" value={form.nationality} onChange={e => set('nationality', e.target.value)}
            className={inp} placeholder="e.g. Qatari" />
        </Field>

        <Field label="Email" error={errors.email}>
          <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
            className={inp} placeholder="info@institution.com" />
        </Field>

        <Field label="Password" error={errors.password}>
          <input type="password" value={form.password} onChange={e => set('password', e.target.value)}
            className={inp} placeholder="Min. 8 characters" />
        </Field>

        <Field label="Confirm Password" error={errors.confirmPassword}>
          <input type="password" value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)}
            className={inp} />
        </Field>

        <Field label="Website" hint="optional">
          <input type="url" value={form.website} onChange={e => set('website', e.target.value)}
            className={inp} placeholder="https://..." />
        </Field>

        <Field label="Founded Year" hint="optional">
          <input type="number" value={form.foundedYear} onChange={e => set('foundedYear', e.target.value)}
            className={inp} placeholder="e.g. 2010" min="1900" max="2099" />
        </Field>

        <Field label="Number of Employees" hint="optional">
          <input type="number" value={form.employeeCount} onChange={e => set('employeeCount', e.target.value)}
            className={inp} placeholder="e.g. 50" min="1" />
        </Field>

        <Field label="Address" hint="optional" full>
          <input type="text" value={form.address} onChange={e => set('address', e.target.value)}
            className={inp} placeholder="City, Country" />
        </Field>

        <Field label="Founder Name" error={errors.founderName} full>
          <input type="text" value={form.founderName} onChange={e => set('founderName', e.target.value)}
            className={inp} placeholder="Full name of founder" />
        </Field>
      </div>

      <Field label="Commercial Register" hint="PDF — must be valid" error={errors.cr}>
        <input type="file" accept=".pdf,.jpg,.jpeg,.png"
          onChange={e => setCrFile(e.target.files?.[0] ?? null)}
          className="w-full border border-[#E8E4DC] px-3 py-2 text-sm text-[#6B8F9E] file:mr-3 file:border-0 file:bg-[#1C2B39] file:text-white file:px-3 file:py-1 file:text-xs cursor-pointer" />
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

const inp = 'w-full border border-[#E8E4DC] px-3 py-2 text-sm focus:outline-none focus:border-[#1C2B39]'

function Field({ label, error, hint, full, children }: {
  label: string; error?: string; hint?: string; full?: boolean; children: React.ReactNode
}) {
  return (
    <div className={`space-y-1 ${full ? 'sm:col-span-2' : ''}`}>
      <label className="text-sm font-medium text-[#1C2B39]">
        {label} {hint && <span className="text-[#6B8F9E] font-normal text-xs">({hint})</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
