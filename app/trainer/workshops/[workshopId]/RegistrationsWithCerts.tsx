'use client'

import { useState } from 'react'
import { Award, Users, CheckSquare, Square, Check } from 'lucide-react'

interface Registration {
  id: string; name: string; email: string; phone?: string | null; registeredAt: string | Date
}

interface Props {
  registrations:  Registration[]
  workshopId:     string
  curriculumId:   string
  workshopDate:   string | Date
  existingEmails: string[]  // already have a certificate request
}

export default function RegistrationsWithCerts({
  registrations, workshopId, curriculumId, workshopDate, existingEmails,
}: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [submitted, setSubmitted] = useState<Set<string>>(new Set(existingEmails))
  const [loading, setLoading]   = useState(false)
  const [message, setMessage]   = useState('')

  function toggle(email: string) {
    if (submitted.has(email)) return
    setSelected(prev => {
      const next = new Set(prev)
      next.has(email) ? next.delete(email) : next.add(email)
      return next
    })
  }

  function selectAll() {
    const eligible = registrations.filter(r => !submitted.has(r.email)).map(r => r.email)
    setSelected(new Set(eligible))
  }

  async function requestCertificates() {
    if (selected.size === 0) return
    setLoading(true)
    setMessage('')

    const trainees = registrations
      .filter(r => selected.has(r.email))
      .map(r => ({ traineeName: r.name, traineeEmail: r.email }))

    const res = await fetch('/api/certificates', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        curriculumId,
        workshopId,
        workshopDate: new Date(workshopDate).toISOString(),
        trainees,
      }),
    })

    setLoading(false)
    const data = await res.json()

    if (res.ok || res.status === 200) {
      const newSubmitted = new Set(submitted)
      selected.forEach(e => newSubmitted.add(e))
      setSubmitted(newSubmitted)
      setSelected(new Set())
      setMessage(data.count > 0
        ? `${data.count} certificate request${data.count !== 1 ? 's' : ''} submitted.`
        : 'Already submitted for all selected.')
    } else {
      setMessage('Something went wrong.')
    }
  }

  const eligible = registrations.filter(r => !submitted.has(r.email))

  return (
    <div className="bg-white border border-[#E8E4DC]">
      <div className="px-5 py-4 border-b border-[#E8E4DC] flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <h2 className="font-medium text-[#1C2B39]">Registrations</h2>
          <span className="text-xs text-[#6B8F9E]">{registrations.length} registered</span>
        </div>
        <div className="flex items-center gap-2">
          {eligible.length > 0 && (
            <button type="button" onClick={selectAll}
              className="text-xs text-[#6B8F9E] hover:text-[#1C2B39] transition-colors">
              Select all
            </button>
          )}
          {selected.size > 0 && (
            <button type="button" onClick={requestCertificates} disabled={loading}
              className="flex items-center gap-1.5 bg-[#1C2B39] text-white px-3 py-1.5 text-xs hover:bg-[#2a3f52] transition-colors disabled:opacity-50">
              <Award className="w-3.5 h-3.5" />
              {loading ? 'Submitting…' : `Request ${selected.size} Certificate${selected.size !== 1 ? 's' : ''}`}
            </button>
          )}
        </div>
      </div>

      {message && (
        <div className="px-5 py-2 bg-green-50 text-green-700 text-xs border-b border-green-100">
          {message}
        </div>
      )}

      {registrations.length === 0 ? (
        <div className="p-10 text-center text-sm text-[#6B8F9E]">
          <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
          No registrations yet
        </div>
      ) : (
        <div className="divide-y divide-[#E8E4DC]">
          {registrations.map(r => {
            const isSubmitted = submitted.has(r.email)
            const isSelected  = selected.has(r.email)
            return (
              <div
                key={r.id}
                onClick={() => toggle(r.email)}
                className={`flex items-center gap-4 px-5 py-3 transition-colors ${
                  isSubmitted ? 'opacity-60 cursor-default' : 'cursor-pointer hover:bg-[#F8F7F4]'
                }`}
              >
                <div className="flex-shrink-0 text-[#6B8F9E]">
                  {isSubmitted
                    ? <Check className="w-4 h-4 text-green-500" />
                    : isSelected
                      ? <CheckSquare className="w-4 h-4 text-[#1C2B39]" />
                      : <Square className="w-4 h-4 opacity-40" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#1C2B39]">{r.name}</p>
                  <p className="text-xs text-[#6B8F9E]">{r.email}{r.phone ? ` · ${r.phone}` : ''}</p>
                </div>
                {isSubmitted && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 flex-shrink-0">
                    Requested
                  </span>
                )}
                <p className="text-xs text-[#6B8F9E] flex-shrink-0 hidden sm:block">
                  {new Date(r.registeredAt).toLocaleDateString()}
                </p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
