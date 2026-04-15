'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getDomainColor } from '@/lib/utils'

interface Rec {
  type:        'assessment' | 'program' | 'platform'
  domain:      string
  title:       string
  description: string
  href:        string
  priority:    number
}

const typeIcon: Record<string, string> = {
  assessment: '◎',
  program:    '◈',
  platform:   '◉',
}

export default function RecommendationsWidget() {
  const [recs,    setRecs]    = useState<Rec[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/recommendations')
      .then(r => r.json())
      .then(d => { setRecs(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="bg-white rounded-none border border-stone-100 p-6">
      <div className="h-4 w-32 bg-stone-100 rounded animate-pulse mb-4" />
      <div className="space-y-3">
        {[1,2,3].map(i => <div key={i} className="h-14 bg-stone-50 rounded-none animate-pulse" />)}
      </div>
    </div>
  )

  if (recs.length === 0) return null

  return (
    <div className="bg-white rounded-none border border-stone-100 p-6">
      <div className="flex items-center gap-2 mb-5">
        <span className="text-[#c71430] text-sm">✦</span>
        <h3 className="font-display text-lg text-[#022269]">Recommended for You</h3>
      </div>

      <div className="space-y-3">
        {recs.map((rec, i) => {
          const color = getDomainColor(rec.domain)
          return (
            <Link key={i} href={rec.href}
              className="flex items-start gap-3 p-3.5 rounded-none border border-stone-100 hover:border-stone-200 hover:bg-stone-50/50 transition-all group">
              <div className="w-8 h-8 rounded-none flex items-center justify-center text-sm flex-shrink-0"
                style={{ background: `${color}15`, color }}>
                {typeIcon[rec.type]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[#022269] text-sm font-medium group-hover:text-[#c71430] transition-colors leading-tight">
                  {rec.title}
                </p>
                <p className="text-stone-400 text-xs mt-0.5 leading-relaxed line-clamp-2">{rec.description}</p>
              </div>
              <span className="text-stone-300 group-hover:text-[#c71430] transition-colors text-sm flex-shrink-0 mt-1">→</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
