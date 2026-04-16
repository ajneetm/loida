'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, X, Award } from 'lucide-react'

export default function CertificateActions({ requestId, status }: { requestId: string; status: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  async function handle(action: 'APPROVED' | 'REJECTED' | 'ISSUED') {
    setLoading(action)
    await fetch(`/api/certificates/${requestId}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ status: action }),
    })
    setLoading(null)
    router.refresh()
  }

  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      {status === 'PENDING' && (
        <>
          <button onClick={() => handle('APPROVED')} disabled={!!loading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs transition-colors disabled:opacity-50">
            <Check className="w-3.5 h-3.5" />
            {loading === 'APPROVED' ? '…' : 'Approve'}
          </button>
          <button onClick={() => handle('REJECTED')} disabled={!!loading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs transition-colors disabled:opacity-50">
            <X className="w-3.5 h-3.5" />
            {loading === 'REJECTED' ? '…' : 'Reject'}
          </button>
        </>
      )}
      {status === 'APPROVED' && (
        <button onClick={() => handle('ISSUED')} disabled={!!loading}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs transition-colors disabled:opacity-50">
          <Award className="w-3.5 h-3.5" />
          {loading === 'ISSUED' ? '…' : 'Mark as Issued'}
        </button>
      )}
    </div>
  )
}
