'use client';
import Navbar from '@/components/landing/Navbar'
import HeroSection from '@/components/landing/HeroSection'
import SliderSection from '@/components/landing/SliderSection'
import DomainsSection from '@/components/landing/DomainsSection'
import HowItWorksSection from '@/components/landing/HowItWorksSection'
import MembershipSection from '@/components/landing/MembershipSection'
import Footer from '@/components/landing/Footer'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-gray-800 overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <SliderSection />
      <DomainsSection />
      <HowItWorksSection />
      <MembershipSection />
      <Footer />
    </main>
  )
}
