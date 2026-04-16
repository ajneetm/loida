import nodemailer from 'nodemailer'

function getTransporter() {
  return nodemailer.createTransport({
    host:   process.env.SMTP_HOST,
    port:   Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

export async function sendContactNotification(msg: {
  name:       string
  email:      string
  phone?:     string | null
  programme?: string | null
  message:    string
}) {
  const adminEmail = process.env.ADMIN_EMAIL
  if (!adminEmail || !process.env.SMTP_HOST || !process.env.SMTP_USER) return

  await getTransporter().sendMail({
    from:    `"Loida British" <${process.env.SMTP_FROM ?? process.env.SMTP_USER}>`,
    to:      adminEmail,
    subject: `New Message from ${msg.name} — Loida British`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;border:1px solid #e8e4dc">
        <div style="background:#022269;padding:16px 24px;margin-bottom:24px">
          <h1 style="color:white;font-size:18px;margin:0">New Contact Message</h1>
          <p style="color:#93c5fd;font-size:12px;margin:4px 0 0">Loida British Hub</p>
        </div>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:8px 0;color:#6b7280;font-size:13px;width:120px">Name</td><td style="padding:8px 0;font-size:14px;font-weight:600;color:#1c2b39">${msg.name}</td></tr>
          <tr><td style="padding:8px 0;color:#6b7280;font-size:13px">Email</td><td style="padding:8px 0;font-size:14px;color:#1c2b39"><a href="mailto:${msg.email}" style="color:#022269">${msg.email}</a></td></tr>
          ${msg.phone ? `<tr><td style="padding:8px 0;color:#6b7280;font-size:13px">Phone</td><td style="padding:8px 0;font-size:14px;color:#1c2b39">${msg.phone}</td></tr>` : ''}
          ${msg.programme ? `<tr><td style="padding:8px 0;color:#6b7280;font-size:13px">Programme</td><td style="padding:8px 0;font-size:14px;color:#1c2b39">${msg.programme}</td></tr>` : ''}
        </table>
        <div style="margin-top:20px;padding:16px;background:#f8f7f4;border-left:3px solid #022269">
          <p style="color:#6b7280;font-size:12px;margin:0 0 8px;text-transform:uppercase;letter-spacing:.05em">Message</p>
          <p style="color:#1c2b39;font-size:14px;line-height:1.6;margin:0;white-space:pre-wrap">${msg.message}</p>
        </div>
        <p style="color:#9ca3af;font-size:11px;margin-top:24px;text-align:center">
          View all messages in the <a href="${process.env.NEXTAUTH_URL ?? ''}/admin/messages" style="color:#022269">admin dashboard</a>
        </p>
      </div>
    `,
  })
}
