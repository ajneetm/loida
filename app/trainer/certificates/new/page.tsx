import { redirect } from 'next/navigation'

export default function Page() {
  redirect('/trainer/certificates')
}

// ↓ dead code kept only to satisfy module shape — remove if unused
import type { } from 'react'

interface Curriculum { id: string; name: string; domain: string }
interface Trainee    { name: string; email: string }

export default function NewCertificateRequestPage() {
  const router = useRouter()
  const [curricula, setCurricula] = useState<Curriculum[]>([])
  const [curriculumId, setCurriculumId] = useState('')
  const [workshopDate, setWorkshopDate] = useState('')
  const [notes, setNotes]               = useState('')
  const [trainees, setTrainees]         = useState<Trainee[]>([{ name: '', email: '' }])
  const [error, setError]               = useState('')
  const [loading, setLoading]           = useState(false)
  const [success, setSuccess]           = useState(false)

  useEffect(() => {
    fetch('/api/certificates/curricula')
      .then(r => r.json())
      .then(data => {
        setCurricula(data)
        if (data.length > 0) setCurriculumId(data[0].id)
      })
  }, [])

  function addRow() {
    setTrainees(t => [...t, { name: '', email: '' }])
  }

  function removeRow(i: number) {
    setTrainees(t => t.filter((_, idx) => idx !== i))
  }

  function updateRow(i: number, field: 'name' | 'email', value: string) {
    setTrainees(t => t.map((row, idx) => idx === i ? { ...row, [field]: value } : row))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const filled = trainees.filter(t => t.name.trim() || t.email.trim())
    if (filled.length === 0) return setError('Add at least one trainee.')
    const invalid = filled.find(t => !t.name.trim() || !t.email.trim())
    if (invalid) return setError('Each trainee needs a name and email.')
    if (!workshopDate) return setError('Workshop date is required.')

    setLoading(true)
    const res = await fetch('/api/certificates', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ curriculumId, workshopDate, notes, trainees: filled }),
    })
    setLoading(false)

    if (res.ok) {
      setSuccess(true)
    } else {
      const data = await res.json()
      setError(data.error || 'Something went wrong.')
    }
  }

  function reset() {
    setTrainees([{ name: '', email: '' }])
    setWorkshopDate('')
    setNotes('')
    setError('')
    setSuccess(false)
  }

  if (success) {
    return (
      <div className="max-w-md mx-auto mt-16 bg-white border border-[#E8E4DC] p-8 text-center space-y-4">
        <div className="w-12 h-12 bg-green-100 flex items-center justify-center mx-auto">
          <span className="text-green-600 text-xl">✓</span>
        </div>
        <h2 className="text-xl font-semibold text-[#1C2B39]">Requests Submitted</h2>
        <p className="text-sm text-[#6B8F9E]">
          {trainees.filter(t => t.name).length} trainee{trainees.filter(t => t.name).length !== 1 ? 's' : ''} submitted for review.
        </p>
        <div className="flex gap-3 justify-center pt-2">
          <button type="button" onClick={() => router.push('/trainer/certificates')}
            className="px-4 py-2 bg-[#1C2B39] text-white text-sm hover:bg-[#2a3f52] transition-colors">
            View All Requests
          </button>
          <button type="button" onClick={reset}
            className="px-4 py-2 border border-[#E8E4DC] text-[#1C2B39] text-sm hover:bg-[#F8F7F4] transition-colors">
            New Batch
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#1C2B39]">New Certificate Request</h1>
        <p className="text-sm text-[#6B8F9E] mt-1">Add all trainees who completed the same workshop</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <div className="bg-red-50 text-red-600 text-sm p-3 border border-red-100">{error}</div>}

        {/* Workshop info */}
        <div className="bg-white border border-[#E8E4DC] p-5 space-y-4">
          <h2 className="font-medium text-[#1C2B39] text-sm">Workshop Details</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Curriculum">
              {curricula.length === 0 ? (
                <p className="text-sm text-[#6B8F9E] py-2">Loading…</p>
              ) : (
                <select value={curriculumId} onChange={e => setCurriculumId(e.target.value)}
                  className="w-full border border-[#E8E4DC] px-3 py-2 text-sm focus:outline-none focus:border-[#1C2B39] bg-white">
                  {curricula.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              )}
            </Field>

            <Field label="Workshop Date">
              <input type="date" required value={workshopDate}
                onChange={e => setWorkshopDate(e.target.value)}
                className="w-full border border-[#E8E4DC] px-3 py-2 text-sm focus:outline-none focus:border-[#1C2B39]" />
            </Field>
          </div>

          <Field label="Notes (optional)">
            <textarea value={notes} rows={2} onChange={e => setNotes(e.target.value)}
              className="w-full border border-[#E8E4DC] px-3 py-2 text-sm focus:outline-none focus:border-[#1C2B39] resize-none"
              placeholder="Any additional information…" />
          </Field>
        </div>

        {/* Trainees table */}
        <div className="bg-white border border-[#E8E4DC] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E8E4DC] flex items-center justify-between">
            <h2 className="font-medium text-[#1C2B39] text-sm">Trainees <span className="text-[#6B8F9E] font-normal">({trainees.length})</span></h2>
            <button type="button" onClick={addRow}
              className="flex items-center gap-1.5 text-xs bg-[#1C2B39] text-white px-3 py-1.5 hover:bg-[#2a3f52] transition-colors">
              <Plus className="w-3.5 h-3.5" />
              Add Row
            </button>
          </div>

          <div className="divide-y divide-[#E8E4DC]">
            {trainees.map((trainee, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-3">
                <span className="text-xs text-[#6B8F9E] w-5 flex-shrink-0 text-center">{i + 1}</span>
                <input
                  type="text" placeholder="Full Name" value={trainee.name}
                  onChange={e => updateRow(i, 'name', e.target.value)}
                  className="flex-1 border border-[#E8E4DC] px-3 py-1.5 text-sm focus:outline-none focus:border-[#1C2B39]"
                />
                <input
                  type="email" placeholder="Email Address" value={trainee.email}
                  onChange={e => updateRow(i, 'email', e.target.value)}
                  className="flex-1 border border-[#E8E4DC] px-3 py-1.5 text-sm focus:outline-none focus:border-[#1C2B39]"
                />
                {trainees.length > 1 && (
                  <button type="button" onClick={() => removeRow(i)}
                    className="text-red-400 hover:text-red-600 transition-colors flex-shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="px-5 py-3 border-t border-[#E8E4DC] bg-[#F8F7F4]">
            <button type="button" onClick={addRow}
              className="text-sm text-[#6B8F9E] hover:text-[#1C2B39] flex items-center gap-1.5 transition-colors">
              <Plus className="w-3.5 h-3.5" />
              Add another trainee
            </button>
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="w-full bg-[#1C2B39] text-white py-3 text-sm font-medium hover:bg-[#2a3f52] transition-colors disabled:opacity-50">
          {loading ? 'Submitting…' : `Submit ${trainees.filter(t => t.name).length || ''} Request${trainees.filter(t => t.name).length !== 1 ? 's' : ''}`}
        </button>
      </form>
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
