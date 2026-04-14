// prisma/seed-extras.ts — run after seed.ts to add articles & coach data
// Usage: tsx prisma/seed-extras.ts

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding extras (coach + articles)…')

  // ── Coach user ───────────────────────────────
  const coachHash = await bcrypt.hash('coach123456', 12)
  const coachUser = await prisma.user.upsert({
    where: { email: 'coach@loidabritish.com' },
    update: {},
    create: {
      name:         'James Okonkwo',
      email:        'coach@loidabritish.com',
      passwordHash: coachHash,
      role:         'COACH',
      profile:      { create: { language: 'en', timezone: 'Europe/London', interests: ['CAREER','BUSINESS'] } },
      membership:   { create: { plan: 'PROFESSIONAL', isActive: true } },
    },
  })

  // ── Coach profile with availability ─────────────────
  const coach = await prisma.coach.upsert({
    where: { userId: coachUser.id },
    update: {},
    create: {
      userId:      coachUser.id,
      bio:         'Senior business strategist and career coach with 15+ years of experience in the UK and MENA markets. I have helped over 200 professionals transition careers and 50+ startups develop winning strategies.',
      specialties: ['Career Transition', 'Business Strategy', 'Leadership', 'Personal Branding'],
      domains:     ['CAREER', 'BUSINESS'],
      hourlyRate:  85,
      currency:    'GBP',
      status:      'APPROVED',
      rating:      4.9,
      totalSessions: 214,
      linkedinUrl: 'https://linkedin.com',
    },
  })

  // Set availability Mon–Fri 9am–5pm
  await prisma.availability.deleteMany({ where: { coachId: coach.id } })
  await prisma.availability.createMany({
    data: [1,2,3,4,5].map(day => ({
      coachId:   coach.id,
      dayOfWeek: day,
      startTime: '09:00',
      endTime:   '17:00',
      isActive:  true,
    })),
  })

  // ── Sample articles ──────────────────────────
  const adminUser = await prisma.user.findUnique({ where: { email: 'admin@loidabritish.com' } })
  if (!adminUser) { console.log('No admin user found — skipping articles'); return }

  const articles = [
    {
      title:   'The 5 Pillars of Self-Awareness Every Leader Needs',
      slug:    'five-pillars-self-awareness-leaders',
      excerpt: 'Self-awareness is not a soft skill — it is the foundational capability that separates great leaders from average ones.',
      content: `Self-awareness is the ability to see yourself clearly — your strengths, your blind spots, your emotional patterns, and how others experience you.\n\nResearch consistently shows that leaders with high self-awareness make better decisions, build stronger teams, and navigate change more effectively. Yet studies also show that while 95% of people believe they are self-aware, only 10–15% actually are.\n\nHere are the five pillars that matter most.\n\n1. Emotional Recognition\nThe ability to name your emotions as they arise — not suppress them or be overwhelmed by them. This requires regular practice, stillness, and honest reflection.\n\n2. Values Clarity\nKnowing what you stand for, non-negotiably. When your actions align with your values, you feel congruent. When they do not, you feel friction.\n\n3. Behavioural Patterns\nUnderstanding how you behave under pressure, in conflict, when praised, or when facing failure. These patterns often run on autopilot unless you bring them to light.\n\n4. Impact Awareness\nKnowing how you land on others — how your words, tone, and presence affect people. This requires feedback, and the courage to receive it honestly.\n\n5. Growth Orientation\nBelieving that you can change. Fixed-mindset leaders get defensive; growth-oriented leaders get curious.\n\nAt Harmony, we help you build all five pillars through structured assessments and 1:1 coaching.`,
      domain:  'HARMONY' as const,
      tags:    ['self-awareness', 'leadership', 'emotional-intelligence'],
    },
    {
      title:   'How to Navigate a Career Change at Any Age',
      slug:    'navigate-career-change-any-age',
      excerpt: 'Career transitions are rarely linear. Here is a proven framework for making the move successfully — whether you are 25 or 55.',
      content: `The average person changes careers — not just jobs, but full career directions — between three and seven times in their lifetime. Yet most people treat a career change as a crisis rather than a natural evolution.\n\nHere is a framework we use with our Career for Everyone clients.\n\nStep 1: Audit the Present\nBefore you can move forward, you need an honest picture of where you are. What skills do you have? What do you actually enjoy? What is draining you? This is not about judgment — it is about data.\n\nStep 2: Define the Destination\nNot perfectly, but directionally. You do not need a fully formed plan — you need a compass direction. "I want to work with people more" or "I want to use my analytical skills differently" is enough to start.\n\nStep 3: Close the Gap\nWhat is between where you are and where you want to go? It might be skills, credentials, network, or simply confidence. Identify the specific gaps and address them one at a time.\n\nStep 4: Build the Bridge\nRather than a dramatic leap, look for ways to build a bridge. Side projects, volunteering, freelance work, and informational interviews can all help you move into a new field while maintaining security.\n\nStep 5: Get Support\nCareer transitions are emotionally demanding. Working with a coach who has navigated transitions — or helped others through them — dramatically increases your success rate and reduces the time it takes.\n\nYou are not starting over. You are starting with experience.`,
      domain:  'CAREER' as const,
      tags:    ['career-change', 'career-development', 'professional-growth'],
    },
    {
      title:   'The Business Clock: Why Timing Is Everything in Business',
      slug:    'business-clock-timing-everything',
      excerpt: 'Most businesses fail not because of a bad idea, but because of bad timing. Understanding market cycles changes everything.',
      content: `There is a reason some businesses launch and immediately take off, while others with better products struggle for years. The difference, more often than not, is timing.\n\nThe Business Clock methodology — developed over decades of working with entrepreneurs in the UK and MENA — maps the natural rhythm of markets, opportunities, and business cycles.\n\nThe core insight is this: every market has a clock, and every business needs to understand what time it is.\n\nThe 12 Hours of the Business Clock\n\nHour 1–3: Emergence\nNew markets, new problems, new opportunities. The risk is high, but so is the potential. First movers who survive build enormous advantages.\n\nHour 4–6: Growth\nThe market is validated. Customers exist. The challenge now is execution, scaling, and differentiation. This is where most businesses should be launching.\n\nHour 7–9: Maturity\nThe market is established. Competition is fierce. Margins compress. Winners here are those with strong brands, loyal customers, and operational excellence.\n\nHour 10–12: Decline or Reinvention\nThe old model is fading. The question is whether to exit, pivot, or reinvent. The most resilient companies see this coming and begin building the next clock.\n\nUnderstanding where your market sits on this clock — and aligning your strategy accordingly — is one of the most powerful business decisions you can make.\n\nThat is what we teach in The Business Clock programme.`,
      domain:  'BUSINESS' as const,
      tags:    ['business-strategy', 'market-timing', 'entrepreneurship', 'business-clock'],
    },
  ]

  for (const article of articles) {
    await prisma.article.upsert({
      where: { slug: article.slug },
      update: {},
      create: {
        ...article,
        authorId:    adminUser.id,
        isPublished: true,
        publishedAt: new Date(),
      },
    })
  }

  console.log('✅ Extras seeded!')
  console.log('Coach: coach@loidabritish.com / coach123456')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
