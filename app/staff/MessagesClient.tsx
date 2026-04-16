'use client'

import { useState, useCallback } from 'react'
import { MessageSquare, Phone, Mail, Clock, CheckCheck, Loader2 } from 'lucide-react'

type Message = {
  id:         string
  name:       string
  email:      string
  phone:      string | null
  programme:  string | null
  message:    string
  notes:      string | null
  status:     string
  createdAt:  string
  updatedAt:  string
}

const STATUS_META: Record<string, { label: string; color: string; bg: string }> = {
  UNREAD:      { label: 'Unread',      color: 'text-amber-700',  bg: 'bg-amber-100 border-amber-200' },
  READ:        { label: 'Read',        color: 'text-stone-500',  bg: 'bg-stone-100 border-stone-200' },
  IN_PROGRESS: { label: 'In Progress', color: 'text-blue-700',   bg: 'bg-blue-100 border-blue-200' },
  REPLIED:     { label: 'Replied',     color: 'text-green-700',  bg: 'bg-green-100 border-green-200' },
  CLOSED:      { label: 'Closed',      color: 'text-stone-400',  bg: 'bg-stone-50 border-stone-200' },
}

const STATUSES = ['UNREAD', 'READ', 'IN_PROGRESS', 'REPLIED', 'CLOSED']

function waLink(phone: string) {
  const clean = phone.replace(/[\s\-\(\)]/g, '').replace(/^\+/, '')
  return `https://wa.me/${clean}`
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1)  return 'Just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export default function MessagesClient({ initialMessages }: { initialMessages: Message[] }) {
  const [messages,   setMessages]   = useState<Message[]>(initialMessages)
  const [filter,     setFilter]     = useState('ALL')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [saving,     setSaving]     = useState<string | null>(null)
  const [notes,      setNotes]      = useState<Record<string, string>>({})

  const counts = STATUSES.reduce((acc, s) => {
    acc[s] = messages.filter(m => m.status === s).length
    return acc
  }, {} as Record<string, number>)

  const unread = messages.filter(m => m.status === 'UNREAD').length

  const displayed = filter === 'ALL'
    ? messages
    : messages.filter(m => m.status === filter)

  async function updateStatus(id: string, status: string) {
    setSaving(id)
    const res = await fetch(`/api/admin/messages/${id}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ status }),
    })
    setSaving(null)
    if (res.ok) {
      setMessages(p => p.map(m => m.id === id ? { ...m, status } : m))
    }
  }

  async function saveNotes(id: string) {
    const text = notes[id] ?? messages.find(m => m.id === id)?.notes ?? ''
    setSaving(id + '_notes')
    const res = await fetch(`/api/admin/messages/${id}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ notes: text }),
    })
    setSaving(null)
    if (res.ok) {
      setMessages(p => p.map(m => m.id === id ? { ...m, notes: text } : m))
    }
  }

  // Mark as READ when expanding an UNREAD message
  function toggleExpand(msg: Message) {
    const isOpening = expandedId !== msg.id
    setExpandedId(isOpening ? msg.id : null)
    if (isOpening && msg.status === 'UNREAD') {
      updateStatus(msg.id, 'READ')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-[#1C2B39]">Contact Messages</h1>
          {unread > 0 && (
            <span className="bg-[#c71430] text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {unread} new
            </span>
          )}
        </div>
        <p className="text-sm text-[#6B8F9E] mt-1">{messages.length} total messages</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilter('ALL')}
          className={`px-3 py-1.5 text-xs font-medium border transition-colors ${
            filter === 'ALL' ? 'bg-[#1C2B39] text-white border-[#1C2B39]' : 'border-[#E8E4DC] text-[#6B8F9E] hover:border-[#1C2B39] hover:text-[#1C2B39]'
          }`}
        >
          All ({messages.length})
        </button>
        {STATUSES.map(s => counts[s] > 0 && (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 text-xs font-medium border transition-colors ${
              filter === s ? 'bg-[#1C2B39] text-white border-[#1C2B39]' : 'border-[#E8E4DC] text-[#6B8F9E] hover:border-[#1C2B39] hover:text-[#1C2B39]'
            }`}
          >
            {STATUS_META[s].label} ({counts[s]})
          </button>
        ))}
      </div>

      {/* Messages */}
      {displayed.length === 0 ? (
        <div className="bg-white border border-[#E8E4DC] p-12 text-center text-[#6B8F9E]">
          No messages in this category
        </div>
      ) : (
        <div className="space-y-2">
          {displayed.map(msg => {
            const meta      = STATUS_META[msg.status] ?? STATUS_META.READ
            const expanded  = expandedId === msg.id
            const isSaving  = saving === msg.id || saving === msg.id + '_notes'
            const noteVal   = notes[msg.id] ?? msg.notes ?? ''

            return (
              <div key={msg.id}
                className={`bg-white border transition-colors ${
                  msg.status === 'UNREAD' ? 'border-amber-200' : 'border-[#E8E4DC]'
                }`}
              >
                {/* Row header — always visible */}
                <button
                  className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left hover:bg-[#F8F7F4] transition-colors"
                  onClick={() => toggleExpand(msg)}
                >
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    {/* Unread dot */}
                    {msg.status === 'UNREAD' && (
                      <span className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0" />
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-[#1C2B39] text-sm">{msg.name}</span>
                        {msg.programme && (
                          <span className="text-[10px] px-1.5 py-0.5 bg-[#E8F4F8] text-[#1C2B39] border border-[#C5E0EB]">
                            {msg.programme}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                        <span className="text-xs text-[#6B8F9E]">{msg.email}</span>
                        {msg.phone && <span className="text-xs text-[#6B8F9E]">{msg.phone}</span>}
                        <span className="text-xs text-[#9CA3AF]">{timeAgo(msg.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-[10px] px-2 py-0.5 border font-medium ${meta.bg} ${meta.color}`}>
                      {meta.label}
                    </span>
                    <span className="text-[#6B8F9E] text-xs">{expanded ? '▲' : '▼'}</span>
                  </div>
                </button>

                {/* Expanded content */}
                {expanded && (
                  <div className="px-5 pb-5 space-y-4 border-t border-[#E8E4DC]">

                    {/* Message text */}
                    <div className="pt-4">
                      <p className="text-[10px] font-semibold text-[#6B8F9E] uppercase tracking-widest mb-2">Message</p>
                      <p className="text-sm text-[#1C2B39] leading-relaxed whitespace-pre-wrap bg-[#F8F7F4] p-4 border border-[#E8E4DC]">
                        {msg.message}
                      </p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap gap-2">
                      {/* WhatsApp */}
                      {msg.phone && (
                        <a
                          href={waLink(msg.phone)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white text-sm font-medium transition-colors"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                          </svg>
                          WhatsApp
                        </a>
                      )}

                      {/* Email reply */}
                      <a
                        href={`mailto:${msg.email}?subject=Re: Your enquiry — Loida British`}
                        className="flex items-center gap-2 px-4 py-2 bg-[#022269] hover:bg-[#011344] text-white text-sm font-medium transition-colors"
                      >
                        <Mail className="w-4 h-4" />
                        Reply by Email
                      </a>

                      {/* Phone call */}
                      {msg.phone && (
                        <a
                          href={`tel:${msg.phone}`}
                          className="flex items-center gap-2 px-4 py-2 border border-[#E8E4DC] text-[#1C2B39] text-sm hover:bg-[#F8F7F4] transition-colors"
                        >
                          <Phone className="w-4 h-4" />
                          Call
                        </a>
                      )}
                    </div>

                    {/* Status + Notes */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Status */}
                      <div>
                        <p className="text-[10px] font-semibold text-[#6B8F9E] uppercase tracking-widest mb-1.5">Status</p>
                        <div className="flex flex-wrap gap-1.5">
                          {STATUSES.map(s => (
                            <button
                              key={s}
                              onClick={() => updateStatus(msg.id, s)}
                              disabled={isSaving}
                              className={`px-2.5 py-1 text-[11px] border font-medium transition-colors disabled:opacity-50 ${
                                msg.status === s
                                  ? `${STATUS_META[s].bg} ${STATUS_META[s].color}`
                                  : 'border-[#E8E4DC] text-[#6B8F9E] hover:border-[#1C2B39] hover:text-[#1C2B39]'
                              }`}
                            >
                              {saving === msg.id && msg.status !== s ? STATUS_META[s].label : STATUS_META[s].label}
                              {saving === msg.id && (
                                <Loader2 className="w-3 h-3 inline ml-1 animate-spin" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Notes */}
                      <div>
                        <p className="text-[10px] font-semibold text-[#6B8F9E] uppercase tracking-widest mb-1.5">Follow-up Notes</p>
                        <div className="flex gap-2">
                          <textarea
                            rows={3}
                            value={noteVal}
                            onChange={e => setNotes(p => ({ ...p, [msg.id]: e.target.value }))}
                            placeholder="Add notes about this lead…"
                            className="flex-1 border border-[#E8E4DC] px-3 py-2 text-sm focus:outline-none focus:border-[#1C2B39] resize-none bg-white"
                          />
                          <button
                            onClick={() => saveNotes(msg.id)}
                            disabled={saving === msg.id + '_notes'}
                            className="px-3 py-2 bg-[#1C2B39] text-white text-xs font-medium hover:bg-[#2a3f52] transition-colors disabled:opacity-50 self-end"
                          >
                            {saving === msg.id + '_notes' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCheck className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
