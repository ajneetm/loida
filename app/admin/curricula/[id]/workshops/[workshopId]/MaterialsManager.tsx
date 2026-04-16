'use client'

import { useState } from 'react'
import { Plus, Trash2, Image, Video, Link2, Code2, MonitorPlay } from 'lucide-react'

const TYPES = [
  { value: 'IMAGE', label: 'Image',  icon: Image },
  { value: 'VIDEO', label: 'Video',  icon: Video },
  { value: 'LINK',  label: 'Link',   icon: Link2 },
  { value: 'EMBED', label: 'Embed',  icon: MonitorPlay },
  { value: 'CODE',  label: 'Code',   icon: Code2 },
]

interface Material {
  id: string; type: string; title: string; content: string; language?: string | null
}

export default function MaterialsManager({
  workshopId,
  initialMaterials,
}: {
  workshopId:       string
  initialMaterials: Material[]
}) {
  const [materials, setMaterials] = useState<Material[]>(initialMaterials)
  const [type, setType]           = useState('LINK')
  const [form, setForm]           = useState({ title: '', content: '', language: '' })
  const [loading, setLoading]     = useState(false)
  const [deleting, setDeleting]   = useState<string | null>(null)
  const [error, setError]         = useState('')

  async function add(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.title.trim() || !form.content.trim()) return setError('Title and content are required.')

    setLoading(true)
    const res = await fetch(`/api/workshops/${workshopId}/materials`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ type, ...form }),
    })
    setLoading(false)
    if (res.ok) {
      const m = await res.json()
      setMaterials(prev => [...prev, m])
      setForm({ title: '', content: '', language: '' })
    } else {
      setError('Failed to add material.')
    }
  }

  async function remove(id: string) {
    if (!confirm('Delete this material?')) return
    setDeleting(id)
    await fetch(`/api/materials/${id}`, { method: 'DELETE' })
    setMaterials(prev => prev.filter(m => m.id !== id))
    setDeleting(null)
  }

  const contentPlaceholder: Record<string, string> = {
    IMAGE: 'https://... (image URL)',
    VIDEO: 'https://youtube.com/... or video URL',
    LINK:  'https://...',
    EMBED: '<iframe ...> embed code',
    CODE:  'Paste your code here',
  }

  return (
    <div className="space-y-3">
      <div className="bg-white border border-[#E8E4DC]">
        <div className="px-5 py-4 border-b border-[#E8E4DC]">
          <h2 className="font-medium text-[#1C2B39]">Materials</h2>
        </div>

        {/* Add form */}
        <form onSubmit={add} className="px-5 py-4 space-y-3">
          {error && <p className="text-red-500 text-xs">{error}</p>}

          {/* Type selector */}
          <div className="flex gap-2 flex-wrap">
            {TYPES.map(t => (
              <button key={t.value} type="button" onClick={() => setType(t.value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs border transition-colors ${
                  type === t.value
                    ? 'bg-[#1C2B39] text-white border-[#1C2B39]'
                    : 'border-[#E8E4DC] text-[#6B8F9E] hover:border-[#1C2B39] hover:text-[#1C2B39]'
                }`}>
                <t.icon className="w-3.5 h-3.5" />
                {t.label}
              </button>
            ))}
          </div>

          <input type="text" placeholder="Title" value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            className="w-full border border-[#E8E4DC] px-3 py-2 text-sm focus:outline-none focus:border-[#1C2B39]" />

          {type === 'CODE' ? (
            <>
              <input type="text" placeholder="Language (e.g. javascript, python)" value={form.language}
                onChange={e => setForm(f => ({ ...f, language: e.target.value }))}
                className="w-full border border-[#E8E4DC] px-3 py-2 text-sm focus:outline-none focus:border-[#1C2B39]" />
              <textarea rows={5} placeholder={contentPlaceholder[type]} value={form.content}
                onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                className="w-full border border-[#E8E4DC] px-3 py-2 text-sm focus:outline-none focus:border-[#1C2B39] font-mono resize-none" />
            </>
          ) : type === 'EMBED' ? (
            <textarea rows={3} placeholder={contentPlaceholder[type]} value={form.content}
              onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
              className="w-full border border-[#E8E4DC] px-3 py-2 text-sm focus:outline-none focus:border-[#1C2B39] font-mono resize-none" />
          ) : (
            <input type="text" placeholder={contentPlaceholder[type]} value={form.content}
              onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
              className="w-full border border-[#E8E4DC] px-3 py-2 text-sm focus:outline-none focus:border-[#1C2B39]" />
          )}

          <button type="submit" disabled={loading}
            className="flex items-center gap-2 bg-[#1C2B39] text-white px-4 py-2 text-sm hover:bg-[#2a3f52] transition-colors disabled:opacity-50">
            <Plus className="w-4 h-4" />
            {loading ? 'Adding…' : 'Add Material'}
          </button>
        </form>
      </div>

      {/* List */}
      {materials.length > 0 && (
        <div className="bg-white border border-[#E8E4DC] divide-y divide-[#E8E4DC]">
          {materials.map(m => {
            const TypeIcon = TYPES.find(t => t.value === m.type)?.icon ?? Link2
            return (
              <div key={m.id} className="flex items-start gap-4 px-5 py-4">
                <div className="w-8 h-8 bg-[#F8F7F4] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <TypeIcon className="w-4 h-4 text-[#6B8F9E]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[#1C2B39] text-sm">{m.title}</p>
                  <p className="text-xs text-[#6B8F9E] mt-0.5">{m.type}{m.language ? ` · ${m.language}` : ''}</p>
                  {m.type === 'IMAGE' && (
                    <img src={m.content} alt={m.title} className="mt-2 max-h-32 object-cover border border-[#E8E4DC]" />
                  )}
                  {m.type === 'CODE' && (
                    <pre className="mt-2 bg-[#F8F7F4] p-3 text-xs overflow-x-auto border border-[#E8E4DC] max-h-32">
                      {m.content.slice(0, 300)}{m.content.length > 300 ? '…' : ''}
                    </pre>
                  )}
                  {(m.type === 'LINK' || m.type === 'VIDEO') && (
                    <a href={m.content} target="_blank" rel="noopener noreferrer"
                      className="text-xs text-[#022269] hover:underline mt-1 block truncate">
                      {m.content}
                    </a>
                  )}
                </div>
                <button type="button" onClick={() => remove(m.id)} disabled={deleting === m.id}
                  className="text-red-400 hover:text-red-600 transition-colors disabled:opacity-40 flex-shrink-0">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
