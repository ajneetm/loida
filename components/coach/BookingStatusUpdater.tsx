'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  bookingId:     string
  currentStatus: string
}

const transitions: Record<string, { label: string; next: string; color: string }[]> = {
  PENDING:   [
    { label: 'Confirm',  next: 'CONFIRMED', color: 'bg-green-500 text-white hover:bg-green-600' },
    { label: 'Decline',  next: 'CANCELLED', color: 'bg-red-50 text-red-400 border border-red-100 hover:bg-red-100' },
  ],
  CONFIRMED: [
    { label: 'Complete', next: 'COMPLETED', color: 'bg-[#0A1628] text-white hover:bg-[#1A2B4A]' },
    { label: 'Cancel',   next: 'CANCELLED', color: 'bg-red-50 text-red-400 border border-red-100 hover:bg-red-100' },
  ],
  COMPLETED: [],
  CANCELLED: [],
}

export default function BookingStatusUpdater({ bookingId, currentStatus }: Props) {
  const router  = useRouter()
  const [busy, setBusy] = useState(false)

  const actions = transitions[currentStatus] ?? []
  if (actions.length === 0) return null

  const update = async (next: string) => {
    setBusy(true)
    await fetch(`/api/bookings/${bookingId}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ status: next }),
    })
    setBusy(false)
    router.refresh()
  }

  return (
    <div className="flex gap-2">
      {actions.map(a => (
        <button
          key={a.next}
          onClick={() => update(a.next)}
          disabled={busy}
          className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 ${a.color}`}
        >
          {busy ? '…' : a.label}
        </button>
      ))}
    </div>
  )
}
