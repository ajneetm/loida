import { prisma } from '@/lib/prisma'
import MessagesClient from './MessagesClient'

export const dynamic = 'force-dynamic'

export default async function StaffPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: [
      { status: 'asc' },
      { createdAt: 'desc' },
    ],
  })

  return <MessagesClient initialMessages={messages} />
}
