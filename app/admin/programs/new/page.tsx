'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getDomainColor } from '@/lib/utils'

const domains  = ['HARMONY', 'CAREER', 'BUSINESS'] as const
const types    = ['COURSE', 'COACHING', 'WORKSHOP', 'BOOTCAMP'] as const
const levels   = ['Beginner', 'Intermediate', 'Advanced', 'All levels']
const currencies = ['GBP', 'USD', 'EUR']

export default function NewProgramPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    title:       '',
    description: '',
    domain:      'HARMONY' as typeof domains[number],
    type:        'COURSE'  as typeof types[number],
    price:       '0',
    currency:    'GBP',
    duration:    '',
    level:       'Beginner',
    tags:        '',
    order:       '0',
  })
  const [saving, setSaving] = useState(false)
  const [error,  setError]  = useState('')

  const setF = (k: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm(p => ({ ...p, [k]: e.target.value }))

  const handleSave = async (publish = false) => {
    if (!form.title || !form.description) { setError('Title and description are required.'); return }
    setSaving(true); setError('')

    const res = await fetch('/api/programs', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        ...form,
        price:       parseFloat(form.price) || 0,
        order:       parseInt(form.order)   || 0,
        tags:        form.tags.split(',').map(t => t.trim()).filter(Boolean),
        isPublished: publish,
      }),
    })
    setSaving(false)
    if (!res.ok) { const d = await res.json(); setError(d.message ?? 'Error saving.'); return }
    router.push('/admin/programs')
  }

  const color    = getDomainColor(form.domain)
  const inputCls = 'w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-[#0A1628] focus:outline-none focus:border-[#B8973A]/50 transition-colors placeholder:text-stone-300'
  const labelCls = 'block text-stone-400 text-xs tracking-wide mb-1.5'

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-[#0A1628] font-light">New Program</h1>
        <button onClick={() => router.back()} className="text-stone-400 hover:text-stone-600 text-sm">← Back</button>
      </div>

      <div className="bg-white rounded-2xl border border-stone-100 p-6 space-y-5">
        {error && <div className="bg-red-50 border border-red-100 text-red-500 text-sm px-4 py-3 rounded-xl">{error}</div>}

        {/* Domain */}
        <div>
          <label className={labelCls}>Domain *</label>
          <div className="flex gap-2">
            {domains.map(d => (
              <button key={d} type="button" onClick={() => setForm(p => ({ ...p, domain: d }))}
                className="flex-1 py-2.5 rounded-xl text-xs font-medium border transition-all"
                style={form.domain === d
                  ? { background: getDomainColor(d), color: '#fff', borderColor: getDomainColor(d) }
                  : { borderColor: '#e7e5e4', color: '#78716c' }}>
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Type */}
        <div>
          <label className={labelCls}>Type *</label>
          <div className="grid grid-cols-4 gap-2">
            {types.map(t => (
              <button key={t} type="button" onClick={() => setForm(p => ({ ...p, type: t }))}
                className={`py-2.5 rounded-xl text-xs font-medium border transition-all ${form.type === t ? 'bg-[#0A1628] text-white border-[#0A1628]' : 'border-stone-200 text-stone-500 hover:border-stone-400'}`}>
                {t.charAt(0) + t.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className={labelCls}>Title *</label>
          <input type="text" value={form.title} onChange={setF('title')} placeholder="Program title" className={inputCls} />
        </div>

        {/* Description */}
        <div>
          <label className={labelCls}>Description *</label>
          <textarea value={form.description} onChange={setF('description')} rows={4}
            placeholder="Describe what participants will learn and achieve…"
            className={inputCls + ' resize-none'} />
        </div>

        {/* Price + Currency */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Price</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 text-sm">
                {form.currency === 'GBP' ? '£' : form.currency === 'USD' ? '$' : '€'}
              </span>
              <input type="number" min="0" step="0.01" value={form.price} onChange={setF('price')}
                placeholder="0.00" className={inputCls + ' pl-8'} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Currency</label>
            <select value={form.currency} onChange={setF('currency')} className={inputCls}>
              {currencies.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Duration + Level */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Duration</label>
            <input type="text" value={form.duration} onChange={setF('duration')}
              placeholder="e.g. 8 weeks" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Level</label>
            <select value={form.level} onChange={setF('level')} className={inputCls}>
              {levels.map(l => <option key={l}>{l}</option>)}
            </select>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className={labelCls}>Tags (comma separated)</label>
          <input type="text" value={form.tags} onChange={setF('tags')}
            placeholder="e.g. career, coaching, cv-writing" className={inputCls} />
        </div>

        {/* Order */}
        <div className="w-28">
          <label className={labelCls}>Display Order</label>
          <input type="number" min="0" value={form.order} onChange={setF('order')} className={inputCls} />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button onClick={() => handleSave(false)} disabled={saving}
          className="flex-1 border border-stone-200 text-stone-600 hover:border-stone-400 text-sm font-medium py-3 rounded-xl transition-colors disabled:opacity-50">
          Save as Draft
        </button>
        <button onClick={() => handleSave(true)} disabled={saving}
          className="flex-1 bg-[#B8973A] hover:bg-[#D4B05A] text-white text-sm font-medium py-3 rounded-xl transition-colors disabled:opacity-50">
          {saving ? 'Saving…' : 'Publish Program'}
        </button>
      </div>
    </div>
  )
}
