import Link from 'next/link'
import Image from 'next/image'

const footerLinks = {
  Platform: [
    { label: 'Harmony', href: 'https://harmony.loidabritish.com' },
    { label: 'Career for Everyone', href: 'https://career.loidabritish.com' },
    { label: 'The Business Clock', href: 'https://businessclock.loidabritish.com' },
  ],
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'Our Coaches', href: '/coaches' },
    { label: 'Articles', href: '/articles' },
    { label: 'Contact', href: '/contact' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/policies/privacy' },
    { label: 'Terms of Service', href: '/policies/terms' },
    { label: 'Cookie Policy', href: '/policies/cookies' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-[#060E1E] border-t border-white/6">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 relative">
                <Image
                  src="https://static.wixstatic.com/media/706dde_227e86ca03734151ba9b38890bb65bd0~mv2.png/v1/fill/w_305,h_299,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/logo%209989-13.png"
                  alt="Loida British"
                  fill
                  className="object-contain brightness-0 invert"
                />
              </div>
              <div>
                <p className="text-white text-[12px] font-semibold tracking-[0.15em]">LOIDA BRITISH</p>
                <p className="text-[#B8973A] text-[9px] tracking-[0.2em] uppercase">Learning & Training</p>
              </div>
            </div>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs">
              The central hub for lifelong learning, coaching, and transformation. London-based, globally connected.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a href="https://www.instagram.com/loida.british/" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all text-xs">
                IG
              </a>
              <a href="https://www.linkedin.com/company/105144233/" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all text-xs">
                in
              </a>
              <a href="https://www.facebook.com/profile.php?id=61566859705103" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all text-xs">
                fb
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <p className="text-white/30 text-[10px] tracking-[0.25em] uppercase mb-4 font-medium">{group}</p>
              <ul className="space-y-3">
                {links.map(link => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-white/50 text-sm hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-white/6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/25 text-xs">
            © {new Date().getFullYear()} Loida British Ltd. All rights reserved. 83 Baker St, London W1U 6AG.
          </p>
          <p className="text-white/20 text-xs">
            +44 8000608703 · info@loidabritish.com
          </p>
        </div>
      </div>
    </footer>
  )
}
