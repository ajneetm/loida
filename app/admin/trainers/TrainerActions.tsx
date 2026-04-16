'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Check, X, Trash2, BookOpen, Plus } from 'lucide-react'
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

// ── Per-row: Manage Accreditations (curricula) ──────────────────────────────

type Accreditation = { id: string; status: string; curriculum: { id: string; name: string; domain: string } }
type Curriculum    = { id: string; name: string; domain: string }

export function AccreditationButton({
  trainerId, trainerName, approvalStatus,
}: {
  trainerId:      string
  trainerName:    string
  approvalStatus: string
}) {
  const router = useRouter()
  const [open,          setOpen]          = useState(false)
  const [accreditations, setAccreditations] = useState<Accreditation[]>([])
  const [curricula,     setCurricula]     = useState<Curriculum[]>([])
  const [selectedId,    setSelectedId]    = useState('')
  const [adding,        setAdding]        = useState(false)
  const [revoking,      setRevoking]      = useState<string | null>(null)
  const [error,         setError]         = useState('')
  const [loading,       setLoading]       = useState(false)

  async function openModal() {
    setOpen(true)
    setError('')
    setLoading(true)
    const [accRes, curRes] = await Promise.all([
      fetch(`/api/trainers/${trainerId}/accreditations`),
      fetch('/api/curricula'),
    ])
    const [accData, curData] = await Promise.all([accRes.json(), curRes.json()])
    setAccreditations(Array.isArray(accData) ? accData : [])
    setCurricula(Array.isArray(curData) ? curData : [])
    setLoading(false)
  }

  async function handleAdd() {
    if (!selectedId) return
    setAdding(true)
    setError('')
    const res = await fetch(`/api/trainers/${trainerId}/accreditations`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ curriculumId: selectedId }),
    })
    setAdding(false)
    if (res.ok) {
      const newAcc = await res.json()
      setAccreditations(p => {
        const idx = p.findIndex(a => a.id === newAcc.id)
        return idx >= 0 ? p.map((a, i) => i === idx ? newAcc : a) : [...p, newAcc]
      })
      setSelectedId('')
      router.refresh()
    } else {
      const data = await res.json()
      setError(data.error || 'Failed to add curriculum.')
    }
  }

  async function handleRevoke(accId: string) {
    setRevoking(accId)
    const res = await fetch(`/api/trainers/${trainerId}/accreditations/${accId}`, { method: 'DELETE' })
    setRevoking(null)
    if (res.ok) {
      setAccreditations(p => p.map(a => a.id === accId ? { ...a, status: 'REVOKED' } : a))
      router.refresh()
    }
  }

  const pending  = accreditations.filter(a => a.status === 'PENDING')
  const active   = accreditations.filter(a => a.status === 'ACTIVE')
  const revoked  = accreditations.filter(a => a.status === 'REVOKED' || a.status === 'SUSPENDED')
  const assigned = new Set(accreditations.filter(a => a.status !== 'REVOKED' && a.status !== 'SUSPENDED').map(a => a.curriculum.id))
  const available = curricula.filter(c => !assigned.has(c.id))

  async function handleStatusChange(accId: string, status: string) {
    setRevoking(accId)
    const res = await fetch(`/api/trainers/${trainerId}/accreditations/${accId}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ status }),
    })
    setRevoking(null)
    if (res.ok) {
      const updated = await res.json()
      setAccreditations(p => p.map(a => a.id === accId ? updated : a))
      router.refresh()
    }
  }

  const domainColor: Record<string, string> = {
    HARMONY:  'bg-purple-50 text-purple-700 border-purple-200',
    CAREER:   'bg-blue-50 text-blue-700 border-blue-200',
    BUSINESS: 'bg-amber-50 text-amber-700 border-amber-200',
  }

  return (
    <>
      <button
        onClick={openModal}
        title="Manage curricula"
        className={`flex items-center gap-1.5 px-2.5 py-1.5 border text-xs transition-colors ${
          approvalStatus !== 'APPROVED'
            ? 'border-[#E8E4DC] text-[#6B8F9E] cursor-not-allowed opacity-50'
            : active.length > 0
            ? 'border-[#1C2B39] text-[#1C2B39] hover:bg-[#1C2B39] hover:text-white'
            : 'border-[#E8E4DC] text-[#6B8F9E] hover:border-[#1C2B39] hover:text-[#1C2B39]'
        }`}
        disabled={approvalStatus !== 'APPROVED'}
      >
        <BookOpen className="w-3.5 h-3.5" />
        {active.length > 0 ? `${active.length} curricul${active.length === 1 ? 'um' : 'a'}` : 'No curricula'}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white w-full max-w-md shadow-xl border border-[#E8E4DC]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E4DC]">
              <div>
                <h2 className="font-semibold text-[#1C2B39]">Curricula — {trainerName}</h2>
                <p className="text-xs text-[#6B8F9E] mt-0.5">Manage which curricula this trainer is accredited for</p>
              </div>
              <button onClick={() => setOpen(false)} className="text-[#6B8F9E] hover:text-[#1C2B39]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {error && <div className="bg-red-50 text-red-600 text-sm p-3">{error}</div>}

              {loading ? (
                <p className="text-sm text-[#6B8F9E] text-center py-4">Loading…</p>
              ) : (
                <>
                  {/* Requested (PENDING) — trainer selected at registration */}
                  {pending.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-amber-600 uppercase tracking-widest mb-2">Requested by Trainer</p>
                      <div className="space-y-2">
                        {pending.map(acc => (
                          <div key={acc.id} className="flex items-center justify-between gap-3 px-3 py-2 bg-amber-50 border border-amber-200">
                            <div className="flex items-center gap-2">
                              <span className={`text-[10px] px-1.5 py-0.5 border font-medium ${domainColor[acc.curriculum.domain] ?? 'bg-stone-50 text-stone-500 border-stone-200'}`}>
                                {acc.curriculum.domain}
                              </span>
                              <span className="text-sm text-[#1C2B39] font-medium">{acc.curriculum.name}</span>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleStatusChange(acc.id, 'ACTIVE')}
                                disabled={revoking === acc.id}
                                className="text-green-600 hover:text-green-700 text-xs font-medium transition-colors disabled:opacity-40"
                              >
                                {revoking === acc.id ? '…' : 'Activate'}
                              </button>
                              <button
                                onClick={() => handleStatusChange(acc.id, 'REVOKED')}
                                disabled={revoking === acc.id}
                                className="text-red-500 hover:text-red-600 text-xs transition-colors disabled:opacity-40"
                              >
                                Decline
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Active accreditations */}
                  <div>
                    <p className="text-xs font-semibold text-[#6B8F9E] uppercase tracking-widest mb-2">Active</p>
                    {active.length === 0 ? (
                      <p className="text-sm text-[#6B8F9E]">No curricula assigned yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {active.map(acc => (
                          <div key={acc.id} className="flex items-center justify-between gap-3 px-3 py-2 bg-[#F8F7F4] border border-[#E8E4DC]">
                            <div className="flex items-center gap-2">
                              <span className={`text-[10px] px-1.5 py-0.5 border font-medium ${domainColor[acc.curriculum.domain] ?? 'bg-stone-50 text-stone-500 border-stone-200'}`}>
                                {acc.curriculum.domain}
                              </span>
                              <span className="text-sm text-[#1C2B39] font-medium">{acc.curriculum.name}</span>
                            </div>
                            <button
                              onClick={() => handleStatusChange(acc.id, 'REVOKED')}
                              disabled={revoking === acc.id}
                              className="text-[#6B8F9E] hover:text-red-500 text-xs transition-colors disabled:opacity-40"
                            >
                              {revoking === acc.id ? '…' : 'Revoke'}
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Add curriculum manually */}
                  {available.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-[#6B8F9E] uppercase tracking-widest mb-2">Add Curriculum</p>
                      <div className="flex gap-2">
                        <select
                          value={selectedId}
                          onChange={e => setSelectedId(e.target.value)}
                          className="flex-1 border border-[#E8E4DC] px-3 py-2 text-sm focus:outline-none focus:border-[#1C2B39] bg-white"
                        >
                          <option value="">Select curriculum…</option>
                          {available.map(c => (
                            <option key={c.id} value={c.id}>{c.name} ({c.domain})</option>
                          ))}
                        </select>
                        <button
                          onClick={handleAdd}
                          disabled={!selectedId || adding}
                          className="flex items-center gap-1.5 px-4 py-2 bg-[#1C2B39] text-white text-sm font-medium hover:bg-[#2a3f52] transition-colors disabled:opacity-50"
                        >
                          <Plus className="w-4 h-4" />
                          {adding ? '…' : 'Add'}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Revoked */}
                  {revoked.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-[#6B8F9E] uppercase tracking-widest mb-2">Revoked</p>
                      <div className="space-y-1">
                        {revoked.map(acc => (
                          <div key={acc.id} className="flex items-center justify-between gap-3 px-3 py-2 opacity-50">
                            <span className="text-sm text-[#1C2B39] line-through">{acc.curriculum.name}</span>
                            <button
                              onClick={() => handleStatusChange(acc.id, 'ACTIVE')}
                              disabled={revoking === acc.id}
                              className="text-green-600 hover:text-green-700 text-xs transition-colors disabled:opacity-40"
                            >
                              {revoking === acc.id ? '…' : 'Restore'}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
