'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ProgramToggle({ programId, isPublished }: { programId: string; isPublished: boolean }) {
  const router = useRouter()
  const [pub, setPub]     = useState(isPublished)
  const [loading, setL]   = useState(false)

  const toggle = async () => {
    setL(true)
    const res = await fetch(`/api/programs/${programId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isPublished: !pub }),
    })
    if (res.ok) setPub(!pub)
    setL(false)
    router.refresh()
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors disabled:opacity-50 ${pub ? 'bg-green-500' : 'bg-stone-200'}`}
    >
      <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${pub ? 'translate-x-4.5' : 'translate-x-0.5'}`}
        style={{ transform: pub ? 'translateX(18px)' : 'translateX(2px)' }} />
    </button>
  )
}
