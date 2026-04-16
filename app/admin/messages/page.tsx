import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { formatDate } from '@/lib/utils'
import MessageActions from './MessageActions'

export default async function AdminMessagesPage() {
  const session = await auth()
  if ((session?.user as any)?.role !== 'ADMIN') redirect('/dashboard')

  const messages = await prisma.contactMessage.findMany({
    orderBy: [
      { status: 'asc' },   // UNREAD first
      { createdAt: 'desc' },
    ],
  })

  const unread = messages.filter(m => m.status === 'UNREAD')
  const read   = messages.filter(m => m.status === 'READ')

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#1C2B39]">Messages</h1>
          <p className="text-sm text-[#6B8F9E] mt-1">
            {unread.length > 0 && (
              <span className="font-medium text-amber-600">{unread.length} unread</span>
            )}
            {unread.length > 0 && read.length > 0 && ' · '}
            {read.length > 0 && (
              <span className="text-[#6B8F9E]">{read.length} read</span>
            )}
            {messages.length === 0 && 'No messages yet'}
          </p>
        </div>
      </div>

      {messages.length === 0 && (
        <div className="bg-white border border-[#E8E4DC] p-12 text-center text-[#6B8F9E]">
          No messages yet. Submissions from the contact form will appear here.
        </div>
      )}

      {unread.length > 0 && (
        <Section title="Unread" color="amber">
          {unread.map(m => <MessageRow key={m.id} message={m} />)}
        </Section>
      )}

      {read.length > 0 && (
        <Section title="Read" color="stone">
          {read.map(m => <MessageRow key={m.id} message={m} />)}
        </Section>
      )}
    </div>
  )
}

function Section({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  const colors: Record<string, string> = {
    amber: 'bg-amber-50 border-amber-200 text-amber-800',
    stone: 'bg-stone-50 border-stone-200 text-stone-500',
  }
  return (
    <div className="space-y-3">
      <div className={`inline-flex px-3 py-1 text-xs font-medium border ${colors[color]}`}>
        {title}
      </div>
      <div className="bg-white border border-[#E8E4DC] overflow-hidden">
        <div className="divide-y divide-[#E8E4DC]">{children}</div>
      </div>
    </div>
  )
}

function MessageRow({ message }: { message: any }) {
  return (
    <div className={`px-6 py-5 flex items-start justify-between gap-4 ${message.status === 'UNREAD' ? 'bg-amber-50/40' : ''}`}>
      <div className="min-w-0 flex-1 space-y-1.5">
        <div className="flex items-center gap-3 flex-wrap">
          <p className="font-semibold text-[#1C2B39] text-sm">{message.name}</p>
          {message.status === 'UNREAD' && (
            <span className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0" />
          )}
          {message.programme && (
            <span className="text-[10px] px-2 py-0.5 bg-[#E8F4F8] text-[#1C2B39] border border-[#C5E0EB]">
              {message.programme}
            </span>
          )}
        </div>
        <div className="flex items-center gap-4 flex-wrap text-xs text-[#6B8F9E]">
          <a href={`mailto:${message.email}`} className="hover:text-[#1C2B39] transition-colors">{message.email}</a>
          {message.phone && <span>{message.phone}</span>}
          <span>{formatDate(message.createdAt)}</span>
        </div>
        <p className="text-sm text-[#1C2B39] mt-2 leading-relaxed whitespace-pre-wrap">
          {message.message}
        </p>
      </div>
      <MessageActions messageId={message.id} status={message.status} />
    </div>
  )
}
