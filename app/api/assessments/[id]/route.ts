import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { z } from 'zod'

const submitSchema = z.object({
  answers: z.record(z.string(), z.any()),
})

// GET: single assessment by id
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const assessment = await prisma.assessment.findUnique({ where: { id: params.id } })
  if (!assessment) return NextResponse.json({ message: 'Not found' }, { status: 404 })
  return NextResponse.json({ ...assessment, questions: JSON.parse(assessment.questions as string) })
}

// POST: submit result
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  const userId       = session.user.id as string
  const assessmentId = params.id

  const body   = await req.json()
  const parsed = submitSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ message: 'Invalid input' }, { status: 400 })

  const assessment = await prisma.assessment.findUnique({ where: { id: assessmentId } })
  if (!assessment) return NextResponse.json({ message: 'Assessment not found' }, { status: 404 })

  // Simple scoring: count answered questions
  const questions = JSON.parse(assessment.questions as string) as any[]
  const answeredCount = Object.keys(parsed.data.answers).length
  const score = Math.round((answeredCount / Math.max(questions.length, 1)) * 100)

  // Generate basic recommendations based on domain
  const recommendations = generateRecommendations(assessment.domain as string, score)

  // Upsert result
  const result = await prisma.assessmentResult.upsert({
    where: { userId_assessmentId: { userId, assessmentId } },
    create: {
      userId,
      assessmentId,
      answers: JSON.stringify(parsed.data.answers),
      score,
      recommendations: JSON.stringify(recommendations),
      report: JSON.stringify({
        domain:    assessment.domain,
        title:     assessment.title,
        score,
        completedAt: new Date().toISOString(),
        insights:  generateInsights(assessment.domain as string, score),
      }),
    },
    update: {
      answers: JSON.stringify(parsed.data.answers),
      score,
      recommendations: JSON.stringify(recommendations),
      completedAt: new Date(),
    },
  })

  return NextResponse.json(result, { status: 201 })
}

function generateRecommendations(domain: string, _score: number): string[] {
  const recs: Record<string, string[]> = {
    HARMONY:  [
      'Explore the Harmony self-awareness program',
      'Book a 1:1 session with a Harmony coach',
      'Read our articles on emotional intelligence',
    ],
    CAREER:   [
      'Review the Career for Everyone pathway',
      'Enroll in our CV & Interview Readiness course',
      'Connect with a Career coach for guidance',
    ],
    BUSINESS: [
      'Dive into The Business Clock methodology',
      'Join our Entrepreneurship Bootcamp',
      'Schedule a strategy session with a Business mentor',
    ],
  }
  return recs[domain] ?? []
}

function generateInsights(domain: string, score: number): string {
  if (score >= 80) return `Excellent foundation in ${domain.toLowerCase()}. You are ready to advance.`
  if (score >= 50) return `Good progress in ${domain.toLowerCase()}. Some areas to develop further.`
  return `This is the beginning of your ${domain.toLowerCase()} journey. Great opportunity to grow.`
}
