'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Curriculum {
  id: string
  name: string
  domain: string
}

export default function NewCertificateRequestPage() {
  const router = useRouter()
  const [curricula, setCurricula] = useState<Curriculum[]>([])
  const [form, setForm] = useState({
    curriculumId: '',
    traineeName:  '',
    traineeEmail: '',
    workshopDate: '',
    notes:        '',
  })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    // Fetch only accredited curricula for this trainer
    fetch('/api/certificates/curricula')
      .then(r => r.json())
      .then(data => {
        setCurricula(data)
        if (data.length > 0) setForm(f => ({ ...f, curriculumId: data[0].id }))
      })
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!form.curriculumId || !form.traineeName || !form.traineeEmail || !form.workshopDate) {
      setError('Please fill in all required fields.')
      return
    }

    setLoading(true)
    const res = await fetch('/api/certificates', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(form),
    })
    setLoading(false)

    if (res.ok) {
      setSuccess(true)
    } else {
      const data = await res.json()
      setError(data.error || 'Something went wrong.')
    }
  }

  if (success) {
    return (
      <div className="max-w-md mx-auto mt-16 bg-white border border-[#E8E4DC] p-8 text-center space-y-4">
        <div className="w-12 h-12 bg-green-100 flex items-center justify-center mx-auto">
          <span className="text-green-600 text-xl">✓</span>
        </div>
        <h2 className="text-xl font-semibold text-[#1C2B39]">Request Submitted</h2>
        <p className="text-sm text-[#6B8F9E]">Your certificate request has been submitted and is pending admin review.</p>
        <div className="flex gap-3 justify-center pt-2">
          <button
            type="button"
            onClick={() => router.push('/trainer/certificates')}
            className="px-4 py-2 bg-[#1C2B39] text-white text-sm hover:bg-[#2a3f52] transition-colors"
          >
            View All Requests
          </button>
          <button
            type="button"
            onClick={() => { setSuccess(false); setForm(f => ({ ...f, traineeName: '', traineeEmail: '', workshopDate: '', notes: '' })) }}
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
        <h1 className="text-2xl font-semibold text-[#1C2B39]">New Certificate Request</h1>
        <p className="text-sm text-[#6B8F9E] mt-1">Submit a request for a trainee who completed your workshop</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-[#E8E4DC] p-6 space-y-5">
        {error && <div className="bg-red-50 text-red-600 text-sm p-3">{error}</div>}

        <Field label="Curriculum">
          {curricula.length === 0 ? (
            <p className="text-sm text-[#6B8F9E] py-2">Loading…</p>
          ) : (
            <select
              value={form.curriculumId}
              onChange={e => setForm(f => ({ ...f, curriculumId: e.target.value }))}
              className="w-full border border-[#E8E4DC] px-3 py-2 text-sm focus:outline-none focus:border-[#1C2B39] bg-white"
            >
              {curricula.map(c => (
                <option key={c.id} value={c.id}>{c.name} — {c.domain}</option>
              ))}
            </select>
          )}
        </Field>

        <Field label="Trainee Full Name">
          <input
            type="text" required value={form.traineeName}
            onChange={e => setForm(f => ({ ...f, traineeName: e.target.value }))}
            className="w-full border border-[#E8E4DC] px-3 py-2 text-sm focus:outline-none focus:border-[#1C2B39]"
            placeholder="John Smith"
          />
        </Field>

        <Field label="Trainee Email">
          <input
            type="email" required value={form.traineeEmail}
            onChange={e => setForm(f => ({ ...f, traineeEmail: e.target.value }))}
            className="w-full border border-[#E8E4DC] px-3 py-2 text-sm focus:outline-none focus:border-[#1C2B39]"
            placeholder="trainee@example.com"
          />
        </Field>

        <Field label="Workshop Date">
          <input
            type="date" required value={form.workshopDate}
            onChange={e => setForm(f => ({ ...f, workshopDate: e.target.value }))}
            className="w-full border border-[#E8E4DC] px-3 py-2 text-sm focus:outline-none focus:border-[#1C2B39]"
          />
        </Field>

        <Field label="Notes (optional)">
          <textarea
            value={form.notes} rows={3}
            onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            className="w-full border border-[#E8E4DC] px-3 py-2 text-sm focus:outline-none focus:border-[#1C2B39] resize-none"
            placeholder="Any additional information…"
          />
        </Field>

        <button
          type="submit" disabled={loading}
          className="w-full bg-[#1C2B39] text-white py-2.5 text-sm font-medium hover:bg-[#2a3f52] transition-colors disabled:opacity-50"
        >
          {loading ? 'Submitting…' : 'Submit Request'}
        </button>
      </form>
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
