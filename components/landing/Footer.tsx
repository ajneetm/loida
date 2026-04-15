import Link from 'next/link'
import Image from 'next/image'

// FooterSITEFOOTER — matches loidabritish.com exact styling
// Font: Raleway (font-family-font-3), color: #022269 (azure-21)
export default function Footer() {
  return (
    <footer className="bg-white" style={{ fontFamily: 'Raleway, sans-serif' }}>
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Brand — "Loida British" heading 22px Raleway bold */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 relative">
                <Image
                  src="/images/logo.png"
                  alt="Loida British"
                  fill
                  className="object-contain"
                />
              </div>
              {/* "Loida British" — 22px Raleway bold, navy */}
              <h3
                className="text-[#022269] font-bold leading-none m-0 font-['Raleway']"
                style={{ fontSize: '22px' }}
              >
                Loida British
              </h3>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mb-5 font-['Inter']">
              The central hub for lifelong learning, coaching, and transformation. London-based, globally connected.
            </p>
            <div className="flex gap-2">
              {[
                { label: 'Instagram', href: 'https://www.instagram.com/loida.british/' },
                { label: 'LinkedIn',  href: 'https://www.linkedin.com/company/105144233/' },
                { label: 'Facebook',  href: 'https://www.facebook.com/profile.php?id=61566859705103' },
              ].map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  className="px-3 py-1.5 border border-gray-200 hover:border-[#022269] hover:text-[#022269] text-gray-400 text-xs font-medium  transition-colors font-['Inter']">
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-gray-400 text-xs tracking-[0.2em] uppercase font-semibold mb-4 font-['Inter']">Navigation</p>
            <ul className="space-y-2.5">
              {[
                { label: 'Home',           href: '/' },
                { label: 'About Us',       href: '/about' },
                { label: 'What We Offer',  href: '/#what-we-offer' },
                { label: 'Business Clock', href: '/#business-clock' },
                { label: 'Articles',       href: '/articles' },
                { label: 'Contact Us',     href: '/contact' },
                { label: 'Policies',       href: '/policies' },
              ].map(l => (
                <li key={l.label}>
                  <Link href={l.href} className="text-gray-500 hover:text-[#022269] text-sm transition-colors font-['Inter']">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-gray-400 text-xs tracking-[0.2em] uppercase font-semibold mb-4 font-['Inter']">Contact</p>
            <ul className="space-y-3 text-sm text-gray-500 font-['Inter']">
              <li>83 Baker Street, London W1U 6AG</li>
              <li>+44 8000 608 703</li>
              <li>
                <a href="mailto:info@loidabritish.com" className="hover:text-[#022269] transition-colors">
                  info@loidabritish.com
                </a>
              </li>
            </ul>
            <div className="mt-6">
              <Link href="/auth/login"
                className="inline-block bg-[#022269] hover:bg-[#011344] text-white text-sm font-medium px-5 py-2.5  transition-colors font-['Inter']">
                Log In / Sign Up
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 font-['Inter']">
          <p className="text-xs text-gray-400">© {new Date().getFullYear()} Loida British Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <p className="text-xs text-gray-400">Registered in England & Wales</p>
            {/* Policies link — Component11 variant 2: 12.3px, navy underlined */}
            <a
              href="/policies"
              className="text-[#022269] underline hover:opacity-70 transition-opacity"
              style={{ fontSize: '12.3px' }}
            >
              Loida British Policies
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
