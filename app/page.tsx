'use client';
import Navbar from '@/components/landing/Navbar'
import HeroSection from '@/components/landing/HeroSection'
import DomainsSection from '@/components/landing/DomainsSection'
import HowItWorksSection from '@/components/landing/HowItWorksSection'
import MembershipSection from '@/components/landing/MembershipSection'
import TestimonialsSection from '@/components/landing/TestimonialsSection'
import CtaSection from '@/components/landing/CtaSection'
import Footer from '@/components/landing/Footer'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0A1628] text-white overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <DomainsSection />
      <HowItWorksSection />
      <MembershipSection />
      <TestimonialsSection />
      <CtaSection />
      <Footer />
    </main>
  )
}
