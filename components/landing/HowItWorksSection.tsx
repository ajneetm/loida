const steps = [
  {
    number: '01',
    title: 'Take an Assessment',
    description: 'Begin with a guided self-discovery assessment across any of the three domains. Understand where you are today.',
    icon: '◎',
    color: '#6B8F9E',
  },
  {
    number: '02',
    title: 'Receive Your Report',
    description: 'Get a structured, personalised report with insights, scores, and recommended next steps tailored to you.',
    icon: '◈',
    color: '#B8973A',
  },
  {
    number: '03',
    title: 'Join a Program',
    description: 'Enroll in courses, workshops or coaching sessions designed around your assessment results and goals.',
    icon: '◉',
    color: '#2C4A3E',
  },
  {
    number: '04',
    title: 'Work With a Coach',
    description: 'Book 1:1 sessions with certified Loida British coaches. Track progress and unlock new opportunities.',
    icon: '◆',
    color: '#B8973A',
  },
]

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-32 bg-[#060E1E]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="max-w-2xl mb-20">
          <p className="text-[#B8973A] text-xs tracking-[0.3em] uppercase mb-4 font-medium">The Process</p>
          <h2 className="font-display text-4xl md:text-5xl text-white font-light leading-tight">
            Your Journey,<br />Structured.
          </h2>
          <p className="text-white/50 mt-5 leading-relaxed">
            A proven four-step process that transforms aspiration into achievement — at every stage of life.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/6 rounded-2xl overflow-hidden">
          {steps.map((step, i) => (
            <div key={step.number} className="bg-[#060E1E] p-8 relative group hover:bg-[#0A1628] transition-colors duration-300">
              {/* Connector line (desktop) */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute right-0 top-12 w-px h-8 bg-white/10" />
              )}

              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-lg mb-6 transition-transform duration-300 group-hover:scale-110"
                style={{ background: `${step.color}15`, color: step.color }}
              >
                {step.icon}
              </div>

              <p className="font-display text-4xl text-white/8 font-light mb-4 group-hover:text-white/12 transition-colors">
                {step.number}
              </p>

              <h3 className="text-white font-medium text-lg mb-3 leading-tight">{step.title}</h3>
              <p className="text-white/45 text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
