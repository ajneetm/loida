'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { formatCurrency, getDomainColor, getDomainLabel } from '@/lib/utils'

interface Coach {
  id: string
  bio: string
  domains: string[]
  specialties: string[]
  hourlyRate: number | null
  currency: string
  rating: number | null
  user: { name: string; image: string | null }
  availability: { dayOfWeek: number; startTime: string; endTime: string }[]
}

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const durations = [
  { value: 30,  label: '30 min' },
  { value: 60,  label: '1 hour' },
  { value: 90,  label: '1.5 hours' },
  { value: 120, label: '2 hours' },
]

function getNextDays(count: number) {
  const result = []
  const today  = new Date()
  for (let i = 1; i <= count; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    result.push(d)
  }
  return result
}

function getTimeSlots(start: string, end: string, duration: number) {
  const slots = []
  const [sh, sm] = start.split(':').map(Number)
  const [eh, em] = end.split(':').map(Number)
  let cur = sh * 60 + sm
  const endM = eh * 60 + em
  while (cur + duration <= endM) {
    const h = Math.floor(cur / 60).toString().padStart(2, '0')
    const m = (cur % 60).toString().padStart(2, '0')
    slots.push(`${h}:${m}`)
    cur += duration
  }
  return slots
}

export default function BookCoachPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [coach, setCoach]         = useState<Coach | null>(null)
  const [loading, setLoading]     = useState(true)
  const [selectedDay, setDay]     = useState<Date | null>(null)
  const [selectedSlot, setSlot]   = useState<string | null>(null)
  const [duration, setDuration]   = useState(60)
  const [notes, setNotes]         = useState('')
  const [submitting, setSub]      = useState(false)
  const [error, setError]         = useState('')

  const futureDays = getNextDays(14)

  useEffect(() => {
    fetch(`/api/coaches/${params.id}`)
      .then(r => r.json())
      .then(d => { setCoach(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [params.id])

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-stone-400 text-sm animate-pulse">Loading coach profile…</div>
    </div>
  )
  if (!coach) return (
    <div className="text-center py-20"><p className="text-stone-400 text-sm">Coach not found.</p></div>
  )

  const availDay = selectedDay
    ? coach.availability.find(a => a.dayOfWeek === selectedDay.getDay())
    : null

  const timeSlots = availDay
    ? getTimeSlots(availDay.startTime, availDay.endTime, duration)
    : []

  const handleBook = async () => {
    if (!selectedDay || !selectedSlot) { setError('Please select a day and time.'); return }
    setSub(true); setError('')
    const dt = new Date(selectedDay)
    const [h, m] = selectedSlot.split(':').map(Number)
    dt.setHours(h, m, 0, 0)

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coachId: coach.id, scheduledAt: dt.toISOString(), duration, notes }),
      })
      if (!res.ok) { const d = await res.json(); setError(d.message ?? 'Booking failed.'); setSub(false); return }
      router.push('/dashboard/sessions?booked=1')
    } catch {
      setError('Something went wrong.')
      setSub(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Coach info */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-2xl border border-stone-100 p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-[#0A1628] flex items-center justify-center text-white font-display text-2xl flex-shrink-0">
                {coach.user.name.charAt(0)}
              </div>
              <div>
                <h2 className="font-display text-xl text-[#0A1628] font-medium">{coach.user.name}</h2>
                {coach.rating && <p className="text-amber-500 text-sm">★ {coach.rating.toFixed(1)}</p>}
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {coach.domains.map(d => (
                <span key={d} className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                  style={{ background: `${getDomainColor(d)}15`, color: getDomainColor(d) }}>
                  {getDomainLabel(d)}
                </span>
              ))}
            </div>

            <p className="text-stone-500 text-sm leading-relaxed mb-4 line-clamp-4">{coach.bio}</p>

            {coach.specialties.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {coach.specialties.slice(0, 4).map(s => (
                  <span key={s} className="text-[10px] bg-stone-50 border border-stone-100 text-stone-500 px-2 py-0.5 rounded-full">{s}</span>
                ))}
              </div>
            )}
          </div>

          {/* Price */}
          <div className="bg-white rounded-2xl border border-stone-100 p-6">
            <p className="text-stone-400 text-xs tracking-wide mb-2">Session Price</p>
            <p className="font-display text-3xl text-[#0A1628]">
              {coach.hourlyRate
                ? formatCurrency(coach.hourlyRate * (duration / 60), coach.currency)
                : 'Free'}
            </p>
            <p className="text-stone-400 text-xs mt-1">for {durations.find(d => d.value === duration)?.label}</p>
          </div>
        </div>

        {/* Booking panel */}
        <div className="lg:col-span-2 space-y-5">

          {/* Duration */}
          <div className="bg-white rounded-2xl border border-stone-100 p-6">
            <h3 className="font-display text-lg text-[#0A1628] mb-4">Session Duration</h3>
            <div className="flex flex-wrap gap-2">
              {durations.map(d => (
                <button key={d.value} onClick={() => { setDuration(d.value); setSlot(null) }}
                  className={`px-4 py-2 rounded-xl text-sm border transition-all ${
                    duration === d.value ? 'bg-[#0A1628] text-white border-[#0A1628]' : 'border-stone-200 text-stone-500 hover:border-stone-400'
                  }`}>
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Day picker */}
          <div className="bg-white rounded-2xl border border-stone-100 p-6">
            <h3 className="font-display text-lg text-[#0A1628] mb-4">Select a Day</h3>
            <div className="grid grid-cols-7 gap-1.5">
              {futureDays.map(day => {
                const avail = coach.availability.some(a => a.dayOfWeek === day.getDay())
                const sel   = selectedDay?.toDateString() === day.toDateString()
                return (
                  <button key={day.toISOString()} onClick={() => { if (avail) { setDay(day); setSlot(null) } }}
                    disabled={!avail}
                    className={`aspect-square flex flex-col items-center justify-center rounded-xl text-xs transition-all ${
                      sel     ? 'bg-[#0A1628] text-white' :
                      avail   ? 'border border-stone-200 text-stone-600 hover:border-[#B8973A] hover:text-[#B8973A]' :
                                'text-stone-200 cursor-not-allowed'
                    }`}>
                    <span className="text-[9px] uppercase">{days[day.getDay()]}</span>
                    <span className="font-medium text-sm">{day.getDate()}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Time slots */}
          {selectedDay && (
            <div className="bg-white rounded-2xl border border-stone-100 p-6">
              <h3 className="font-display text-lg text-[#0A1628] mb-4">
                Available Times — {selectedDay.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
              </h3>
              {timeSlots.length === 0 ? (
                <p className="text-stone-400 text-sm">No available slots on this day.</p>
              ) : (
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {timeSlots.map(slot => (
                    <button key={slot} onClick={() => setSlot(slot)}
                      className={`py-2 rounded-xl text-xs font-medium border transition-all ${
                        selectedSlot === slot
                          ? 'bg-[#B8973A] text-white border-[#B8973A]'
                          : 'border-stone-200 text-stone-600 hover:border-[#B8973A] hover:text-[#B8973A]'
                      }`}>
                      {slot}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Notes + submit */}
          {selectedSlot && (
            <div className="bg-white rounded-2xl border border-stone-100 p-6 space-y-4">
              <h3 className="font-display text-lg text-[#0A1628]">Session Notes</h3>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={3}
                placeholder="What would you like to focus on in this session? (optional)"
                className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm text-[#0A1628] focus:outline-none focus:border-[#B8973A]/50 resize-none placeholder:text-stone-300"
              />

              {/* Summary */}
              <div className="bg-stone-50 rounded-xl p-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-stone-400">Coach</span><span className="text-[#0A1628] font-medium">{coach.user.name}</span></div>
                <div className="flex justify-between"><span className="text-stone-400">Date</span><span className="text-[#0A1628] font-medium">{selectedDay!.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span></div>
                <div className="flex justify-between"><span className="text-stone-400">Time</span><span className="text-[#0A1628] font-medium">{selectedSlot}</span></div>
                <div className="flex justify-between"><span className="text-stone-400">Duration</span><span className="text-[#0A1628] font-medium">{durations.find(d => d.value === duration)?.label}</span></div>
                <div className="flex justify-between border-t border-stone-200 pt-2 mt-2">
                  <span className="text-stone-600 font-medium">Total</span>
                  <span className="text-[#0A1628] font-display text-lg">{coach.hourlyRate ? formatCurrency(coach.hourlyRate * (duration / 60), coach.currency) : 'Free'}</span>
                </div>
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <button onClick={handleBook} disabled={submitting}
                className="w-full bg-[#B8973A] hover:bg-[#D4B05A] disabled:opacity-50 text-white text-sm font-medium py-3.5 rounded-xl transition-colors">
                {submitting ? 'Booking…' : 'Confirm Booking →'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
