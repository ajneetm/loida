'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, X } from 'lucide-react'

export default function ApprovalActions({ trainerId }: { trainerId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState<'APPROVE' | 'REJECT' | null>(null)

  async function handle(action: 'APPROVE' | 'REJECT') {
    setLoading(action)
    await fetch(`/api/trainers/${trainerId}/approve`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ action }),
    })
    setLoading(null)
    router.refresh()
  }

  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      <button onClick={() => handle('APPROVE')} disabled={!!loading}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs rounded-none transition-colors disabled:opacity-50">
        <Check className="w-3.5 h-3.5" />
        {loading === 'APPROVE' ? '…' : 'Approve'}
      </button>
      <button onClick={() => handle('REJECT')} disabled={!!loading}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs rounded-none transition-colors disabled:opacity-50">
        <X className="w-3.5 h-3.5" />
        {loading === 'REJECT' ? '…' : 'Reject'}
      </button>
    </div>
  )
}
