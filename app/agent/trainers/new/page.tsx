'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { z } from 'zod'

const schema = z.object({
  name:  z.string().min(2, 'الاسم مطلوب'),
  email: z.string().email('بريد إلكتروني غير صحيح'),
  phone: z.string().optional(),
  bio:   z.string().optional(),
})

export default function NewTrainerPage() {
  const router  = useRouter()
  const [form, setForm]     = useState({ name: '', email: '', phone: '', bio: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [created, setCreated] = useState<{ email: string; tempPassword: string } | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrors({})

    const parsed = schema.safeParse(form)
    if (!parsed.success) {
      const errs: Record<string, string> = {}
      parsed.error.errors.forEach(err => {
        if (err.path[0]) errs[err.path[0] as string] = err.message
      })
      setErrors(errs)
      return
    }

    setLoading(true)
    const res = await fetch('/api/trainers', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(form),
    })
    setLoading(false)

    if (res.ok) {
      const data = await res.json()
      setCreated({ email: data.email, tempPassword: data.tempPassword })
    } else {
      const data = await res.json()
      setErrors({ form: data.error || 'حدث خطأ' })
    }
  }

  if (created) {
    return (
      <div className="max-w-md mx-auto mt-16 bg-white rounded-xl border border-[#E8E4DC] p-8 text-center space-y-4">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <span className="text-green-600 text-xl">✓</span>
        </div>
        <h2 className="text-xl font-semibold text-[#1C2B39]">تم إنشاء الحساب</h2>
        <div className="bg-[#F8F7F4] rounded-lg p-4 text-sm text-right space-y-2">
          <p><span className="text-[#6B8F9E]">البريد:</span> {created.email}</p>
          <p><span className="text-[#6B8F9E]">كلمة المرور المؤقتة:</span> <code className="font-mono font-bold">{created.tempPassword}</code></p>
        </div>
        <p className="text-xs text-[#6B8F9E]">أرسل هذه البيانات للمدرب. سيتمكن من تغيير كلمة المرور عند أول دخول.</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => router.push('/agent')}
            className="px-4 py-2 bg-[#1C2B39] text-white rounded-lg text-sm hover:bg-[#2a3f52] transition-colors"
          >
            العودة للوحة
          </button>
          <button
            onClick={() => { setCreated(null); setForm({ name: '', email: '', phone: '', bio: '' }) }}
            className="px-4 py-2 border border-[#E8E4DC] text-[#1C2B39] rounded-lg text-sm hover:bg-[#F8F7F4] transition-colors"
          >
            إضافة مدرب آخر
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#1C2B39]">إضافة مدرب جديد</h1>
        <p className="text-sm text-[#6B8F9E] mt-1">سيتم إنشاء حساب للمدرب على لويدا</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-[#E8E4DC] p-6 space-y-5">
        {errors.form && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{errors.form}</div>
        )}

        <Field label="الاسم الكامل" error={errors.name}>
          <input
            type="text"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            className="w-full border border-[#E8E4DC] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1C2B39]"
            placeholder="محمد أحمد"
          />
        </Field>

        <Field label="البريد الإلكتروني" error={errors.email}>
          <input
            type="email"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            className="w-full border border-[#E8E4DC] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1C2B39]"
            placeholder="trainer@example.com"
          />
        </Field>

        <Field label="رقم الجوال" error={errors.phone}>
          <input
            type="tel"
            value={form.phone}
            onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
            className="w-full border border-[#E8E4DC] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1C2B39]"
            placeholder="+974..."
          />
        </Field>

        <Field label="نبذة (اختياري)" error={errors.bio}>
          <textarea
            value={form.bio}
            onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
            rows={3}
            className="w-full border border-[#E8E4DC] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1C2B39] resize-none"
            placeholder="خبرة المدرب..."
          />
        </Field>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#1C2B39] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-[#2a3f52] transition-colors disabled:opacity-50"
        >
          {loading ? 'جاري الإنشاء...' : 'إنشاء الحساب'}
        </button>
      </form>
    </div>
  )
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-[#1C2B39]">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
