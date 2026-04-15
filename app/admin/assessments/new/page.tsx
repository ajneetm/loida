'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getDomainColor } from '@/lib/utils'

type QuestionType = 'SINGLE' | 'MULTIPLE' | 'SCALE' | 'TEXT'

interface Option  { value: string; label: string }
interface Question {
  id:       string
  text:     string
  type:     QuestionType
  options:  Option[]
  required: boolean
}

const blankQuestion = (): Question => ({
  id:       crypto.randomUUID().slice(0, 8),
  text:     '',
  type:     'SINGLE',
  options:  [{ value: 'a', label: '' }, { value: 'b', label: '' }],
  required: true,
})

const domains = ['HARMONY', 'CAREER', 'BUSINESS'] as const
const qTypes: { value: QuestionType; label: string; desc: string }[] = [
  { value: 'SINGLE',   label: 'Single Choice', desc: 'Pick one option' },
  { value: 'MULTIPLE', label: 'Multi Choice',  desc: 'Select all that apply' },
  { value: 'SCALE',    label: 'Scale 1–5',     desc: 'Rating slider' },
  { value: 'TEXT',     label: 'Open Text',     desc: 'Free-form answer' },
]

export default function NewAssessmentPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    title:       '',
    description: '',
    domain:      'HARMONY' as typeof domains[number],
    order:       0,
  })
  const [questions, setQuestions] = useState<Question[]>([blankQuestion()])
  const [saving, setSaving]       = useState(false)
  const [error,  setError]        = useState('')

  const setF = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }))

  // Question helpers
  const updateQ = (idx: number, patch: Partial<Question>) =>
    setQuestions(qs => qs.map((q, i) => i === idx ? { ...q, ...patch } : q))

  const updateOption = (qIdx: number, oIdx: number, label: string) =>
    setQuestions(qs => qs.map((q, i) =>
      i === qIdx
        ? { ...q, options: q.options.map((o, j) => j === oIdx ? { ...o, label } : o) }
        : q
    ))

  const addOption = (qIdx: number) =>
    setQuestions(qs => qs.map((q, i) =>
      i === qIdx
        ? { ...q, options: [...q.options, { value: String.fromCharCode(97 + q.options.length), label: '' }] }
        : q
    ))

  const removeOption = (qIdx: number, oIdx: number) =>
    setQuestions(qs => qs.map((q, i) =>
      i === qIdx ? { ...q, options: q.options.filter((_, j) => j !== oIdx) } : q
    ))

  const removeQuestion = (idx: number) =>
    setQuestions(qs => qs.filter((_, i) => i !== idx))

  const moveQuestion = (idx: number, dir: -1 | 1) =>
    setQuestions(qs => {
      const arr = [...qs]
      const t   = arr[idx + dir]
      arr[idx + dir] = arr[idx]
      arr[idx]       = t
      return arr
    })

  const handleSave = async () => {
    if (!form.title || !form.description) { setError('Title and description are required.'); return }
    if (questions.some(q => !q.text))    { setError('All questions need text.'); return }
    setSaving(true); setError('')

    const res = await fetch('/api/admin/assessments', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ ...form, questions }),
    })
    setSaving(false)
    if (!res.ok) { const d = await res.json(); setError(d.message ?? 'Error saving.'); return }
    router.push('/admin/assessments')
  }

  const color = getDomainColor(form.domain)
  const inputCls = 'w-full border border-stone-200 rounded-none px-4 py-2.5 text-sm text-[#022269] focus:outline-none focus:border-[#c71430]/50 transition-colors placeholder:text-stone-300'

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-[#022269] font-light">New Assessment</h1>
        <button onClick={() => router.back()} className="text-stone-400 hover:text-stone-600 text-sm transition-colors">← Back</button>
      </div>

      {/* Basic info */}
      <div className="bg-white rounded-none border border-stone-100 p-6 space-y-4">
        <h2 className="font-display text-lg text-[#022269]">Basic Info</h2>

        {error && <div className="bg-red-50 border border-red-100 text-red-500 text-sm px-4 py-3 rounded-none">{error}</div>}

        <div>
          <label className="block text-stone-400 text-xs tracking-wide mb-1.5">Domain *</label>
          <div className="flex gap-2">
            {domains.map(d => (
              <button key={d} type="button" onClick={() => setForm(p => ({ ...p, domain: d }))}
                className="flex-1 py-2.5 rounded-none text-xs font-medium border transition-all"
                style={form.domain === d
                  ? { background: getDomainColor(d), color: '#fff', borderColor: getDomainColor(d) }
                  : { borderColor: '#e7e5e4', color: '#78716c' }}>
                {d}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-stone-400 text-xs tracking-wide mb-1.5">Title *</label>
          <input type="text" value={form.title} onChange={setF('title')} placeholder="e.g. Self-Awareness Profile" className={inputCls} />
        </div>

        <div>
          <label className="block text-stone-400 text-xs tracking-wide mb-1.5">Description *</label>
          <textarea value={form.description} onChange={setF('description')} rows={3}
            placeholder="What will this assessment help users discover?"
            className={inputCls + ' resize-none'} />
        </div>

        <div className="w-24">
          <label className="block text-stone-400 text-xs tracking-wide mb-1.5">Display Order</label>
          <input type="number" min={0} value={form.order} onChange={setF('order')} className={inputCls} />
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {questions.map((q, qi) => (
          <div key={q.id} className="bg-white rounded-none border border-stone-100 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-none flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                  style={{ background: color }}>
                  {qi + 1}
                </span>
                <span className="text-stone-400 text-xs">Question {qi + 1}</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => moveQuestion(qi, -1)} disabled={qi === 0}
                  className="text-stone-300 hover:text-stone-500 disabled:opacity-30 text-sm px-1">↑</button>
                <button onClick={() => moveQuestion(qi, 1)} disabled={qi === questions.length - 1}
                  className="text-stone-300 hover:text-stone-500 disabled:opacity-30 text-sm px-1">↓</button>
                <button onClick={() => removeQuestion(qi)} disabled={questions.length === 1}
                  className="text-red-300 hover:text-red-400 disabled:opacity-30 text-xs px-2">✕</button>
              </div>
            </div>

            {/* Question text */}
            <input type="text" value={q.text} onChange={e => updateQ(qi, { text: e.target.value })}
              placeholder="Enter your question…"
              className={inputCls} />

            {/* Type selector */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {qTypes.map(t => (
                <button key={t.value} type="button" onClick={() => updateQ(qi, { type: t.value })}
                  className={`p-2.5 rounded-none border text-left transition-all ${q.type === t.value ? 'border-2' : 'border-stone-200 hover:border-stone-300'}`}
                  style={q.type === t.value ? { borderColor: color, background: `${color}06` } : {}}>
                  <p className="text-xs font-medium" style={q.type === t.value ? { color } : { color: '#44403c' }}>{t.label}</p>
                  <p className="text-[10px] text-stone-400">{t.desc}</p>
                </button>
              ))}
            </div>

            {/* Options (for SINGLE / MULTIPLE) */}
            {(q.type === 'SINGLE' || q.type === 'MULTIPLE') && (
              <div className="space-y-2">
                {q.options.map((opt, oi) => (
                  <div key={oi} className="flex items-center gap-2">
                    <span className="text-stone-300 text-xs w-5 flex-shrink-0">{opt.value}.</span>
                    <input type="text" value={opt.label}
                      onChange={e => updateOption(qi, oi, e.target.value)}
                      placeholder={`Option ${oi + 1}`}
                      className="flex-1 border border-stone-200 rounded-none px-3 py-2 text-sm focus:outline-none focus:border-[#c71430]/50 placeholder:text-stone-300" />
                    <button onClick={() => removeOption(qi, oi)} disabled={q.options.length <= 2}
                      className="text-red-300 hover:text-red-400 disabled:opacity-30 text-xs w-5 flex-shrink-0">✕</button>
                  </div>
                ))}
                <button onClick={() => addOption(qi)}
                  className="text-xs text-[#c71430] hover:underline mt-1">+ Add option</button>
              </div>
            )}

            {q.type === 'SCALE' && (
              <div className="flex items-center gap-3 text-xs text-stone-400 bg-stone-50 rounded-none px-4 py-3">
                <span className="w-6 h-6 bg-white border border-stone-200 rounded-none flex items-center justify-center text-[#022269] font-medium">1</span>
                <div className="flex-1 h-1 bg-stone-200 rounded-none" />
                <span className="w-6 h-6 bg-white border border-stone-200 rounded-none flex items-center justify-center text-[#022269] font-medium">5</span>
                <span className="text-stone-300 ml-2 text-[10px]">Scale preview</span>
              </div>
            )}

            {q.type === 'TEXT' && (
              <div className="bg-stone-50 rounded-none px-4 py-3 text-xs text-stone-400">
                Free-text input — no options needed
              </div>
            )}

            {/* Required toggle */}
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => updateQ(qi, { required: !q.required })}
                className={`relative inline-flex h-5 w-9 items-center rounded-none transition-colors ${q.required ? 'bg-[#c71430]' : 'bg-stone-200'}`}>
                <span className="inline-block h-3.5 w-3.5 rounded-none bg-white shadow transition-transform"
                  style={{ transform: q.required ? 'translateX(18px)' : 'translateX(2px)' }} />
              </button>
              <span className="text-xs text-stone-400">Required</span>
            </div>
          </div>
        ))}

        {/* Add question */}
        <button onClick={() => setQuestions(qs => [...qs, blankQuestion()])}
          className="w-full border-2 border-dashed border-stone-200 hover:border-[#c71430]/40 text-stone-400 hover:text-[#c71430] rounded-none py-4 text-sm font-medium transition-all">
          + Add Question
        </button>
      </div>

      {/* Save */}
      <div className="flex items-center justify-between py-4">
        <p className="text-stone-400 text-sm">{questions.length} question{questions.length !== 1 ? 's' : ''}</p>
        <button onClick={handleSave} disabled={saving}
          className="bg-[#c71430] hover:bg-[#e8203c] disabled:opacity-50 text-white text-sm font-medium px-8 py-3 rounded-none transition-colors">
          {saving ? 'Saving…' : 'Publish Assessment'}
        </button>
      </div>
    </div>
  )
}
