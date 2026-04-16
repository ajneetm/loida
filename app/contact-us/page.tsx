'use client'

import { useState } from 'react'

export default function ContactLandingPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '' })
  const [loading, setLoading] = useState(false)
  const [done, setDone]       = useState(false)
  const [error, setError]     = useState('')

  function set(k: string, v: string) { setForm(f => ({ ...f, [k]: v })) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const res = await fetch('/api/contact', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ ...form, message: `Contact request from ${form.name}` }),
    })
    setLoading(false)
    if (res.ok) setDone(true)
    else setError('Something went wrong. Please try again.')
  }

  return (
    <div className="min-h-screen bg-[#022269] flex flex-col items-center justify-center px-4 py-10">

      {/* Logo */}
      <div className="text-center mb-8">
        <p className="text-white font-bold text-xl tracking-[0.25em] uppercase font-['Raleway']">
          LOIDA BRITISH
        </p>
        <div className="w-10 h-0.5 bg-[#c71430] mx-auto mt-2" />
        <p className="text-blue-300 text-xs tracking-widest uppercase mt-2 font-['Inter']">
          British Quality Education
        </p>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm bg-white">

        {done ? (
          <div className="p-10 text-center space-y-4">
            <div className="w-14 h-14 bg-green-50 border border-green-200 flex items-center justify-center mx-auto">
              <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="square" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="font-bold text-[#1C2B39] text-lg font-['Raleway']">We'll be in touch!</h2>
            <p className="text-sm text-[#6B8F9E] font-['Inter']">
              Thank you <strong className="text-[#1C2B39]">{form.name}</strong>.
              Our team will contact you within 24 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-7 space-y-4">
            <div className="text-center mb-2">
              <h1 className="font-bold text-[#1C2B39] text-lg font-['Raleway']">Get in Touch</h1>
              <p className="text-xs text-[#6B8F9E] mt-1 font-['Inter']">We respond within 24 hours</p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 text-center">{error}</div>
            )}

            <div className="space-y-1">
              <label className={lbl}>Full Name *</label>
              <input
                required type="text" value={form.name}
                onChange={e => set('name', e.target.value)}
                className={inp} placeholder="Your full name"
                autoFocus
              />
            </div>

            <div className="space-y-1">
              <label className={lbl}>Phone Number *</label>
              <input
                required type="tel" value={form.phone}
                onChange={e => set('phone', e.target.value)}
                className={inp} placeholder="+44 or +974 ..."
              />
            </div>

            <div className="space-y-1">
              <label className={lbl}>Email Address *</label>
              <input
                required type="email" value={form.email}
                onChange={e => set('email', e.target.value)}
                className={inp} placeholder="you@example.com"
              />
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full bg-[#c71430] hover:bg-[#a01028] disabled:opacity-50 text-white font-bold py-3.5 font-['Inter'] transition-colors text-sm tracking-wide mt-2"
            >
              {loading ? 'Sending…' : 'Send →'}
            </button>

            <p className="text-[10px] text-[#9CA3AF] text-center font-['Inter']">
              By submitting you agree to be contacted by Loida British.
            </p>
          </form>
        )}
      </div>

      <p className="text-white/30 text-[10px] mt-8 font-['Inter']">
        © {new Date().getFullYear()} Loida British Hub
      </p>
    </div>
  )
}

const inp = 'w-full border border-[#E8E4DC] px-3 py-3 text-sm focus:outline-none focus:border-[#022269] bg-white font-[\'Inter\'] text-[#1C2B39] placeholder:text-[#9CA3AF]'
const lbl = 'text-[10px] font-semibold text-[#6B8F9E] uppercase tracking-widest font-[\'Inter\']'
