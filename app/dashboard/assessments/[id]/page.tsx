'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getDomainColor, getDomainLabel } from '@/lib/utils'

interface Question {
  id: string
  text: string
  type: 'SINGLE' | 'MULTIPLE' | 'SCALE' | 'TEXT'
  options?: { value: string; label: string }[]
  required?: boolean
}

interface Assessment {
  id: string
  title: string
  description: string
  domain: string
  questions: Question[]
}

export default function TakeAssessmentPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [assessment, setAssessment] = useState<Assessment | null>(null)
  const [answers, setAnswers]       = useState<Record<string, any>>({})
  const [current, setCurrent]       = useState(0)
  const [loading, setLoading]       = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]           = useState('')

  useEffect(() => {
    fetch(`/api/assessments/${params.id}`)
      .then(r => r.json())
      .then(data => { setAssessment(data); setLoading(false) })
      .catch(() => { setError('Failed to load assessment.'); setLoading(false) })
  }, [params.id])

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-stone-400 text-sm animate-pulse">Loading assessment…</div>
    </div>
  )

  if (error || !assessment) return (
    <div className="text-center py-20">
      <p className="text-red-400 text-sm">{error || 'Assessment not found.'}</p>
    </div>
  )

  const questions = assessment.questions
  const q         = questions[current]
  const progress  = Math.round(((current) / questions.length) * 100)
  const color     = getDomainColor(assessment.domain)

  const setAnswer = (val: any) => {
    setAnswers(prev => ({ ...prev, [q.id]: val }))
  }

  const toggleMultiple = (val: string) => {
    const curr = (answers[q.id] as string[]) ?? []
    setAnswers(prev => ({
      ...prev,
      [q.id]: curr.includes(val) ? curr.filter(v => v !== val) : [...curr, val],
    }))
  }

  const canNext = !q.required || answers[q.id] !== undefined

  const handleNext = () => {
    if (current < questions.length - 1) { setCurrent(c => c + 1) }
  }

  const handleBack = () => {
    if (current > 0) setCurrent(c => c - 1)
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      const res = await fetch(`/api/assessments/${assessment.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      })
      if (!res.ok) { setError('Submission failed. Please try again.'); setSubmitting(false); return }
      router.push('/dashboard/assessments?completed=1')
    } catch {
      setError('Something went wrong.')
      setSubmitting(false)
    }
  }

  const isLast = current === questions.length - 1

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] font-medium px-2.5 py-1 rounded-full"
            style={{ background: `${color}15`, color }}>
            {getDomainLabel(assessment.domain)}
          </span>
          <span className="text-stone-400 text-xs">Question {current + 1} of {questions.length}</span>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, background: color }}
          />
        </div>
      </div>

      {/* Question card */}
      <div className="bg-white rounded-2xl border border-stone-100 p-8 min-h-[320px] flex flex-col">
        <h2 className="font-display text-2xl text-[#0A1628] font-light leading-snug mb-8">
          {q.text}
        </h2>

        <div className="flex-1">
          {/* Single choice */}
          {q.type === 'SINGLE' && q.options && (
            <div className="space-y-3">
              {q.options.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setAnswer(opt.value)}
                  className={`w-full text-left px-5 py-3.5 rounded-xl border text-sm transition-all ${
                    answers[q.id] === opt.value
                      ? 'border-2 font-medium'
                      : 'border-stone-200 text-stone-600 hover:border-stone-300'
                  }`}
                  style={answers[q.id] === opt.value
                    ? { borderColor: color, color, background: `${color}08` }
                    : {}}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {/* Multiple choice */}
          {q.type === 'MULTIPLE' && q.options && (
            <div className="space-y-3">
              <p className="text-stone-400 text-xs mb-4">Select all that apply</p>
              {q.options.map(opt => {
                const selected = ((answers[q.id] as string[]) ?? []).includes(opt.value)
                return (
                  <button
                    key={opt.value}
                    onClick={() => toggleMultiple(opt.value)}
                    className={`w-full text-left px-5 py-3.5 rounded-xl border text-sm transition-all flex items-center gap-3 ${
                      selected ? 'border-2 font-medium' : 'border-stone-200 text-stone-600 hover:border-stone-300'
                    }`}
                    style={selected ? { borderColor: color, color, background: `${color}08` } : {}}
                  >
                    <span className={`w-4 h-4 rounded border flex items-center justify-center text-[10px] flex-shrink-0 transition-colors ${selected ? 'text-white' : 'border-stone-300'}`}
                      style={selected ? { background: color, borderColor: color } : {}}>
                      {selected && '✓'}
                    </span>
                    {opt.label}
                  </button>
                )
              })}
            </div>
          )}

          {/* Scale */}
          {q.type === 'SCALE' && q.options && (
            <div>
              <div className="flex gap-3 mb-4 flex-wrap">
                {[1, 2, 3, 4, 5].map(n => (
                  <button
                    key={n}
                    onClick={() => setAnswer(String(n))}
                    className={`w-12 h-12 rounded-xl border-2 text-sm font-medium transition-all ${
                      answers[q.id] === String(n) ? 'text-white' : 'border-stone-200 text-stone-500 hover:border-stone-400'
                    }`}
                    style={answers[q.id] === String(n) ? { background: color, borderColor: color } : {}}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-xs text-stone-400">
                <span>{q.options[0]?.label}</span>
                <span>{q.options[q.options.length - 1]?.label}</span>
              </div>
            </div>
          )}

          {/* Text */}
          {q.type === 'TEXT' && (
            <textarea
              value={answers[q.id] ?? ''}
              onChange={e => setAnswer(e.target.value)}
              rows={4}
              placeholder="Type your answer here…"
              className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm text-[#0A1628] focus:outline-none resize-none placeholder:text-stone-300"
              style={{ borderColor: answers[q.id] ? `${color}50` : undefined }}
            />
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-stone-50">
          <button
            onClick={handleBack}
            disabled={current === 0}
            className="text-stone-400 hover:text-stone-600 disabled:opacity-30 text-sm transition-colors"
          >
            ← Back
          </button>

          {error && <p className="text-red-400 text-xs">{error}</p>}

          {isLast ? (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="text-white text-sm font-medium px-6 py-2.5 rounded-full transition-colors disabled:opacity-50"
              style={{ background: color }}
            >
              {submitting ? 'Submitting…' : 'Submit Assessment →'}
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!canNext}
              className="text-white text-sm font-medium px-6 py-2.5 rounded-full transition-all disabled:opacity-40"
              style={{ background: color }}
            >
              Next →
            </button>
          )}
        </div>
      </div>

      {/* Question dots */}
      <div className="flex justify-center gap-1.5 mt-5 flex-wrap">
        {questions.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="w-2 h-2 rounded-full transition-all"
            style={{
              background: i === current ? color : answers[questions[i].id] ? `${color}50` : '#e7e5e4',
              width: i === current ? '24px' : '8px',
            }}
          />
        ))}
      </div>
    </div>
  )
}
