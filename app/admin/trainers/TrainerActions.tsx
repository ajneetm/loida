'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, X, Trash2 } from 'lucide-react'
import { COUNTRIES } from '@/lib/countries'

// ── Per-row: Approve / Reject / Delete ─────────────────────────────────────

export function TrainerRowActions({
  trainerId, trainerName, canApprove,
}: {
  trainerId: string
  trainerName: string
  canApprove: boolean
}) {
  const router = useRouter()
  const [approving,    setApproving]    = useState<'APPROVE' | 'REJECT' | null>(null)
  const [deleteOpen,   setDeleteOpen]   = useState(false)
  const [deleting,     setDeleting]     = useState(false)
  const [deleteError,  setDeleteError]  = useState('')

  async function handleApproval(action: 'APPROVE' | 'REJECT') {
    setApproving(action)
    await fetch(`/api/trainers/${trainerId}/approve`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ action }),
    })
    setApproving(null)
    router.refresh()
  }

  async function handleDelete() {
    setDeleting(true)
    setDeleteError('')
    const res = await fetch(`/api/trainers/${trainerId}`, { method: 'DELETE' })
    setDeleting(false)
    if (res.ok) { setDeleteOpen(false); router.refresh() }
    else {
      const data = await res.json()
      setDeleteError(data.error || 'Something went wrong.')
    }
  }

  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      {canApprove && (
        <>
          <button onClick={() => handleApproval('APPROVE')} disabled={!!approving}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs transition-colors disabled:opacity-50">
            <Check className="w-3.5 h-3.5" />
            {approving === 'APPROVE' ? '…' : 'Approve'}
          </button>
          <button onClick={() => handleApproval('REJECT')} disabled={!!approving}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs transition-colors disabled:opacity-50">
            <X className="w-3.5 h-3.5" />
            {approving === 'REJECT' ? '…' : 'Reject'}
          </button>
        </>
      )}

      <button onClick={() => setDeleteOpen(true)}
        className="p-1.5 text-[#6B8F9E] hover:text-red-500 transition-colors">
        <Trash2 className="w-4 h-4" />
      </button>

      {deleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white w-full max-w-sm shadow-xl border border-[#E8E4DC]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E4DC]">
              <h2 className="font-semibold text-[#1C2B39]">Delete Trainer</h2>
              <button onClick={() => setDeleteOpen(false)} className="text-[#6B8F9E] hover:text-[#1C2B39]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              {deleteError && <div className="bg-red-50 text-red-600 text-sm p-3">{deleteError}</div>}
              <p className="text-sm text-[#1C2B39]">
                Are you sure you want to delete <span className="font-semibold">{trainerName}</span>?
                This will permanently remove their account.
              </p>
              <div className="flex gap-3 pt-1">
                <button onClick={() => setDeleteOpen(false)}
                  className="flex-1 border border-[#E8E4DC] text-[#1C2B39] py-2.5 text-sm hover:bg-[#F8F7F4] transition-colors">
                  Cancel
                </button>
                <button onClick={handleDelete} disabled={deleting}
                  className="flex-1 bg-red-500 text-white py-2.5 text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50">
                  {deleting ? 'Deleting…' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Page-level: Add Trainer button ─────────────────────────────────────────

const inp = 'w-full border border-[#E8E4DC] px-3 py-2 text-sm focus:outline-none focus:border-[#1C2B39] bg-white'

export function AddTrainerButton() {
  const router = useRouter()
  const [open,    setOpen]    = useState(false)
  const [form,    setForm]    = useState({ name: '', email: '', password: '', phone: '', nationality: '', residence: '' })
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)

  function set(k: string, v: string) { setForm(f => ({ ...f, [k]: v })) }
  function close() { setOpen(false); setForm({ name: '', email: '', password: '', phone: '', nationality: '', residence: '' }); setError('') }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const res = await fetch('/api/admin/trainers', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(form),
    })
    setLoading(false)
    if (res.ok) { close(); router.refresh() }
    else {
      const data = await res.json()
      setError(data.error || 'Something went wrong.')
    }
  }

  return (
    <>
      <button onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-[#1C2B39] text-white px-4 py-2 text-sm font-medium hover:bg-[#2a3f52] transition-colors">
        + Add Trainer
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white w-full max-w-sm shadow-xl border border-[#E8E4DC]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E4DC]">
              <h2 className="font-semibold text-[#1C2B39]">Add Trainer</h2>
              <button onClick={close} className="text-[#6B8F9E] hover:text-[#1C2B39]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-3">
              {error && <div className="bg-red-50 text-red-600 text-sm p-3">{error}</div>}
              <div className="space-y-1">
                <label className="text-sm font-medium text-[#1C2B39]">Full Name</label>
                <input required value={form.name} onChange={e => set('name', e.target.value)} className={inp} placeholder="John Smith" autoFocus />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-[#1C2B39]">Email</label>
                <input type="email" required value={form.email} onChange={e => set('email', e.target.value)} className={inp} placeholder="trainer@example.com" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-[#1C2B39]">Password</label>
                <input type="password" required minLength={8} value={form.password} onChange={e => set('password', e.target.value)} className={inp} placeholder="Min. 8 characters" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-[#1C2B39]">Phone</label>
                <input required value={form.phone} onChange={e => set('phone', e.target.value)} className={inp} placeholder="+974 5000 0000" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-[#1C2B39]">Nationality</label>
                  <select required value={form.nationality} onChange={e => set('nationality', e.target.value)} className={inp}>
                    <option value="">Select</option>
                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-[#1C2B39]">Residence</label>
                  <select required value={form.residence} onChange={e => set('residence', e.target.value)} className={inp}>
                    <option value="">Select</option>
                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-[#1C2B39] text-white py-2.5 text-sm font-medium hover:bg-[#2a3f52] transition-colors disabled:opacity-50 mt-2">
                {loading ? 'Creating…' : 'Create Trainer'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
