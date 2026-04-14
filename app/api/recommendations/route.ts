import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

/**
 * GET /api/recommendations
 *
 * Returns smart cross-platform recommendations for the logged-in user based on:
 * - Assessment results completed
 * - Programs enrolled
 * - Profile interests
 * - Cross-platform progression logic:
 *   Harmony → Career → Business
 */
export async function GET(_req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  const userId = session.user.id as string

  const [user, results, enrollments] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    }),
    prisma.assessmentResult.findMany({
      where: { userId },
      include: { assessment: true },
    }),
    prisma.enrollment.findMany({
      where: { userId },
      include: { program: true },
    }),
  ])

  const completedDomains  = new Set(results.map(r => r.assessment.domain as string))
  const enrolledDomains   = new Set(enrollments.map(e => e.program.domain as string))
  const profileInterests: string[] = user?.profile?.interests
    ? JSON.parse(user.profile.interests as string)
    : []

  const recommendations: {
    type: 'assessment' | 'program' | 'platform'
    domain: string
    title: string
    description: string
    href: string
    priority: number
  }[] = []

  // ── Rule 1: Haven't done Harmony yet → suggest it first ──
  if (!completedDomains.has('HARMONY')) {
    recommendations.push({
      type:        'assessment',
      domain:      'HARMONY',
      title:       'Start with Self-Awareness',
      description: 'Understanding yourself is the foundation of all growth. Take the Harmony assessment first.',
      href:        '/dashboard/assessments',
      priority:    10,
    })
  }

  // ── Rule 2: Harmony done, not Career → suggest Career ──
  if (completedDomains.has('HARMONY') && !completedDomains.has('CAREER')) {
    recommendations.push({
      type:        'assessment',
      domain:      'CAREER',
      title:       'Map Your Career Path',
      description: 'You have built self-awareness — now discover your professional direction with the Career assessment.',
      href:        '/dashboard/assessments',
      priority:    9,
    })
  }

  // ── Rule 3: Career done, not Business → suggest Business ──
  if (completedDomains.has('CAREER') && !completedDomains.has('BUSINESS')) {
    recommendations.push({
      type:        'assessment',
      domain:      'BUSINESS',
      title:       'Explore Entrepreneurship',
      description: 'Ready to think bigger? Take the Business Clock assessment and discover your entrepreneurial potential.',
      href:        '/dashboard/assessments',
      priority:    8,
    })
  }

  // ── Rule 4: Suggest programs for completed assessments with no enrollment ──
  for (const result of results) {
    const domain = result.assessment.domain as string
    const hasEnrolled = enrollments.some(e => e.program.domain === domain)
    if (!hasEnrolled) {
      const program = await prisma.program.findFirst({
        where: { domain: domain as any, isPublished: true, price: 0 },
        orderBy: { order: 'asc' },
      })
      if (program) {
        recommendations.push({
          type:        'program',
          domain,
          title:       `Start: ${program.title}`,
          description: `You completed the ${domain.toLowerCase()} assessment. This free program is the perfect next step.`,
          href:        '/dashboard/programs',
          priority:    7,
        })
      }
    }
  }

  // ── Rule 5: Suggest coaching if enrolled in programs but no bookings ──
  const bookingCount = await prisma.booking.count({ where: { userId } })
  if (enrollments.length > 0 && bookingCount === 0) {
    recommendations.push({
      type:        'program',
      domain:      'GENERAL',
      title:       'Book Your First Coach Session',
      description: 'You are making great progress! A 1:1 coaching session will accelerate your journey significantly.',
      href:        '/dashboard/coaches',
      priority:    6,
    })
  }

  // ── Rule 6: Profile interests not yet explored ──
  for (const interest of profileInterests) {
    if (!completedDomains.has(interest) && !enrolledDomains.has(interest)) {
      recommendations.push({
        type:        'platform',
        domain:      interest,
        title:       `Explore ${interest.charAt(0) + interest.slice(1).toLowerCase()}`,
        description: `You listed ${interest.toLowerCase()} as an interest. Start your journey there today.`,
        href:        '/dashboard/assessments',
        priority:    5,
      })
    }
  }

  // Sort by priority, deduplicate by domain+type, take top 5
  const seen = new Set<string>()
  const top  = recommendations
    .sort((a, b) => b.priority - a.priority)
    .filter(r => {
      const key = `${r.domain}-${r.type}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
    .slice(0, 5)

  return NextResponse.json(top)
}
