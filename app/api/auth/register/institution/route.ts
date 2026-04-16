import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  const data = await req.formData()

  const institutionName = data.get('institutionName')?.toString().trim() ?? ''
  const nationality     = data.get('nationality')?.toString().trim() ?? ''
  const email           = data.get('email')?.toString().trim().toLowerCase() ?? ''
  const password        = data.get('password')?.toString() ?? ''
  const founderName     = data.get('founderName')?.toString().trim() ?? ''
  const website         = data.get('website')?.toString().trim() || null
  const foundedYear     = data.get('foundedYear')?.toString().trim() || null
  const employeeCount   = data.get('employeeCount')?.toString().trim() || null
  const address         = data.get('address')?.toString().trim() || null
  const crName             = data.get('commercialRegisterName')?.toString() || null
  const selectedCurricula  = data.get('selectedCurricula')?.toString() ?? '[]'

  if (!institutionName || !nationality || !email || !password || !founderName) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json({ error: 'Email already in use' }, { status: 409 })
  }

  const commercialRegisterUrl = crName ? `pending:${crName}` : null

  const passwordHash = await bcrypt.hash(password, 12)

  await prisma.user.create({
    data: {
      name:  institutionName,
      email,
      passwordHash,
      role:  'INSTITUTION',
      institutionProfile: {
        create: {
          institutionName,
          nationality,
          founderName,
          website,
          foundedYear:           foundedYear   ? parseInt(foundedYear)   : null,
          employeeCount:         employeeCount ? parseInt(employeeCount) : null,
          address,
          commercialRegisterUrl,
          curricula:      selectedCurricula,
          approvalStatus: 'PENDING',
        },
      },
    },
  })

  return NextResponse.json({ success: true }, { status: 201 })
}
