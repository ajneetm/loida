import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'

export const metadata = {
  title: 'About Us | Loida British',
  description: 'Over three decades of experience transforming lives through education, coaching, and personal development.',
}

const values = [
  {
    title: 'Excellence',
    desc: 'We hold ourselves and our learners to the highest standards, driven by a commitment to quality in everything we deliver.',
  },
  {
    title: 'Inclusion',
    desc: 'We embrace diversity and ensure our programmes are accessible to individuals from all backgrounds, cultures, and walks of life.',
  },
  {
    title: 'Innovation',
    desc: 'We develop cutting-edge tools and frameworks — like The Business Clock — that go beyond traditional learning methods.',
  },
  {
    title: 'Integrity',
    desc: 'We operate with transparency and ethical responsibility, building trust with every learner, coach, and partner we work with.',
  },
]

const platforms = [
  {
    name: 'Harmony',
    color: '#607980',
    desc: 'A self-awareness platform focused on personal well-being, emotional intelligence, and holistic growth.',
  },
  {
    name: 'Career for Everyone',
    color: '#c71430',
    desc: 'Helping individuals navigate their career journey — from CV writing to job placement and professional development.',
  },
  {
    name: 'The Business Clock',
    color: '#022269',
    desc: 'An 8-stage entrepreneurship framework guiding business owners from vision to sustainable financial growth.',
  },
]

export default function AboutPage() {
  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="relative pt-[117px] min-h-[420px] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/who-we-are.jpg" alt="Loida British team" fill className="object-cover object-center" priority />
        </div>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(2,34,105,0.95) 0%, rgba(2,34,105,0.60) 60%, transparent 100%)' }} />
        <div className="relative z-10 max-w-6xl mx-auto px-6 pb-14 w-full">
          <p className="text-[#c71430] text-xs tracking-[0.3em] uppercase font-semibold mb-3 font-['Inter']">Who We Are</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white font-['Raleway'] leading-tight mb-3">
            About Loida British
          </h1>
          <p className="text-blue-200 text-lg font-['Tajawal'] max-w-xl">
            Over three decades of transforming lives through education, coaching, and personal development.
          </p>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="bg-[#f0f7f9] border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-2 text-sm font-['Inter']">
          <Link href="/" className="text-[#022269] hover:underline">Home</Link>
          <span className="text-gray-400">›</span>
          <span className="text-gray-500">About Us</span>
        </div>
      </div>

      {/* Who we are — story */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

            {/* Text — exact Wix content */}
            <div>
              <div className="w-12 h-1 bg-[#c71430] mb-6" />
              <h2 className="text-3xl font-bold text-[#022269] font-['Raleway'] mb-8">
                Who We Are
              </h2>
              <div className="space-y-5 font-['Inter'] text-gray-600 leading-relaxed">
                <p>
                  Our founders boast diverse backgrounds in business, entrepreneurship, and scientific knowledge.
                </p>
                <p>
                  Our academic qualifications range from advanced degrees such as MBAs in Business Administration
                  and Economics, to PhDs in Human Resources, Governance, and Sustainable Development.
                </p>
                <p>
                  Our team has played significant and strategic roles in the business world as CEOs and board
                  members of various profit and non-profit organizations.
                </p>
                <p>
                  Over the years, we have provided leadership across multiple sectors, contributing to the growth
                  and visions of numerous local and international entities.
                </p>
                <p>
                  Our expertise spans various sectors, with a strong focus on the human element at the core of
                  every activity and industry.
                </p>
              </div>
            </div>

            {/* Image */}
            <div className="relative h-[460px] overflow-hidden">
              <Image
                src="/images/who-we-are.jpg"
                alt="Loida British team"
                fill
                className="object-cover object-center"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-[#c71430] text-xs tracking-[0.3em] uppercase font-semibold mb-3 font-['Inter']">What Drives Us</p>
            <h2 className="text-3xl font-bold text-[#022269] font-['Raleway']">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <div key={i} className="bg-white p-7 border-t-4 border-[#022269] hover:border-[#c71430] transition-colors group">
                <p className="text-[#c71430] text-xs font-bold tracking-[0.2em] uppercase font-['Inter'] mb-3">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h3 className="text-lg font-bold text-[#022269] font-['Raleway'] mb-3 group-hover:text-[#c71430] transition-colors">
                  {v.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed font-['Inter']">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Platforms */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-[#c71430] text-xs tracking-[0.3em] uppercase font-semibold mb-3 font-['Inter']">Our Ecosystem</p>
            <h2 className="text-3xl font-bold text-[#022269] font-['Raleway']">Three Platforms, One Mission</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto font-['Inter']">
              Loida British operates three interconnected platforms, each serving a distinct dimension of personal and professional growth.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {platforms.map((p, i) => (
              <div key={i} className="p-8 border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-10 h-1 mb-5" style={{ background: p.color }} />
                <h3 className="text-xl font-bold text-[#022269] font-['Raleway'] mb-3">{p.name}</h3>
                <p className="text-gray-500 text-sm leading-relaxed font-['Inter']">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#022269]">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white font-['Raleway'] mb-4">Ready to Start Your Journey?</h2>
          <p className="text-blue-200 mb-8 font-['Tajawal'] text-lg">Explore our programmes or get in touch with our team today.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/#what-we-offer"
              className="bg-[#c71430] hover:bg-[#a01028] text-white font-semibold px-8 py-3 font-['Inter'] transition-colors text-sm">
              Our Programmes
            </Link>
            <Link href="/contact"
              className="border-2 border-white/50 hover:bg-white/10 text-white font-semibold px-8 py-3 font-['Inter'] transition-colors text-sm">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
