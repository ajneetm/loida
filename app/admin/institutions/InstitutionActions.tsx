'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, X } from 'lucide-react'

export default function InstitutionActions({ institutionId }: { institutionId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  async function handle(status: 'APPROVED' | 'REJECTED') {
    setLoading(status)
    await fetch(`/api/institutions/${institutionId}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ approvalStatus: status }),
    })
    setLoading(null)
    router.refresh()
  }

  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      <button onClick={() => handle('APPROVED')} disabled={!!loading}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs transition-colors disabled:opacity-50">
        <Check className="w-3.5 h-3.5" />
        {loading === 'APPROVED' ? '…' : 'Approve'}
      </button>
      <button onClick={() => handle('REJECTED')} disabled={!!loading}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs transition-colors disabled:opacity-50">
        <X className="w-3.5 h-3.5" />
        {loading === 'REJECTED' ? '…' : 'Reject'}
      </button>
    </div>
  )
}
