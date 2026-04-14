'use client'
import { useState } from 'react'

interface Props {
  user: {
    name?: string | null
    profile?: {
      bio?: string | null
      phone?: string | null
      country?: string | null
      city?: string | null
      linkedinUrl?: string | null
    } | null
  }
}

export default function ProfileEditForm({ user }: Props) {
  const [form, setForm] = useState({
    name:        user.name ?? '',
    bio:         user.profile?.bio ?? '',
    phone:       user.profile?.phone ?? '',
    country:     user.profile?.country ?? '',
    city:        user.profile?.city ?? '',
    linkedinUrl: user.profile?.linkedinUrl ?? '',
  })
  const [saving, setSaving]   = useState(false)
  const [saved,  setSaved]    = useState(false)
  const [error,  setError]    = useState('')

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) { setError('Failed to save.'); setSaving(false); return }
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      setError('Something went wrong.')
    }
    setSaving(false)
  }

  const inputCls = 'w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-[#0A1628] focus:outline-none focus:border-[#B8973A]/50 transition-colors placeholder:text-stone-300'
  const labelCls = 'block text-stone-400 text-xs tracking-wide mb-1.5'

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-50 border border-red-100 text-red-500 text-sm px-4 py-3 rounded-xl">{error}</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={labelCls}>Full Name</label>
          <input type="text" value={form.name} onChange={set('name')} placeholder="Your name" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Phone</label>
          <input type="tel" value={form.phone} onChange={set('phone')} placeholder="+44 ..." className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>City</label>
          <input type="text" value={form.city} onChange={set('city')} placeholder="London" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Country</label>
          <input type="text" value={form.country} onChange={set('country')} placeholder="United Kingdom" className={inputCls} />
        </div>
      </div>

      <div>
        <label className={labelCls}>LinkedIn URL</label>
        <input type="url" value={form.linkedinUrl} onChange={set('linkedinUrl')} placeholder="https://linkedin.com/in/..." className={inputCls} />
      </div>

      <div>
        <label className={labelCls}>Bio</label>
        <textarea
          value={form.bio}
          onChange={set('bio')}
          rows={3}
          placeholder="Tell us a bit about yourself..."
          className={inputCls + ' resize-none'}
        />
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="bg-[#0A1628] hover:bg-[#1A2B4A] disabled:opacity-50 text-white text-sm font-medium px-6 py-2.5 rounded-xl transition-colors"
        >
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
        {saved && <p className="text-green-500 text-sm">✓ Saved successfully</p>}
      </div>
    </form>
  )
}
