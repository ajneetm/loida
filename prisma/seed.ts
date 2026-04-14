import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding Loida British Hub...')

  // ── Admin user ──────────────────────────────
  const adminHash = await bcrypt.hash('admin123456', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@loidabritish.com' },
    update: {},
    create: {
      name: 'Loida Admin',
      email: 'admin@loidabritish.com',
      passwordHash: adminHash,
      role: 'ADMIN',
      profile: { create: { language: 'en', timezone: 'Europe/London', interests: JSON.stringify(['HARMONY','CAREER','BUSINESS']) } },
      membership: { create: { plan: 'PROFESSIONAL', isActive: true } },
    },
  })

  // ── Demo user ───────────────────────────────
  const userHash = await bcrypt.hash('demo123456', 12)
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@loidabritish.com' },
    update: {},
    create: {
      name: 'Sarah Al-Rashid',
      email: 'demo@loidabritish.com',
      passwordHash: userHash,
      role: 'USER',
      profile: { create: { language: 'en', timezone: 'Europe/London', interests: JSON.stringify(['CAREER','HARMONY']), country: 'GB', city: 'London' } },
      membership: { create: { plan: 'PERSONAL', isActive: true } },
    },
  })

  // ── Assessments ─────────────────────────────
  const harmonyAssessment = await prisma.assessment.upsert({
    where: { id: 'assess-harmony-1' },
    update: {},
    create: {
      id: 'assess-harmony-1',
      title: 'Self-Awareness Profile',
      description: 'Discover your emotional intelligence, core values, and personal patterns. This assessment provides a deep map of who you are today.',
      domain: 'HARMONY',
      order: 1,
      questions: JSON.stringify([
        { id: 'q1', text: 'How well do you understand your own emotional triggers?', type: 'SCALE', options: [{ value: '1', label: 'Not at all' }, { value: '5', label: 'Very well' }] },
        { id: 'q2', text: 'What is your primary motivation in life right now?', type: 'SINGLE', options: [{ value: 'a', label: 'Personal growth' }, { value: 'b', label: 'Financial stability' }, { value: 'c', label: 'Relationships' }, { value: 'd', label: 'Career success' }] },
        { id: 'q3', text: 'How do you typically respond to failure?', type: 'SINGLE', options: [{ value: 'a', label: 'I blame myself' }, { value: 'b', label: 'I analyse and learn' }, { value: 'c', label: 'I move on quickly' }, { value: 'd', label: 'I avoid it' }] },
        { id: 'q4', text: 'Describe one area of your life you want to improve.', type: 'TEXT' },
        { id: 'q5', text: 'How often do you reflect on your own thoughts and behaviours?', type: 'SCALE', options: [{ value: '1', label: 'Rarely' }, { value: '5', label: 'Daily' }] },
      ]),
    },
  })

  const careerAssessment = await prisma.assessment.upsert({
    where: { id: 'assess-career-1' },
    update: {},
    create: {
      id: 'assess-career-1',
      title: 'Career Readiness Check',
      description: 'Evaluate your professional skills, readiness for the job market, and identify the gaps holding you back from your next career milestone.',
      domain: 'CAREER',
      order: 2,
      questions: JSON.stringify([
        { id: 'q1', text: 'What is your current career stage?', type: 'SINGLE', options: [{ value: 'a', label: 'Student / Graduate' }, { value: 'b', label: 'Early career (0-3 yrs)' }, { value: 'c', label: 'Mid-career (3-10 yrs)' }, { value: 'd', label: 'Senior / Executive' }] },
        { id: 'q2', text: 'How confident are you in your core professional skills?', type: 'SCALE', options: [{ value: '1', label: 'Not confident' }, { value: '5', label: 'Very confident' }] },
        { id: 'q3', text: 'What is your biggest career challenge right now?', type: 'MULTIPLE', options: [{ value: 'a', label: 'Finding opportunities' }, { value: 'b', label: 'Lack of skills' }, { value: 'c', label: 'Work-life balance' }, { value: 'd', label: 'Career direction' }] },
        { id: 'q4', text: 'Is your CV up to date and tailored to your target role?', type: 'SINGLE', options: [{ value: 'yes', label: 'Yes' }, { value: 'partial', label: 'Partially' }, { value: 'no', label: 'No' }] },
        { id: 'q5', text: 'Where do you want to be in your career in 2 years?', type: 'TEXT' },
      ]),
    },
  })

  const businessAssessment = await prisma.assessment.upsert({
    where: { id: 'assess-business-1' },
    update: {},
    create: {
      id: 'assess-business-1',
      title: 'Entrepreneurship Readiness',
      description: 'Assess your business mindset, risk tolerance, and market awareness. Understand where you stand on the entrepreneurship journey.',
      domain: 'BUSINESS',
      order: 3,
      questions: JSON.stringify([
        { id: 'q1', text: 'Do you have a business idea or existing venture?', type: 'SINGLE', options: [{ value: 'a', label: 'Yes, existing business' }, { value: 'b', label: 'Have an idea' }, { value: 'c', label: 'Exploring options' }, { value: 'd', label: 'Just curious' }] },
        { id: 'q2', text: 'How would you rate your business/market knowledge?', type: 'SCALE', options: [{ value: '1', label: 'Beginner' }, { value: '5', label: 'Expert' }] },
        { id: 'q3', text: 'What is your primary business goal?', type: 'MULTIPLE', options: [{ value: 'a', label: 'Launch a startup' }, { value: 'b', label: 'Scale existing business' }, { value: 'c', label: 'Build passive income' }, { value: 'd', label: 'Learn business strategy' }] },
        { id: 'q4', text: 'How comfortable are you with financial risk?', type: 'SCALE', options: [{ value: '1', label: 'Very risk-averse' }, { value: '5', label: 'High risk tolerance' }] },
        { id: 'q5', text: 'What is the biggest barrier to your business goals?', type: 'TEXT' },
      ]),
    },
  })

  // ── Programs ────────────────────────────────
  const programs = [
    { id: 'prog-1', title: 'Foundations of Self-Awareness', description: 'A transformative 6-week program that builds the emotional intelligence and self-knowledge you need to lead a meaningful life.', domain: 'HARMONY', type: 'COURSE', price: 0, currency: 'GBP', duration: '6 weeks', level: 'Beginner', isPublished: true, order: 1, tags: JSON.stringify(['self-awareness', 'emotional-intelligence', 'mindset']) },
    { id: 'prog-2', title: 'Career Acceleration Bootcamp', description: 'Eight intensive weeks covering CV writing, interview mastery, networking strategy, and personal branding for career changers and graduates.', domain: 'CAREER', type: 'BOOTCAMP', price: 149, currency: 'GBP', duration: '8 weeks', level: 'Intermediate', isPublished: true, order: 2, tags: JSON.stringify(['cv', 'interview', 'networking', 'career-change']) },
    { id: 'prog-3', title: 'The Business Clock Methodology', description: 'Master the proprietary Business Clock framework used by entrepreneurs across the UK. Hour-by-hour business strategy that works.', domain: 'BUSINESS', type: 'COURSE', price: 299, currency: 'GBP', duration: '10 weeks', level: 'Intermediate', isPublished: true, order: 3, tags: JSON.stringify(['strategy', 'entrepreneurship', 'business-clock']) },
    { id: 'prog-4', title: '1:1 Life Coaching — Harmony', description: 'Personal coaching sessions with certified Harmony coaches. Fully tailored to your self-awareness journey.', domain: 'HARMONY', type: 'COACHING', price: 199, currency: 'GBP', duration: 'Ongoing', level: 'All levels', isPublished: true, order: 4, tags: JSON.stringify(['coaching', 'personal-growth', 'one-on-one']) },
    { id: 'prog-5', title: 'Public Sector Leadership', description: 'Designed for professionals in public service. Develop leadership skills, improve administrative performance, and shape future institutions.', domain: 'CAREER', type: 'WORKSHOP', price: 89, currency: 'GBP', duration: '3 days', level: 'Advanced', isPublished: true, order: 5, tags: JSON.stringify(['leadership', 'public-sector', 'management']) },
    { id: 'prog-6', title: 'Startup to Scale: Business Mentoring', description: 'Work directly with experienced business mentors to develop your idea, build your prototype, and plan your go-to-market strategy.', domain: 'BUSINESS', type: 'COACHING', price: 399, currency: 'GBP', duration: '12 weeks', level: 'Intermediate', isPublished: true, order: 6, tags: JSON.stringify(['startup', 'mentoring', 'prototype', 'go-to-market']) },
  ]
  for (const p of programs) {
    await prisma.program.upsert({ where: { id: p.id }, update: {}, create: p })
  }

  // ── Demo enrollment ─────────────────────────
  await prisma.enrollment.upsert({
    where: { userId_programId: { userId: demoUser.id, programId: 'prog-1' } },
    update: {},
    create: { userId: demoUser.id, programId: 'prog-1', progress: 45, status: 'ACTIVE' },
  })

  await prisma.enrollment.upsert({
    where: { userId_programId: { userId: demoUser.id, programId: 'prog-2' } },
    update: {},
    create: { userId: demoUser.id, programId: 'prog-2', progress: 20, status: 'ACTIVE' },
  })

  // ── Demo assessment result ───────────────────
  await prisma.assessmentResult.upsert({
    where: { userId_assessmentId: { userId: demoUser.id, assessmentId: 'assess-career-1' } },
    update: {},
    create: {
      userId:        demoUser.id,
      assessmentId:  'assess-career-1',
      answers:       JSON.stringify({ q1: 'b', q2: '3', q3: ['a', 'd'], q4: 'partial', q5: 'Senior UX Designer at a tech company.' }),
      score:         72,
      recommendations: JSON.stringify([
        'Enroll in the Career Acceleration Bootcamp',
        'Book a CV review session with a career coach',
        'Explore the Personal Branding workshop',
      ]),
      report: JSON.stringify({
        domain: 'CAREER',
        title: 'Career Readiness Check',
        score: 72,
        insights: 'Good progress in your career journey. Some skill gaps to address before your next move.',
        completedAt: new Date().toISOString(),
      }),
    },
  })

  console.log('✅ Seed complete!')
  console.log('──────────────────────────────────')
  console.log('Admin:  admin@loidabritish.com / admin123456')
  console.log('Demo:   demo@loidabritish.com  / demo123456')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
