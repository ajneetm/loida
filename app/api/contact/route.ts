import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { sendContactNotification } from '@/lib/mail'
import { z } from 'zod'

const schema = z.object({
  name:       z.string().min(1),
  email:      z.string().email(),
  phone:      z.string().optional(),
  programme:  z.string().optional(),
  message:    z.string().min(5),
})

export async function POST(req: Request) {
  const body   = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid fields' }, { status: 400 })
  }

  const { name, email, phone, programme, message } = parsed.data

  const contact = await prisma.contactMessage.create({
    data: { name, email, phone: phone || null, programme: programme || null, message },
  })

  // Fire email in background — don't fail the request if email fails
  sendContactNotification({ name, email, phone, programme, message }).catch(() => {})

  return NextResponse.json({ success: true, id: contact.id }, { status: 201 })
}

export async function GET(req: Request) {
  // Used by admin dashboard only — minimal auth check via admin API
  return NextResponse.json({ error: 'Use /admin/messages' }, { status: 404 })
}
