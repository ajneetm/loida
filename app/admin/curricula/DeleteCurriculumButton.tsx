'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'

export default function DeleteCurriculumButton({ id, name, count }: { id: string; name: string; count: number }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (count > 0) {
      alert(`Cannot delete "${name}" — it has ${count} accredited trainer${count !== 1 ? 's' : ''}. Remove accreditations first.`)
      return
    }
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return

    setLoading(true)
    await fetch(`/api/curricula/${id}`, { method: 'DELETE' })
    setLoading(false)
    router.refresh()
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className="text-red-400 hover:text-red-600 transition-colors disabled:opacity-40"
      title="Delete curriculum"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  )
}
