// types/index.ts

export type Domain = 'HARMONY' | 'CAREER' | 'BUSINESS'
export type UserRole = 'USER' | 'COACH' | 'ADMIN'
export type MembershipPlan = 'FREE' | 'PERSONAL' | 'PROFESSIONAL'
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'
export type CoachStatus = 'PENDING' | 'APPROVED' | 'REJECTED'
export type ProgramType = 'COURSE' | 'COACHING' | 'WORKSHOP' | 'BOOTCAMP'

export interface DomainConfig {
  id: Domain
  name: string
  tagline: string
  description: string
  color: string
  gradient: string
  icon: string
  href: string
}

export const DOMAINS: DomainConfig[] = [
  {
    id: 'HARMONY',
    name: 'Harmony',
    tagline: 'Know Yourself. Lead Yourself.',
    description: 'Self-awareness, emotional intelligence, and personal guidance to unlock your inner potential.',
    color: '#6B8F9E',
    gradient: 'from-[#6B8F9E] to-[#4A7286]',
    icon: '◎',
    href: 'https://harmony.loidabritish.com',
  },
  {
    id: 'CAREER',
    name: 'Career for Everyone',
    tagline: 'Find Your Path. Own Your Future.',
    description: 'Career assessment, professional development, and job readiness for every stage of your journey.',
    color: '#B8973A',
    gradient: 'from-[#B8973A] to-[#8A6E25]',
    icon: '◈',
    href: 'https://career.loidabritish.com',
  },
  {
    id: 'BUSINESS',
    name: 'The Business Clock',
    tagline: 'Build Smart. Grow Strategically.',
    description: 'Entrepreneurship, business strategy, and market intelligence — hour by hour.',
    color: '#2C4A3E',
    gradient: 'from-[#2C4A3E] to-[#1A2E26]',
    icon: '◉',
    href: 'https://businessclock.loidabritish.com',
  },
]

export interface MembershipTier {
  plan: MembershipPlan
  name: string
  price: number
  currency: string
  period: string
  features: string[]
  highlighted?: boolean
}

export interface AssessmentQuestion {
  id: string
  text: string
  type: 'SINGLE' | 'MULTIPLE' | 'SCALE' | 'TEXT'
  options?: { value: string; label: string }[]
  required: boolean
}

export interface DashboardStats {
  programsEnrolled: number
  assessmentsCompleted: number
  upcomingSessions: number
  overallProgress: number
}
