'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewCurriculumPage() {
  const router  = useRouter()
  const [form, setForm]     = useState({ name: '', domain: 'HARMONY', siteUrl: '', apiSecret: '' })
  const [error, setError]   = useState('')
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
      setError(data.error || 'حدث خطأ')
    }
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <h1 className="text-2xl font-semibold text-[#1C2B39]">إضافة منهج</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-[#E8E4DC] p-6 space-y-5">
        {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{error}</div>}

        <div className="space-y-1">
          <label className="text-sm font-medium text-[#1C2B39]">اسم المنهج</label>
          <input type="text" required value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            className="w-full border border-[#E8E4DC] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1C2B39]"
            placeholder="Harmony" />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-[#1C2B39]">الدومين</label>
          <select value={form.domain}
            onChange={e => setForm(f => ({ ...f, domain: e.target.value }))}
            className="w-full border border-[#E8E4DC] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1C2B39]">
            <option value="HARMONY">HARMONY</option>
            <option value="CAREER">CAREER</option>
            <option value="BUSINESS">BUSINESS</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-[#1C2B39]">رابط الموقع</label>
          <input type="url" required value={form.siteUrl}
            onChange={e => setForm(f => ({ ...f, siteUrl: e.target.value }))}
            className="w-full border border-[#E8E4DC] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1C2B39]"
            placeholder="https://harmony.loidabritish.com" />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-[#1C2B39]">API Secret</label>
          <input type="text" required minLength={16} value={form.apiSecret}
            onChange={e => setForm(f => ({ ...f, apiSecret: e.target.value }))}
            className="w-full border border-[#E8E4DC] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1C2B39] font-mono"
            placeholder="مفتاح سري لربط الموقع بلويدا" />
          <p className="text-xs text-[#6B8F9E]">16 حرف على الأقل. استخدمه في موقع المنهج للتحقق من الطلبات.</p>
        </div>

        <button type="submit" disabled={loading}
          className="w-full bg-[#1C2B39] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-[#2a3f52] transition-colors disabled:opacity-50">
          {loading ? 'جاري الإنشاء...' : 'إضافة المنهج'}
        </button>
      </form>
    </div>
  )
}
