import Link from 'next/link'
import Image from 'next/image'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0A1628] flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_30%_50%,#1A2B4A,#060E1E)]" />
        <div className="absolute inset-0"
          style={{ backgroundImage: 'linear-gradient(#B8973A08 1px,transparent 1px),linear-gradient(90deg,#B8973A08 1px,transparent 1px)', backgroundSize: '60px 60px' }}
        />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-9 h-9 relative">
            <Image
              src="https://static.wixstatic.com/media/706dde_227e86ca03734151ba9b38890bb65bd0~mv2.png/v1/fill/w_305,h_299,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/logo%209989-13.png"
              alt="Loida British"
              fill
              className="object-contain brightness-0 invert"
            />
          </div>
          <div>
            <p className="text-white text-[13px] font-semibold tracking-[0.15em]">LOIDA BRITISH</p>
            <p className="text-[#B8973A] text-[9px] tracking-[0.2em] uppercase">Learning & Training</p>
          </div>
        </div>

        {/* Quote */}
        <div className="relative z-10">
          <p className="font-display text-4xl text-white font-light leading-tight mb-6">
            "The journey of a<br />
            thousand miles begins<br />
            with a <span className="gradient-text">single step.</span>"
          </p>
          <p className="text-white/30 text-sm">— Loida British Philosophy</p>

          {/* Platforms */}
          <div className="mt-10 flex flex-col gap-3">
            {[
              { name: 'Harmony', color: '#6B8F9E', desc: 'Self-awareness' },
              { name: 'Career for Everyone', color: '#B8973A', desc: 'Career development' },
              { name: 'The Business Clock', color: '#2C4A3E', desc: 'Entrepreneurship' },
            ].map(p => (
              <div key={p.name} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: p.color }} />
                <span className="text-white/60 text-sm">{p.name}</span>
                <span className="text-white/25 text-xs">— {p.desc}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-white/20 text-xs">
          © {new Date().getFullYear()} Loida British Ltd · 83 Baker St, London
        </p>
      </div>

      {/* Right panel — form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative">
        <div className="absolute top-6 left-6 lg:hidden">
          <Link href="/" className="text-white/50 text-sm hover:text-white transition-colors">← Back</Link>
        </div>
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  )
}
