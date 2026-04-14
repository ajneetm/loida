'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  coachId: string
  status:  string
}

export default function CoachActionButtons({ coachId, status }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState<'APPROVED' | 'REJECTED' | null>(null)

  const updateStatus = async (newStatus: 'APPROVED' | 'REJECTED') => {
    setLoading(newStatus)
    await fetch(`/api/admin/coaches/${coachId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    setLoading(null)
    router.refresh()
  }

  if (status === 'APPROVED') {
    return (
      <button
        onClick={() => updateStatus('REJECTED')}
        disabled={!!loading}
        className="text-xs border border-red-100 text-red-400 hover:bg-red-50 px-3 py-2 rounded-xl transition-colors disabled:opacity-50 flex-shrink-0"
      >
        Revoke
      </button>
    )
  }

  if (status === 'REJECTED') {
    return (
      <button
        onClick={() => updateStatus('APPROVED')}
        disabled={!!loading}
        className="text-xs border border-green-100 text-green-500 hover:bg-green-50 px-3 py-2 rounded-xl transition-colors disabled:opacity-50 flex-shrink-0"
      >
        Re-approve
      </button>
    )
  }

  return (
    <div className="flex gap-2 flex-shrink-0">
      <button
        onClick={() => updateStatus('REJECTED')}
        disabled={!!loading}
        className="text-xs border border-red-100 text-red-400 hover:bg-red-50 px-4 py-2 rounded-xl transition-colors disabled:opacity-50"
      >
        {loading === 'REJECTED' ? '…' : 'Reject'}
      </button>
      <button
        onClick={() => updateStatus('APPROVED')}
        disabled={!!loading}
        className="text-xs bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl transition-colors disabled:opacity-50 font-medium"
      >
        {loading === 'APPROVED' ? '…' : 'Approve'}
      </button>
    </div>
  )
}
