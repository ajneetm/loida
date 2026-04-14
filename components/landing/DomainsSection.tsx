import Link from 'next/link'
import { DOMAINS } from '@/types'

export default function DomainsSection() {
  return (
    <section id="domains" className="py-32 bg-[#0A1628]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20">
          <p className="text-[#B8973A] text-xs tracking-[0.3em] uppercase mb-4 font-medium">The Ecosystem</p>
          <h2 className="font-display text-4xl md:text-6xl text-white font-light leading-tight">
            Three Paths.<br />
            <span className="text-white/50">One Journey.</span>
          </h2>
          <p className="text-white/50 mt-6 max-w-xl mx-auto leading-relaxed">
            Enter from any platform. Everything flows back to your central profile — your progress, your assessments, your coaches.
          </p>
        </div>

        {/* Domain cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {DOMAINS.map((domain, i) => (
            <div
              key={domain.id}
              className="group relative rounded-2xl border border-white/8 overflow-hidden bg-white/3 hover:bg-white/6 transition-all duration-500 hover:-translate-y-1"
            >
              {/* Color accent */}
              <div
                className="absolute top-0 inset-x-0 h-px"
                style={{ background: `linear-gradient(90deg, transparent, ${domain.color}, transparent)` }}
              />
              <div
                className="absolute top-0 left-0 w-full h-32 opacity-10 group-hover:opacity-20 transition-opacity duration-500"
                style={{ background: `radial-gradient(ellipse at 50% 0%, ${domain.color}, transparent 70%)` }}
              />

              <div className="relative p-8">
                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-6 border"
                  style={{ borderColor: `${domain.color}30`, background: `${domain.color}10`, color: domain.color }}
                >
                  {domain.icon}
                </div>

                {/* Number */}
                <p className="text-white/15 font-display text-5xl font-light absolute top-6 right-7">0{i + 1}</p>

                <p className="text-white/40 text-[10px] tracking-[0.25em] uppercase mb-2">
                  {domain.id === 'HARMONY' ? 'Self-Awareness' : domain.id === 'CAREER' ? 'Career Development' : 'Entrepreneurship'}
                </p>
                <h3 className="font-display text-2xl text-white font-medium mb-2">{domain.name}</h3>
                <p className="text-sm mb-4" style={{ color: domain.color }}>{domain.tagline}</p>
                <p className="text-white/50 text-sm leading-relaxed mb-8">{domain.description}</p>

                {/* Features */}
                <ul className="space-y-2 mb-8">
                  {getDomainFeatures(domain.id).map(f => (
                    <li key={f} className="flex items-center gap-2 text-white/40 text-[13px]">
                      <span style={{ color: domain.color }} className="text-xs">✦</span>
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <a
                  href={domain.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[13px] font-medium tracking-wide border rounded-full px-5 py-2 transition-all duration-300 hover:text-white"
                  style={{ borderColor: `${domain.color}50`, color: domain.color }}
                >
                  Explore {domain.name}
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Cross-platform flow note */}
        <div className="mt-12 text-center">
          <p className="text-white/30 text-sm">
            ✦ Smart recommendations guide you between platforms based on your progress
          </p>
        </div>
      </div>
    </section>
  )
}

function getDomainFeatures(domain: string): string[] {
  const features: Record<string, string[]> = {
    HARMONY:  ['Self-awareness assessments', 'Emotional intelligence coaching', 'Personal growth programs', 'Mindset & resilience training'],
    CAREER:   ['Career path assessment', 'Skills gap analysis', 'CV & interview coaching', 'Job readiness programs'],
    BUSINESS: ['Business Clock methodology', 'Entrepreneurship bootcamps', 'Market strategy coaching', 'Startup mentoring'],
  }
  return features[domain] ?? []
}
