import Link from 'next/link'

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-[#0A1628]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,#1A2B4A_0%,transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_70%_60%,#B8973A12_0%,transparent_70%)]" />

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: 'linear-gradient(#B8973A 1px, transparent 1px), linear-gradient(90deg, #B8973A 1px, transparent 1px)', backgroundSize: '80px 80px' }}
      />

      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/5 w-64 h-64 bg-[#6B8F9E]/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-[#B8973A]/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 bg-white/6 border border-white/12 rounded-full px-4 py-1.5 mb-8 animate-fade-in">
          <span className="w-1.5 h-1.5 rounded-full bg-[#B8973A] animate-pulse" />
          <span className="text-[11px] text-white/70 tracking-[0.2em] uppercase font-medium">
            Loida British — Central Hub
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-light text-white leading-[1.05] mb-6 opacity-0 animate-fade-up stagger-1" style={{ animationFillMode: 'forwards' }}>
          We Pave The Path<br />
          <span className="gradient-text font-medium">To Excellence.</span>
        </h1>

        {/* Subheading */}
        <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-12 opacity-0 animate-fade-up stagger-2" style={{ animationFillMode: 'forwards' }}>
          One hub. Three transformative platforms. A complete ecosystem for personal growth, career mastery, and entrepreneurial success — guided by expert coaches.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-fade-up stagger-3" style={{ animationFillMode: 'forwards' }}>
          <Link
            href="/auth/signup"
            className="group bg-[#B8973A] hover:bg-[#D4B05A] text-white px-8 py-4 rounded-full text-sm font-medium tracking-wide transition-all duration-300 flex items-center gap-2"
          >
            Start Your Journey
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
          <Link
            href="#domains"
            onClick={(e) => { e.preventDefault(); document.querySelector('#domains')?.scrollIntoView({ behavior: 'smooth' }) }}
            className="text-white/60 hover:text-white text-sm tracking-wide transition-colors flex items-center gap-2 px-4 py-4"
          >
            Explore the Platform
            <span>↓</span>
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-3 gap-8 max-w-2xl mx-auto opacity-0 animate-fade-up stagger-4" style={{ animationFillMode: 'forwards' }}>
          {[
            { value: '3', label: 'Platforms' },
            { value: '30+', label: 'Years Experience' },
            { value: '5K+', label: 'Lives Transformed' },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <p className="font-display text-3xl md:text-4xl text-white font-light">{stat.value}</p>
              <p className="text-white/40 text-xs tracking-widest uppercase mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#0A1628] to-transparent" />
    </section>
  )
}
