'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MailOpen, Mail, Trash2, X } from 'lucide-react'

export default function MessageActions({ messageId, status }: { messageId: string; status: string }) {
  const router = useRouter()
  const [loading,     setLoading]     = useState(false)
  const [deleteOpen,  setDeleteOpen]  = useState(false)
  const [deleting,    setDeleting]    = useState(false)

  async function toggleRead() {
    setLoading(true)
    const next = status === 'UNREAD' ? 'READ' : 'UNREAD'
    await fetch(`/api/admin/messages/${messageId}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ status: next }),
    })
    setLoading(false)
    router.refresh()
  }

  async function handleDelete() {
    setDeleting(true)
    await fetch(`/api/admin/messages/${messageId}`, { method: 'DELETE' })
    setDeleting(false)
    setDeleteOpen(false)
    router.refresh()
  }

  return (
    <div className="flex items-center gap-1.5 flex-shrink-0">
      <button
        onClick={toggleRead}
        disabled={loading}
        title={status === 'UNREAD' ? 'Mark as read' : 'Mark as unread'}
        className="p-1.5 text-[#6B8F9E] hover:text-[#1C2B39] transition-colors disabled:opacity-40"
      >
        {status === 'UNREAD' ? <MailOpen className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
      </button>

      <button
        onClick={() => setDeleteOpen(true)}
        title="Delete"
        className="p-1.5 text-[#6B8F9E] hover:text-red-500 transition-colors"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      {deleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white w-full max-w-sm shadow-xl border border-[#E8E4DC]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E4DC]">
              <h2 className="font-semibold text-[#1C2B39]">Delete Message</h2>
              <button onClick={() => setDeleteOpen(false)} className="text-[#6B8F9E] hover:text-[#1C2B39]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <p className="text-sm text-[#1C2B39]">Are you sure you want to delete this message? This cannot be undone.</p>
              <div className="flex gap-3">
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
