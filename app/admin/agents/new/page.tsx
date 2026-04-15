'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewAgentPage() {
  const router = useRouter()
  const [form, setForm]     = useState({ name: '', email: '', password: '', country: 'QA', companyName: '', phone: '' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await fetch('/api/agents', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(form),
    })

    setLoading(false)

    if (res.ok) {
      router.push('/admin/agents')
    } else {
      const data = await res.json()
      setError(data.error || 'حدث خطأ')
    }
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <h1 className="text-2xl font-semibold text-[#1C2B39]">إضافة وكيل جديد</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-[#E8E4DC] p-6 space-y-5">
        {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{error}</div>}

        <Field label="الاسم الكامل">
          <input type="text" required value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            className="input" placeholder="اسم الوكيل" />
        </Field>

        <Field label="البريد الإلكتروني">
          <input type="email" required value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            className="input" placeholder="agent@example.com" />
        </Field>

        <Field label="كلمة المرور">
          <input type="password" required minLength={8} value={form.password}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            className="input" placeholder="8 أحرف على الأقل" />
        </Field>

        <Field label="الدولة">
          <select value={form.country}
            onChange={e => setForm(f => ({ ...f, country: e.target.value }))}
            className="input">
            <option value="QA">قطر</option>
            <option value="SA">السعودية</option>
            <option value="OTHER">أخرى</option>
          </select>
        </Field>

        <Field label="اسم الشركة (اختياري)">
          <input type="text" value={form.companyName}
            onChange={e => setForm(f => ({ ...f, companyName: e.target.value }))}
            className="input" placeholder="اسم الشركة" />
        </Field>

        <Field label="رقم الجوال (اختياري)">
          <input type="tel" value={form.phone}
            onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
            className="input" placeholder="+974..." />
        </Field>

        <button type="submit" disabled={loading}
          className="w-full bg-[#1C2B39] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-[#2a3f52] transition-colors disabled:opacity-50">
          {loading ? 'جاري الإنشاء...' : 'إنشاء الحساب'}
        </button>
      </form>

      <style jsx>{`
        .input {
          width: 100%;
          border: 1px solid #E8E4DC;
          border-radius: 0.5rem;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          outline: none;
        }
        .input:focus { border-color: #1C2B39; }
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
