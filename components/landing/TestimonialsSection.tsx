'use client'
// Contact Us section
import { useState } from 'react'

export default function TestimonialsSection() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setSent(true)
    setLoading(false)
  }

  return (
    <section id="contact" className="py-24 bg-[#022269]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left — info */}
          <div className="text-white">
            <p className="text-blue-300 text-xs tracking-[0.3em] uppercase font-semibold mb-4">Get In Touch</p>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6">Contact Us</h2>
            <p className="text-blue-100 leading-relaxed mb-10">
              Have a question about our programs, coaching, or how to get started? We&apos;d love to hear from you. Our team will respond within 24 hours.
            </p>

            <div className="space-y-6">
              {[
                { icon: '📍', label: '83 Baker Street, London W1U 6AG' },
                { icon: '📞', label: '+44 8000 608 703' },
                { icon: '✉️', label: 'info@loidabritish.com' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/10  flex items-center justify-center text-lg">
                    {item.icon}
                  </div>
                  <p className="text-blue-100 text-sm">{item.label}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-10">
              {[
                { label: 'Instagram', href: 'https://www.instagram.com/loida.british/' },
                { label: 'LinkedIn',  href: 'https://www.linkedin.com/company/105144233/' },
                { label: 'Facebook',  href: 'https://www.facebook.com/profile.php?id=61566859705103' },
              ].map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-medium  transition-colors">
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Right — form */}
          <div className="bg-white  p-8 shadow-xl">
            {sent ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-50  flex items-center justify-center mx-auto mb-4 text-3xl">✅</div>
                <h3 className="text-xl font-bold text-[#022269] mb-2">Message Sent!</h3>
                <p className="text-gray-500 text-sm">Thank you for reaching out. We&apos;ll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-xl font-bold text-[#022269] mb-6">Send us a Message</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 font-medium mb-1">Your Name</label>
                    <input type="text" required value={form.name}
                      onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                      className="w-full border border-gray-200  px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#022269]/50 transition-colors"
                      placeholder="John Smith" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 font-medium mb-1">Email</label>
                    <input type="email" required value={form.email}
                      onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                      className="w-full border border-gray-200  px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#022269]/50 transition-colors"
                      placeholder="you@example.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 font-medium mb-1">Subject</label>
                  <input type="text" value={form.subject}
                    onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                    className="w-full border border-gray-200  px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#022269]/50 transition-colors"
                    placeholder="How can we help?" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 font-medium mb-1">Message</label>
                  <textarea required rows={5} value={form.message}
                    onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                    className="w-full border border-gray-200  px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#022269]/50 transition-colors resize-none"
                    placeholder="Tell us what you need..." />
                </div>
                {/* Component4 exact: red bg, white, , 15.1px, line-height 19.2px */}
                <button type="submit" disabled={loading}
                  className="w-full bg-[#c71430] hover:bg-[#a01028] disabled:opacity-50 text-white  overflow-hidden flex items-center justify-center py-[11px] px-[7.4px] font-['Inter'] transition-colors"
                  style={{ fontSize: '15.1px', lineHeight: '19.2px' }}>
                  {loading ? 'Sending…' : 'Submit'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
