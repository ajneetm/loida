import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'

const plans = [
  {
    plan: 'FREE',
    name: 'Explorer',
    price: 0,
    period: 'forever',
    features: ['1 assessment', 'Basic dashboard', 'Browse programs', 'Community access'],
  },
  {
    plan: 'PERSONAL',
    name: 'Member',
    price: 29,
    period: 'per month',
    highlight: true,
    features: ['All 3 assessments', 'Full reports', 'Unlimited programs', '2 sessions/month', 'Cross-platform journey', 'Priority support'],
  },
  {
    plan: 'PROFESSIONAL',
    name: 'Professional',
    price: 79,
    period: 'per month',
    features: ['Everything in Member', 'Unlimited sessions', 'Coach certification', 'Build programs', 'Analytics dashboard', 'White-label resources'],
  },
]

export default async function MembershipPage() {
  const session = await auth()
  const userId = session!.user!.id as string

  const membership = await prisma.membership.findUnique({ where: { userId } })
  const currentPlan = membership?.plan ?? 'FREE'

  return (
    <div className="max-w-5xl mx-auto space-y-8">

      {/* Current plan banner */}
      {membership && (
        <div className="bg-[#022269] rounded-none p-6 flex items-center justify-between">
          <div>
            <p className="text-[#c71430] text-xs tracking-[0.2em] uppercase mb-1">Current Plan</p>
            <h2 className="font-display text-2xl text-white font-light">
              {plans.find(p => p.plan === currentPlan)?.name ?? 'Explorer'}
            </h2>
            {membership.endDate && (
              <p className="text-white/40 text-xs mt-1">
                Renews {formatDate(membership.endDate)}
              </p>
            )}
          </div>
          <div className="text-right">
            <p className="text-white/30 text-xs">Status</p>
            <span className={`text-sm font-medium ${membership.isActive ? 'text-green-400' : 'text-red-400'}`}>
              {membership.isActive ? '● Active' : '○ Inactive'}
            </span>
          </div>
        </div>
      )}

      {/* Plans */}
      <h2 className="font-display text-2xl text-[#022269]">
        {currentPlan === 'FREE' ? 'Upgrade Your Journey' : 'Change Plan'}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {plans.map(plan => {
          const isCurrent = plan.plan === currentPlan
          return (
            <div key={plan.plan}
              className={`relative rounded-none border p-7 flex flex-col transition-all ${
                plan.highlight
                  ? 'bg-[#c71430] border-[#c71430] shadow-xl shadow-[#c71430]/15'
                  : 'bg-white border-stone-100 hover:border-stone-200'
              }`}>

              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-white text-[#c71430] text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-none">
                    Most Popular
                  </span>
                </div>
              )}

              {isCurrent && (
                <div className="absolute -top-3 right-4">
                  <span className="bg-green-500 text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-none">
                    Current
                  </span>
                </div>
              )}

              <div className="mb-5">
                <p className={`text-xs tracking-[0.2em] uppercase mb-1 ${plan.highlight ? 'text-white/60' : 'text-stone-400'}`}>
                  {plan.plan}
                </p>
                <h3 className={`font-display text-2xl font-medium ${plan.highlight ? 'text-white' : 'text-[#022269]'}`}>
                  {plan.name}
                </h3>
              </div>

              <div className={`flex items-baseline gap-1 mb-7 ${plan.highlight ? 'text-white' : 'text-[#022269]'}`}>
                <span className={`text-sm ${plan.highlight ? 'text-white/60' : 'text-stone-400'}`}>£</span>
                <span className="font-display text-5xl font-light">{plan.price}</span>
                <span className={`text-sm ${plan.highlight ? 'text-white/60' : 'text-stone-400'}`}>/ {plan.period}</span>
              </div>

              <ul className="space-y-2.5 flex-1 mb-7">
                {plan.features.map(f => (
                  <li key={f} className={`flex items-start gap-2 text-sm ${plan.highlight ? 'text-white/80' : 'text-stone-500'}`}>
                    <span className={`mt-0.5 text-xs flex-shrink-0 ${plan.highlight ? 'text-white' : 'text-[#c71430]'}`}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              {isCurrent ? (
                <div className={`text-center text-sm py-2.5 rounded-none border ${
                  plan.highlight ? 'border-white/30 text-white/60' : 'border-stone-200 text-stone-400'
                }`}>
                  Current Plan
                </div>
              ) : (
                <Link
                  href={`/api/membership/checkout?plan=${plan.plan}`}
                  className={`block text-center text-sm font-medium py-3 rounded-none transition-all ${
                    plan.highlight
                      ? 'bg-white text-[#c71430] hover:bg-white/90'
                      : 'bg-[#022269] text-white hover:bg-[#011344]'
                  }`}
                >
                  {plan.price === 0 ? 'Downgrade' : `Upgrade to ${plan.name}`}
                </Link>
              )}
            </div>
          )
        })}
      </div>

      {/* Feature comparison note */}
      <div className="bg-white rounded-none border border-stone-100 p-6 text-center">
        <p className="text-stone-400 text-sm">
          All plans include access to Harmony, Career for Everyone, and The Business Clock platforms.
        </p>
        <p className="text-stone-400 text-sm mt-1">
          Need help choosing? <Link href="/contact" className="text-[#c71430] hover:underline">Talk to our team →</Link>
        </p>
      </div>
    </div>
  )
}
