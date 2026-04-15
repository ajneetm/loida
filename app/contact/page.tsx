'use client'
import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'

const programs = [
  'ESOL Award',
  'Loida British Life Skills',
  'Business Mentoring',
  'Training – Public Sector',
  'Advanced Courses / Business Clock',
  'General Enquiry',
]

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', programme: '', message: '' })
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
    <>
      <Navbar />

      {/* Header */}
      <section className="pt-[117px] bg-[#022269]">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <p className="text-[#c71430] text-xs tracking-[0.3em] uppercase font-semibold mb-3 font-['Inter']">Get In Touch</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white font-['Raleway'] leading-tight">Contact Us</h1>
          <p className="text-blue-200 mt-3 font-['Tajawal'] text-lg max-w-xl">
            Have a question about our programmes or want to enrol? We&apos;d love to hear from you. Our team will respond within 24 hours.
          </p>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="bg-[#f0f7f9] border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-2 text-sm font-['Inter']">
          <Link href="/" className="text-[#022269] hover:underline">Home</Link>
          <span className="text-gray-400">›</span>
          <span className="text-gray-500">Contact Us</span>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Left — contact info */}
          <div className="space-y-6">
            <div>
              <div className="w-8 h-0.5 bg-[#c71430] mb-4" />
              <h2 className="text-xl font-bold text-[#022269] font-['Raleway'] mb-5">Contact Information</h2>
            </div>

            {[
              {
                title: 'Address',
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-white">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                ),
                lines: ['83 Baker Street', 'London, W1U 6AG', 'United Kingdom'],
              },
              {
                title: 'Phone',
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-white">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                  </svg>
                ),
                lines: ['+44 8000 608 703'],
              },
              {
                title: 'Email',
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-white">
                    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                ),
                lines: ['info@loidabritish.com'],
              },
              {
                title: 'Office Hours',
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-white">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm.5 5v5.25l4.5 2.67-.75 1.23L11 13V7h1.5z"/>
                  </svg>
                ),
                lines: ['Mon – Fri: 9:00 AM – 6:00 PM', 'Saturday: 10:00 AM – 2:00 PM'],
              },
            ].map(item => (
              <div key={item.title} className="flex gap-4">
                <div className="w-10 h-10 bg-[#022269] flex items-center justify-center flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="font-semibold text-[#022269] text-sm mb-1 font-['Inter']">{item.title}</p>
                  {item.lines.map(l => (
                    <p key={l} className="text-gray-500 text-sm font-['Inter']">{l}</p>
                  ))}
                </div>
              </div>
            ))}

            {/* Social */}
            <div className="pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400 font-['Inter'] mb-3 uppercase tracking-widest">Follow Us</p>
              <div className="flex gap-2">
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

          {/* Right — form */}
          <div className="lg:col-span-2">
            {sent ? (
              <div className="bg-gray-50 border border-gray-100 p-16 text-center">
                <div className="w-14 h-14 bg-[#022269] flex items-center justify-center mx-auto mb-5">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M5 13L9 17L19 7" stroke="white" strokeWidth="2" strokeLinecap="square"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-[#022269] font-['Raleway'] mb-2">Message Sent!</h3>
                <p className="text-gray-500 font-['Inter']">Thank you for reaching out. We&apos;ll get back to you within 24 hours.</p>
                <button onClick={() => setSent(false)}
                  className="mt-8 text-[#c71430] text-sm font-['Inter'] underline hover:opacity-70">
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs text-gray-500 font-medium mb-1.5 font-['Inter'] uppercase tracking-wide">Full Name *</label>
                    <input type="text" required value={form.name}
                      onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                      className="w-full border border-gray-200 px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#022269] transition-colors font-['Inter']"
                      placeholder="Your full name" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 font-medium mb-1.5 font-['Inter'] uppercase tracking-wide">Email Address *</label>
                    <input type="email" required value={form.email}
                      onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                      className="w-full border border-gray-200 px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#022269] transition-colors font-['Inter']"
                      placeholder="you@example.com" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs text-gray-500 font-medium mb-1.5 font-['Inter'] uppercase tracking-wide">Phone Number</label>
                    <input type="tel" value={form.phone}
                      onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                      className="w-full border border-gray-200 px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#022269] transition-colors font-['Inter']"
                      placeholder="+44 ..." />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 font-medium mb-1.5 font-['Inter'] uppercase tracking-wide">Programme of Interest</label>
                    <select value={form.programme}
                      onChange={e => setForm(p => ({ ...p, programme: e.target.value }))}
                      className="w-full border border-gray-200 px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#022269] transition-colors font-['Inter'] bg-white">
                      <option value="">Select a programme…</option>
                      {programs.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-500 font-medium mb-1.5 font-['Inter'] uppercase tracking-wide">Your Message *</label>
                  <textarea required rows={6} value={form.message}
                    onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                    className="w-full border border-gray-200 px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#022269] transition-colors resize-none font-['Inter']"
                    placeholder="Tell us what you need or ask us anything…" />
                </div>

                <button type="submit" disabled={loading}
                  className="w-full bg-[#c71430] hover:bg-[#a01028] disabled:opacity-50 text-white font-semibold py-4 font-['Inter'] transition-colors text-sm tracking-wide">
                  {loading ? 'Sending…' : 'Send Message'}
                </button>

                <p className="text-xs text-gray-400 text-center font-['Inter']">
                  By submitting this form you agree to our{' '}
                  <Link href="/policies" className="text-[#022269] underline hover:opacity-70">Policies</Link>.
                </p>
              </form>
            )}
          </div>
        </div>

        {/* Map */}
        <div className="mt-16">
          <h2 className="text-xl font-bold text-[#022269] font-['Raleway'] mb-5">Find Us</h2>
          <div className="h-80 border border-gray-200">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2482.4267390019636!2d-0.15715!3d51.52093!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48761acf2e2d6e21%3A0x1d0c19cfd8c3df49!2s83%20Baker%20St%2C%20London%20W1U%206AG!5e0!3m2!1sen!2suk!4v1710000000000!5m2!1sen!2suk"
              width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
