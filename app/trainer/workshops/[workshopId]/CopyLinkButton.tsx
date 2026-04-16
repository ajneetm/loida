'use client'

import { useState } from 'react'
import { Link2, Check } from 'lucide-react'

export default function CopyLinkButton({ workshopId }: { workshopId: string }) {
  const [copied, setCopied] = useState(false)

  function copy() {
    const url = `${window.location.origin}/register/${workshopId}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button type="button" onClick={copy}
      className="flex items-center gap-1.5 text-xs bg-[#1C2B39] text-white px-3 py-1.5 hover:bg-[#2a3f52] transition-colors w-fit">
      {copied ? <Check className="w-3.5 h-3.5" /> : <Link2 className="w-3.5 h-3.5" />}
      {copied ? 'Copied!' : 'Copy Registration Link'}
    </button>
  )
}
