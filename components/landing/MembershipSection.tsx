import Link from 'next/link'
import { MembershipTier } from '@/types'

const tiers: MembershipTier[] = [
  {
    plan: 'FREE',
    name: 'Explorer',
    price: 0,
    currency: 'GBP',
    period: 'forever',
    features: [
      'Access to 1 assessment',
      'Basic progress dashboard',
      'Browse all programs',
      'Community access',
      'Monthly newsletter',
    ],
  },
  {
    plan: 'PERSONAL',
    name: 'Member',
    price: 29,
    currency: 'GBP',
    period: 'per month',
    highlighted: true,
    features: [
      'All 3 domain assessments',
      'Full personalised report',
      'Enroll in any program',
      '2 coach sessions/month',
      'Cross-platform journey',
      'Priority support',
    ],
  },
  {
    plan: 'PROFESSIONAL',
    name: 'Professional',
    price: 79,
    currency: 'GBP',
    period: 'per month',
    features: [
      'Everything in Member',
      'Unlimited coach sessions',
      'Coach certification track',
      'Build your own programs',
      'Performance analytics',
      'White-label resources',
    ],
  },
]

export default function MembershipSection() {
  return (
    <section id="membership" className="py-32 bg-[#0A1628]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-[#B8973A] text-xs tracking-[0.3em] uppercase mb-4 font-medium">Membership</p>
          <h2 className="font-display text-4xl md:text-5xl text-white font-light">
            Invest In Your Growth
          </h2>
          <p className="text-white/50 mt-4 max-w-lg mx-auto">
            Choose the plan that fits your journey. Upgrade or downgrade anytime.
          </p>
        </div>

        {/* Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {tiers.map(tier => (
            <div
              key={tier.plan}
              className={`relative rounded-2xl p-8 border transition-all duration-300 ${
                tier.highlighted
                  ? 'bg-[#B8973A] border-[#B8973A] text-white shadow-2xl shadow-[#B8973A]/20 scale-105'
                  : 'bg-white/3 border-white/8 text-white hover:border-white/20'
              }`}
            >
              {tier.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-white text-[#B8973A] text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <p className={`text-xs tracking-[0.2em] uppercase mb-1 font-medium ${tier.highlighted ? 'text-white/70' : 'text-white/40'}`}>
                  {tier.plan}
                </p>
                <h3 className="font-display text-2xl font-medium">{tier.name}</h3>
              </div>

              {/* Price */}
              <div className="mb-8 flex items-baseline gap-1">
                <span className={`text-sm ${tier.highlighted ? 'text-white/70' : 'text-white/40'}`}>£</span>
                <span className="font-display text-5xl font-light">{tier.price}</span>
                <span className={`text-sm ml-1 ${tier.highlighted ? 'text-white/70' : 'text-white/40'}`}>
                  / {tier.period}
                </span>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {tier.features.map(f => (
                  <li key={f} className={`flex items-start gap-2.5 text-sm ${tier.highlighted ? 'text-white/90' : 'text-white/60'}`}>
                    <span className={`mt-0.5 text-xs ${tier.highlighted ? 'text-white' : 'text-[#B8973A]'}`}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href="/auth/signup"
                className={`block text-center text-sm font-medium py-3 px-6 rounded-full transition-all duration-300 tracking-wide ${
                  tier.highlighted
                    ? 'bg-white text-[#B8973A] hover:bg-white/90'
                    : 'border border-white/20 text-white hover:border-[#B8973A] hover:text-[#B8973A]'
                }`}
              >
                {tier.price === 0 ? 'Get Started Free' : 'Start Now'}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
