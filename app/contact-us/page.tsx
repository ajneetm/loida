'use client'

import { useState } from 'react'
import Image from 'next/image'

const PROGRAMMES = [
  'ESOL Award',
  'Loida British Life Skills',
  'Business Mentoring',
  'Training – Public Sector',
  'Advanced Courses / Business Clock',
  'General Enquiry',
]

export default function ContactLandingPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', programme: '', message: '' })
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
      body:    JSON.stringify(form),
    })
    setLoading(false)
    if (res.ok) setDone(true)
    else setError('Something went wrong. Please try again.')
  }

  return (
    <div className="min-h-screen bg-[#F8F7F4] flex flex-col">

      {/* Top bar */}
      <div className="bg-[#022269] px-6 py-4 flex items-center justify-between">
        <div>
          <p className="text-white font-bold text-sm tracking-widest uppercase font-['Raleway']">Loida British</p>
          <p className="text-[#c71430] text-[9px] tracking-widest uppercase font-['Inter']">British Quality Education</p>
        </div>
        <div className="hidden sm:flex items-center gap-6 text-white/60 text-xs font-['Inter']">
          <span>+44 8000 608 703</span>
          <span>info@loidabritish.com</span>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-[#022269] px-6 pt-10 pb-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, #c71430 0%, transparent 60%)' }} />
        <div className="relative max-w-2xl mx-auto">
          <div className="inline-block bg-[#c71430] px-3 py-1 text-white text-[10px] font-semibold tracking-[0.2em] uppercase mb-4 font-['Inter']">
            Enrol Today
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white font-['Raleway'] leading-tight mb-3">
            Start Your Journey with<br />
            <span className="text-[#c71430]">Loida British</span>
          </h1>
          <p className="text-blue-200 text-sm sm:text-base font-['Inter'] max-w-lg mx-auto">
            World-class British education. Fill in the form and our team will get back to you within 24 hours.
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 -mt-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Form card */}
          <div className="lg:col-span-3 bg-white border border-[#E8E4DC] shadow-sm">
            <div className="px-6 py-5 border-b border-[#E8E4DC]">
              <h2 className="font-semibold text-[#1C2B39] font-['Raleway']">Send Us a Message</h2>
              <p className="text-xs text-[#6B8F9E] mt-0.5 font-['Inter']">We respond within 24 hours</p>
            </div>

            {done ? (
              <div className="px-6 py-14 text-center space-y-4">
                <div className="w-14 h-14 bg-green-50 border border-green-200 flex items-center justify-center mx-auto">
                  <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="square" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-semibold text-[#1C2B39] text-lg font-['Raleway']">Message Received!</h3>
                <p className="text-sm text-[#6B8F9E] font-['Inter']">
                  Thank you <strong className="text-[#1C2B39]">{form.name}</strong>. We'll contact you at{' '}
                  <strong className="text-[#1C2B39]">{form.email}</strong> within 24 hours.
                </p>
                <button onClick={() => { setDone(false); setForm({ name: '', email: '', phone: '', programme: '', message: '' }) }}
                  className="text-sm text-[#022269] underline font-['Inter'] hover:opacity-70">
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {error && <div className="bg-red-50 text-red-600 text-sm p-3 border border-red-100">{error}</div>}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className={lbl}>Full Name *</label>
                    <input required type="text" value={form.name} onChange={e => set('name', e.target.value)}
                      className={inp} placeholder="Your full name" />
                  </div>
                  <div className="space-y-1">
                    <label className={lbl}>Phone Number *</label>
                    <input required type="tel" value={form.phone} onChange={e => set('phone', e.target.value)}
                      className={inp} placeholder="+44 or +974 ..." />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className={lbl}>Email Address *</label>
                  <input required type="email" value={form.email} onChange={e => set('email', e.target.value)}
                    className={inp} placeholder="you@example.com" />
                </div>

                <div className="space-y-1">
                  <label className={lbl}>Programme of Interest</label>
                  <select value={form.programme} onChange={e => set('programme', e.target.value)} className={inp}>
                    <option value="">Select a programme…</option>
                    {PROGRAMMES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className={lbl}>Your Message *</label>
                  <textarea required rows={4} value={form.message} onChange={e => set('message', e.target.value)}
                    className={`${inp} resize-none`}
                    placeholder="Ask us anything or tell us what you're looking for…" />
                </div>

                <button type="submit" disabled={loading}
                  className="w-full bg-[#c71430] hover:bg-[#a01028] disabled:opacity-50 text-white font-semibold py-3.5 font-['Inter'] transition-colors text-sm tracking-wide">
                  {loading ? 'Sending…' : 'Send Message →'}
                </button>

                <p className="text-[10px] text-[#6B8F9E] text-center font-['Inter']">
                  By submitting you agree to be contacted by Loida British regarding your enquiry.
                </p>
              </form>
            )}
          </div>

          {/* Info card */}
          <div className="lg:col-span-2 space-y-4">

            {/* Why us */}
            <div className="bg-white border border-[#E8E4DC] p-5">
              <div className="w-6 h-0.5 bg-[#c71430] mb-3" />
              <h3 className="font-semibold text-[#1C2B39] mb-4 font-['Raleway'] text-sm">Why Loida British?</h3>
              <div className="space-y-3">
                {[
                  { icon: '🎓', text: 'UK-accredited qualifications' },
                  { icon: '🌍', text: 'Available worldwide — online & in-person' },
                  { icon: '💼', text: 'Trusted by public sector organisations' },
                  { icon: '⚡', text: 'Response within 24 hours' },
                ].map(item => (
                  <div key={item.icon} className="flex items-center gap-3">
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-sm text-[#1C2B39] font-['Inter']">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact info */}
            <div className="bg-[#022269] p-5 space-y-4">
              <h3 className="font-semibold text-white font-['Raleway'] text-sm">Direct Contact</h3>
              {[
                { label: 'Phone', value: '+44 8000 608 703', href: 'tel:+448000608703' },
                { label: 'Email', value: 'info@loidabritish.com', href: 'mailto:info@loidabritish.com' },
                { label: 'Address', value: '83 Baker Street, London W1U 6AG', href: null },
              ].map(item => (
                <div key={item.label}>
                  <p className="text-blue-300 text-[10px] uppercase tracking-widest font-['Inter'] mb-0.5">{item.label}</p>
                  {item.href
                    ? <a href={item.href} className="text-white text-sm font-['Inter'] hover:text-blue-200 transition-colors">{item.value}</a>
                    : <p className="text-white text-sm font-['Inter']">{item.value}</p>
                  }
                </div>
              ))}
            </div>

            {/* Social */}
            <div className="bg-white border border-[#E8E4DC] p-5">
              <p className="text-[10px] text-[#6B8F9E] uppercase tracking-widest mb-3 font-['Inter']">Follow Us</p>
              <div className="flex gap-2 flex-wrap">
                {[
                  { label: 'Instagram', href: 'https://www.instagram.com/loida.british/' },
                  { label: 'LinkedIn',  href: 'https://www.linkedin.com/company/105144233/' },
                  { label: 'Facebook',  href: 'https://www.facebook.com/profile.php?id=61566859705103' },
                ].map(s => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-[#022269] hover:bg-[#011344] text-white text-xs font-['Inter'] transition-colors">
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-[#022269] px-6 py-4 text-center">
        <p className="text-blue-300 text-[11px] font-['Inter']">
          © {new Date().getFullYear()} Loida British Hub. All rights reserved.
        </p>
      </div>
    </div>
  )
}

const inp = 'w-full border border-[#E8E4DC] px-3 py-2.5 text-sm focus:outline-none focus:border-[#022269] bg-white font-[\'Inter\'] text-[#1C2B39] placeholder:text-[#9CA3AF]'
const lbl = 'text-[10px] font-semibold text-[#6B8F9E] uppercase tracking-widest font-[\'Inter\']'
