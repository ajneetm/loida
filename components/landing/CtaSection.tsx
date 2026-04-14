import Link from 'next/link'

export default function CtaSection() {
  return (
    <section className="py-32 bg-[#0A1628] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,#B8973A10,transparent)]" />
      <div className="relative max-w-3xl mx-auto px-6 text-center">
        <p className="text-[#B8973A] text-xs tracking-[0.3em] uppercase mb-6 font-medium">Begin Today</p>
        <h2 className="font-display text-5xl md:text-7xl text-white font-light leading-tight mb-6">
          Your Path<br />Starts Here.
        </h2>
        <p className="text-white/50 text-lg mb-12 leading-relaxed">
          Join thousands who have transformed their lives through the Loida British ecosystem. Your journey is one step away.
        </p>
        <Link
          href="/auth/signup"
          className="inline-flex items-center gap-3 bg-[#B8973A] hover:bg-[#D4B05A] text-white px-10 py-5 rounded-full text-base font-medium tracking-wide transition-all duration-300 group"
        >
          Start Your Journey
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
        <p className="text-white/30 text-xs mt-6">Free to start. No credit card required.</p>
      </div>
    </section>
  )
}
