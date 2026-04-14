import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  }).format(new Date(date))
}

export function formatCurrency(amount: number, currency = 'GBP') {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency', currency,
  }).format(amount)
}

export function getDomainColor(domain: string) {
  const colors: Record<string, string> = {
    HARMONY:  '#6B8F9E',
    CAREER:   '#B8973A',
    BUSINESS: '#2C4A3E',
    GENERAL:  '#1A2340',
  }
  return colors[domain] ?? '#1A2340'
}

export function getDomainLabel(domain: string) {
  const labels: Record<string, string> = {
    HARMONY:  'Harmony',
    CAREER:   'Career for Everyone',
    BUSINESS: 'The Business Clock',
    GENERAL:  'General',
  }
  return labels[domain] ?? domain
}

export function getInitials(name?: string | null) {
  if (!name) return 'LB'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

export function slugify(text: string) {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
}
