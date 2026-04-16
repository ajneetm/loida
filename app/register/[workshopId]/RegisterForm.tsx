'use client'

import { useState } from 'react'

export default function RegisterForm({ workshopId }: { workshopId: string }) {
  const [form, setForm]     = useState({ name: '', email: '', phone: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')
  const [done, setDone]     = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await fetch(`/api/workshops/${workshopId}/registrations`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(form),
    })
    setLoading(false)

    if (res.ok) {
      setDone(true)
    } else {
      const data = await res.json()
      setError(
        data.error === 'Already registered'
          ? 'This email is already registered for this workshop.'
          : data.error || 'Something went wrong. Please try again.'
      )
    }
  }

  if (done) {
    return (
      <div className="bg-white border border-[#E8E4DC] p-8 text-center space-y-3">
        <div className="w-12 h-12 bg-green-100 flex items-center justify-center mx-auto">
          <span className="text-green-600 text-2xl">✓</span>
        </div>
        <h2 className="font-semibold text-[#1C2B39]">You're registered!</h2>
        <p className="text-sm text-[#6B8F9E]">
          We've received your registration. See you at the workshop!
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-[#E8E4DC] p-6 space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-sm p-3">{error}</div>
      )}

      <div className="space-y-1">
        <label className="text-sm font-medium text-[#1C2B39]">Full Name</label>
        <input type="text" required value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          className="w-full border border-[#E8E4DC] px-3 py-2 text-sm focus:outline-none focus:border-[#1C2B39]"
          placeholder="Your full name" />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-[#1C2B39]">Email Address</label>
        <input type="email" required value={form.email}
          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          className="w-full border border-[#E8E4DC] px-3 py-2 text-sm focus:outline-none focus:border-[#1C2B39]"
          placeholder="your@email.com" />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-[#1C2B39]">Phone <span className="text-[#6B8F9E] font-normal">(optional)</span></label>
        <input type="tel" value={form.phone}
          onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
          className="w-full border border-[#E8E4DC] px-3 py-2 text-sm focus:outline-none focus:border-[#1C2B39]"
          placeholder="+974..." />
      </div>

      <button type="submit" disabled={loading}
        className="w-full bg-[#1C2B39] text-white py-2.5 text-sm font-medium hover:bg-[#2a3f52] transition-colors disabled:opacity-50">
        {loading ? 'Registering…' : 'Register Now'}
      </button>
    </form>
  )
}
