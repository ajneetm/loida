'use client'

import { useState } from 'react'
import { Plus, Trash2, CalendarDays, MapPin } from 'lucide-react'

interface Workshop {
  id:       string
  title:    string
  date:     string | Date
  location: string | null
}

export default function WorkshopsManager({
  curriculumId,
  initialWorkshops,
}: {
  curriculumId:     string
  initialWorkshops: Workshop[]
}) {
  const [workshops, setWorkshops] = useState<Workshop[]>(initialWorkshops)
  const [form, setForm]           = useState({ title: '', date: '', location: '' })
  const [loading, setLoading]     = useState(false)
  const [deleting, setDeleting]   = useState<string | null>(null)
  const [error, setError]         = useState('')

  async function addWorkshop(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.title.trim() || !form.date) return setError('Title and date are required.')

    setLoading(true)
    const res = await fetch(`/api/curricula/${curriculumId}/workshops`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(form),
    })
    setLoading(false)

    if (res.ok) {
      const w = await res.json()
      setWorkshops(prev => [w, ...prev])
      setForm({ title: '', date: '', location: '' })
    } else {
      setError('Failed to add workshop.')
    }
  }

  async function deleteWorkshop(id: string) {
    if (!confirm('Delete this workshop?')) return
    setDeleting(id)
    await fetch(`/api/workshops/${id}`, { method: 'DELETE' })
    setWorkshops(prev => prev.filter(w => w.id !== id))
    setDeleting(null)
  }

  return (
    <div className="space-y-4">
      {/* Add form */}
      <div className="bg-white border border-[#E8E4DC]">
        <div className="px-5 py-4 border-b border-[#E8E4DC]">
          <h2 className="font-medium text-[#1C2B39]">Workshops</h2>
        </div>
        <form onSubmit={addWorkshop} className="px-5 py-4 space-y-3">
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <div className="flex gap-3 flex-wrap">
            <input
              type="text" placeholder="Workshop title" value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              className="flex-1 min-w-[160px] border border-[#E8E4DC] px-3 py-2 text-sm focus:outline-none focus:border-[#1C2B39]"
            />
            <input
              type="date" value={form.date}
              onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
              className="border border-[#E8E4DC] px-3 py-2 text-sm focus:outline-none focus:border-[#1C2B39]"
            />
            <input
              type="text" placeholder="Location (optional)" value={form.location}
              onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
              className="flex-1 min-w-[140px] border border-[#E8E4DC] px-3 py-2 text-sm focus:outline-none focus:border-[#1C2B39]"
            />
            <button type="submit" disabled={loading}
              className="flex items-center gap-2 bg-[#1C2B39] text-white px-4 py-2 text-sm hover:bg-[#2a3f52] transition-colors disabled:opacity-50">
              <Plus className="w-4 h-4" />
              {loading ? 'Adding…' : 'Add'}
            </button>
          </div>
        </form>
      </div>

      {/* List */}
      <div className="bg-white border border-[#E8E4DC] overflow-hidden">
        {workshops.length === 0 ? (
          <div className="p-12 text-center text-[#6B8F9E] text-sm">
            No workshops yet — add the first one above.
          </div>
        ) : (
          <div className="divide-y divide-[#E8E4DC]">
            {workshops.map(w => (
              <div key={w.id} className="flex items-center justify-between gap-4 px-5 py-4">
                <div className="min-w-0">
                  <p className="font-medium text-[#1C2B39] text-sm">{w.title}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-xs text-[#6B8F9E]">
                      <CalendarDays className="w-3 h-3" />
                      {new Date(w.date).toLocaleDateString()}
                    </span>
                    {w.location && (
                      <span className="flex items-center gap-1 text-xs text-[#6B8F9E]">
                        <MapPin className="w-3 h-3" />
                        {w.location}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => deleteWorkshop(w.id)}
                  disabled={deleting === w.id}
                  className="text-red-400 hover:text-red-600 transition-colors disabled:opacity-40 flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
