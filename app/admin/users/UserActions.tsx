'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, X } from 'lucide-react'

const ROLES = ['USER', 'ADMIN', 'COACH', 'TRAINER', 'INSTITUTION']

export function AddUserButton() {
  const router = useRouter()
  const [open, setOpen]   = useState(false)
  const [form, setForm]   = useState({ name: '', email: '', password: '', role: 'USER' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function set(k: string, v: string) { setForm(f => ({ ...f, [k]: v })) }

  function close() { setOpen(false); setForm({ name: '', email: '', password: '', role: 'USER' }); setError('') }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const res = await fetch('/api/users', {
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
        <Plus className="w-4 h-4" />
        Add User
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white w-full max-w-sm shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E4DC]">
              <h2 className="font-semibold text-[#1C2B39]">Add User</h2>
              <button onClick={close} className="text-[#6B8F9E] hover:text-[#1C2B39]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && <div className="bg-red-50 text-red-600 text-sm p-3">{error}</div>}
              <Field label="Full Name">
                <input type="text" required value={form.name} onChange={e => set('name', e.target.value)}
                  className={inp} placeholder="John Smith" autoFocus />
              </Field>
              <Field label="Email">
                <input type="email" required value={form.email} onChange={e => set('email', e.target.value)}
                  className={inp} placeholder="user@example.com" />
              </Field>
              <Field label="Password">
                <input type="password" required minLength={8} value={form.password} onChange={e => set('password', e.target.value)}
                  className={inp} placeholder="Min. 8 characters" />
              </Field>
              <Field label="Role">
                <select value={form.role} onChange={e => set('role', e.target.value)} className={inp}>
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </Field>
              <button type="submit" disabled={loading}
                className="w-full bg-[#1C2B39] text-white py-2.5 text-sm font-medium hover:bg-[#2a3f52] transition-colors disabled:opacity-50">
                {loading ? 'Creating…' : 'Create User'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export function DeleteUserButton({ userId, userName }: { userId: string; userName?: string }) {
  const router = useRouter()
  const [open, setOpen]       = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  async function handleDelete() {
    setLoading(true)
    setError('')
    const res = await fetch(`/api/users/${userId}`, { method: 'DELETE' })
    setLoading(false)
    if (res.ok) {
      setOpen(false)
      router.refresh()
    } else {
      const data = await res.json()
      setError(data.error || 'Something went wrong.')
    }
  }

  return (
    <>
      <button onClick={() => setOpen(true)}
        className="p-1.5 text-[#6B8F9E] hover:text-red-500 transition-colors">
        <Trash2 className="w-4 h-4" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white w-full max-w-sm shadow-xl border border-[#E8E4DC]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E4DC]">
              <h2 className="font-semibold text-[#1C2B39]">Delete User</h2>
              <button onClick={() => setOpen(false)} className="text-[#6B8F9E] hover:text-[#1C2B39]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              {error && <div className="bg-red-50 text-red-600 text-sm p-3">{error}</div>}
              <p className="text-sm text-[#1C2B39]">
                Are you sure you want to delete{' '}
                <span className="font-semibold">{userName ?? 'this user'}</span>?
                This action cannot be undone.
              </p>
              <div className="flex gap-3 pt-1">
                <button onClick={() => setOpen(false)}
                  className="flex-1 border border-[#E8E4DC] text-[#1C2B39] py-2.5 text-sm hover:bg-[#F8F7F4] transition-colors">
                  Cancel
                </button>
                <button onClick={handleDelete} disabled={loading}
                  className="flex-1 bg-red-500 text-white py-2.5 text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50">
                  {loading ? 'Deleting…' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

const inp = 'w-full border border-[#E8E4DC] px-3 py-2 text-sm focus:outline-none focus:border-[#1C2B39]'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-[#1C2B39]">{label}</label>
      {children}
    </div>
  )
}
