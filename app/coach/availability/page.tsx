'use client'
import { useState, useEffect } from 'react'

const days = [
  { index: 0, label: 'Sunday'    },
  { index: 1, label: 'Monday'    },
  { index: 2, label: 'Tuesday'   },
  { index: 3, label: 'Wednesday' },
  { index: 4, label: 'Thursday'  },
  { index: 5, label: 'Friday'    },
  { index: 6, label: 'Saturday'  },
]

interface Slot {
  dayOfWeek: number
  startTime: string
  endTime:   string
  isActive:  boolean
}

const defaultSlots: Slot[] = days.map(d => ({
  dayOfWeek: d.index,
  startTime: '09:00',
  endTime:   '17:00',
  isActive:  d.index >= 1 && d.index <= 5, // Mon–Fri default
}))

export default function AvailabilityPage() {
  const [slots,   setSlots]   = useState<Slot[]>(defaultSlots)
  const [loading, setLoading] = useState(true)
  const [saving,  setSaving]  = useState(false)
  const [saved,   setSaved]   = useState(false)
  const [error,   setError]   = useState('')

  useEffect(() => {
    fetch('/api/coaches/availability')
      .then(r => r.json())
      .then((data: Slot[]) => {
        if (Array.isArray(data) && data.length > 0) {
          // Merge fetched data with defaults
          setSlots(defaultSlots.map(def => {
            const fetched = data.find(d => d.dayOfWeek === def.dayOfWeek)
            return fetched ?? def
          }))
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const toggle = (idx: number) =>
    setSlots(s => s.map((sl, i) => i === idx ? { ...sl, isActive: !sl.isActive } : sl))

  const setTime = (idx: number, key: 'startTime' | 'endTime', val: string) =>
    setSlots(s => s.map((sl, i) => i === idx ? { ...sl, [key]: val } : sl))

  const handleSave = async () => {
    setSaving(true); setError(''); setSaved(false)
    const res = await fetch('/api/coaches/availability', {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ slots: slots.filter(s => s.isActive) }),
    })
    setSaving(false)
    if (!res.ok) { setError('Failed to save availability.'); return }
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const inputCls = 'border border-stone-200 rounded-lg px-2 py-1.5 text-sm text-[#0A1628] focus:outline-none focus:border-[#B8973A]/50 transition-colors'

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-3xl text-[#0A1628] font-light">Availability</h1>
        <p className="text-stone-400 text-sm mt-1">Set the days and hours when clients can book sessions with you.</p>
      </div>

      <div className="bg-white rounded-2xl border border-stone-100 p-6 space-y-3">
        {loading ? (
          <div className="space-y-3 animate-pulse">
            {[1,2,3,4,5,6,7].map(i => <div key={i} className="h-14 bg-stone-50 rounded-xl" />)}
          </div>
        ) : (
          slots.map((slot, idx) => (
            <div key={slot.dayOfWeek}
              className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                slot.isActive ? 'border-stone-200 bg-stone-50/50' : 'border-stone-100 opacity-50'
              }`}>

              {/* Toggle */}
              <button onClick={() => toggle(idx)}
                className={`relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition-colors ${slot.isActive ? 'bg-[#B8973A]' : 'bg-stone-200'}`}>
                <span className="inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform"
                  style={{ transform: slot.isActive ? 'translateX(18px)' : 'translateX(2px)' }} />
              </button>

              {/* Day label */}
              <span className="text-[#0A1628] text-sm font-medium w-24 flex-shrink-0">
                {days[idx].label}
              </span>

              {/* Time inputs */}
              {slot.isActive ? (
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value={slot.startTime}
                    onChange={e => setTime(idx, 'startTime', e.target.value)}
                    className={inputCls}
                  />
                  <span className="text-stone-300 text-xs">to</span>
                  <input
                    type="time"
                    value={slot.endTime}
                    onChange={e => setTime(idx, 'endTime', e.target.value)}
                    className={inputCls}
                  />
                </div>
              ) : (
                <span className="text-stone-300 text-sm">Unavailable</span>
              )}

              {/* Hours count */}
              {slot.isActive && (() => {
                const [sh, sm] = slot.startTime.split(':').map(Number)
                const [eh, em] = slot.endTime.split(':').map(Number)
                const hrs = ((eh * 60 + em) - (sh * 60 + sm)) / 60
                return <span className="text-stone-300 text-xs ml-auto">{hrs > 0 ? `${hrs}h` : ''}</span>
              })()}
            </div>
          ))
        )}
      </div>

      {error  && <p className="text-red-400 text-sm">{error}</p>}

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving || loading}
          className="bg-[#B8973A] hover:bg-[#D4B05A] disabled:opacity-50 text-white text-sm font-medium px-8 py-3 rounded-xl transition-colors"
        >
          {saving ? 'Saving…' : 'Save Availability'}
        </button>
        {saved && <p className="text-green-500 text-sm">✓ Availability saved</p>}
      </div>

      <div className="bg-stone-50 rounded-2xl border border-stone-100 p-5 text-sm text-stone-400 leading-relaxed">
        <p className="font-medium text-stone-500 mb-1">How it works</p>
        <p>Clients will only see time slots within your available hours. Each slot is {60} minutes by default. You can override this when confirming a booking.</p>
      </div>
    </div>
  )
}
