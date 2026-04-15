'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewCurriculumPage() {
  const router = useRouter()
  const [form, setForm]       = useState({ name: '', domain: 'HARMONY', siteUrl: '', apiSecret: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await fetch('/api/curricula', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(form),
    })

    setLoading(false)

    if (res.ok) {
      router.push('/admin/curricula')
    } else {
      const data = await res.json()
      setError(data.error || 'Something went wrong.')
    }
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <h1 className="text-2xl font-semibold text-[#1C2B39]">Add Curriculum</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-[#E8E4DC] p-6 space-y-5">
        {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{error}</div>}

        <Field label="Curriculum Name">
          <input type="text" required value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            className="input" placeholder="e.g. Harmony" />
        </Field>

        <Field label="Domain">
          <select value={form.domain}
            onChange={e => setForm(f => ({ ...f, domain: e.target.value }))}
            className="input">
            <option value="HARMONY">HARMONY</option>
            <option value="CAREER">CAREER</option>
            <option value="BUSINESS">BUSINESS</option>
          </select>
        </Field>

        <Field label="Site URL">
          <input type="url" required value={form.siteUrl}
            onChange={e => setForm(f => ({ ...f, siteUrl: e.target.value }))}
            className="input" placeholder="https://harmony.loidabritish.com" />
        </Field>

        <Field label="API Secret">
          <input type="text" required minLength={16} value={form.apiSecret}
            onChange={e => setForm(f => ({ ...f, apiSecret: e.target.value }))}
            className="input font-mono" placeholder="Min 16 characters" />
          <p className="text-xs text-[#6B8F9E] mt-1">Shared secret used to verify requests from the curriculum site.</p>
        </Field>

        <button type="submit" disabled={loading}
          className="w-full bg-[#1C2B39] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-[#2a3f52] transition-colors disabled:opacity-50">
          {loading ? 'Adding…' : 'Add Curriculum'}
        </button>
      </form>

      <style jsx>{`
        .input { width:100%; border:1px solid #E8E4DC; border-radius:0.5rem; padding:0.5rem 0.75rem; font-size:0.875rem; outline:none; }
        .input:focus { border-color:#1C2B39; }
      `}</style>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-[#1C2B39]">{label}</label>
      {children}
    </div>
  )
}
