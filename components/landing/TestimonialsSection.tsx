// components/landing/TestimonialsSection.tsx
const testimonials = [
  {
    name: 'Sarah Al-Rashid',
    role: 'Career Transitioner → UX Designer',
    domain: 'CAREER',
    quote: 'The career assessment pinpointed exactly what was blocking me. Six months later, I landed my dream role in tech.',
    initials: 'SR',
  },
  {
    name: 'James Okonkwo',
    role: 'Startup Founder',
    domain: 'BUSINESS',
    quote: 'The Business Clock methodology transformed how I think about market timing. My startup is now profitable.',
    initials: 'JO',
  },
  {
    name: 'Layla Hassan',
    role: 'Executive Coach',
    domain: 'HARMONY',
    quote: 'Harmony helped me understand myself deeply before I could lead others. Now I am a certified coach on this platform.',
    initials: 'LH',
  },
]

const domainColors: Record<string, string> = {
  CAREER: '#B8973A',
  BUSINESS: '#2C4A3E',
  HARMONY: '#6B8F9E',
}

export default function TestimonialsSection() {
  return (
    <section className="py-32 bg-[#060E1E]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-[#B8973A] text-xs tracking-[0.3em] uppercase mb-4">Success Stories</p>
          <h2 className="font-display text-4xl md:text-5xl text-white font-light">Real Transformations</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map(t => (
            <div key={t.name} className="bg-white/3 border border-white/8 rounded-2xl p-8 hover:border-white/16 transition-colors">
              <div
                className="w-2 h-8 rounded-full mb-6"
                style={{ background: domainColors[t.domain] }}
              />
              <p className="text-white/70 text-sm leading-relaxed mb-8 italic">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-semibold"
                  style={{ background: `${domainColors[t.domain]}20`, color: domainColors[t.domain] }}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{t.name}</p>
                  <p className="text-white/40 text-xs">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
