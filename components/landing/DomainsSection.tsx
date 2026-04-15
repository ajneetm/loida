'use client'
import Image from 'next/image'
import Link from 'next/link'
// Who We Are + What We Offer sections — exact Wix loidabritish.com layout

const programs = [
  {
    id: 'esol',
    title: 'ESOL Award',
    subtitle: 'International & Skills for Life qualifications',
    lines: [
      'Cover all English linguistic modes',
      '(Reading, Writing, Speaking & Listening)',
      'and are available as Awards and',
      'Certificates at all levels.',
    ],
    href: '/programs/esol',
    imageFirst: true,
    image: '/images/esol.jpg',
    imageAlt: 'ESOL Award — English language qualifications',
  },
  {
    id: 'lifeskills',
    title: 'Loida British Life Skills',
    subtitle: 'For those who are seeking a fresh start',
    lines: [
      'Our program is designed to equip you',
      'with the essential life skills, confidence,',
      'and motivation needed to move forward',
      'and achieve your goals.',
    ],
    href: '/programs/life-skills',
    imageFirst: false,
    image: '/images/lifeskills.jpg',
    imageAlt: 'Loida British Life Skills program',
  },
  {
    id: 'mentoring',
    title: 'Business Mentoring',
    subtitle: 'Practical tools to develop',
    lines: [
      'Develop innovative ideas with prototype',
      'creation and support your business',
      'journey with our training and mentoring',
      'experts.',
    ],
    href: '/programs/business-mentoring',
    imageFirst: true,
    image: '/images/mentoring.jpg',
    imageAlt: 'Business Mentoring — handshake and collaboration',
  },
  {
    id: 'publicsector',
    title: 'Training - Public Sector',
    subtitle: 'Shaping future leaders in public service',
    lines: [
      'Training in the public sector is a',
      'fundamental tool for developing human',
      'resources and improving administrative',
      'performance',
    ],
    href: '/programs/public-sector',
    imageFirst: false,
    image: '/images/publicsector.jpg',
    imageAlt: 'Public Sector Training — presentation and leadership',
  },
  {
    id: 'advanced',
    title: 'Advance courses',
    subtitle: 'Go further ... Learn deeper',
    lines: [
      'Explore specialized knowledge and',
      'sharpen your skills with our expertly',
      'designed, in-depth advanced courses',
      'today.',
    ],
    href: '/programs/advanced',
    imageFirst: true,
    image: '/images/advanced.jpg',
    imageAlt: 'Advanced Courses — specialized learning',
  },
]

export default function DomainsSection() {
  return (
    <>
      {/* ── WHO WE ARE ── */}
      <section id="who-we-are" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Text */}
            <div>
              <p className="text-[#1a73e8] text-xs tracking-[0.3em] uppercase font-semibold mb-4 font-['Inter']">Who We Are</p>
              <h2 className="font-bold text-[#022269] leading-tight mb-6 font-['Raleway']" style={{ fontSize: '40px' }}>
                Who We Are?
              </h2>
              {/* Component10 exact text sizes from Wix */}
              <p className="text-[#022269] font-normal leading-[28px] mb-3 font-['Tajawal']" style={{ fontSize: '20px' }}>
                Loida British Ltd, founded as a dynamic and innovative company with over three decades of extensive experience.
              </p>
              <p className="text-gray-500 leading-relaxed mb-8 font-['Inter']" style={{ fontSize: '16px' }}>
                We are committed to transforming lives through education, coaching, and personal development — paving the path to excellence for individuals, professionals, and entrepreneurs.
              </p>
              {/* Component10 button: white bg, black text, 17.4px, letter-spacing 0.9px */}
              <Link
                href="/about"
                className="bg-white text-black flex items-center justify-center cursor-pointer font-['Inter'] no-underline hover:bg-gray-100 transition-colors border border-gray-200 shadow-sm"
                style={{ fontSize: '17.4px', letterSpacing: '0.9px', width: '117px', height: '33px' }}
              >
                For More
              </Link>
            </div>

            {/* Stats visual */}
            <div className="relative">
              <div className="relative min-h-[300px] overflow-hidden">
                <Image
                  src="/images/who-we-are.jpg"
                  alt="Loida British team working together"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                {/* Overlay with stats */}
                <div className="relative z-10 bg-[#022269]/80 p-10 min-h-[300px] flex items-center justify-center">
                  <div className="grid grid-cols-3 gap-6 text-center w-full">
                    {[
                      { value: '30+', label: 'Years Experience' },
                      { value: '5K+', label: 'Lives Transformed' },
                      { value: '5',   label: 'Key Programs' },
                    ].map(stat => (
                      <div key={stat.label}>
                        <p className="font-bold text-white font-['Raleway']" style={{ fontSize: '36px' }}>{stat.value}</p>
                        <p className="text-blue-200 text-xs tracking-wide mt-1 font-['Inter']">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-[#022269] text-white  p-4 shadow-xl">
                <p className="font-bold font-['Raleway']" style={{ fontSize: '20px' }}>UK</p>
                <p className="text-xs text-blue-200 font-['Inter']">Based & Certified</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT WE OFFER ── */}
      <section id="what-we-offer">
        {/* Red header bar — exact Wix "What We Offer?" banner */}
        <div className="bg-[#c71430] py-3 text-center">
          <h2 className="text-white font-bold font-['Raleway']" style={{ fontSize: '40px' }}>
            What We Offer?
          </h2>
        </div>

        {/* Programs — alternating image/text layout (SectioncompLz5bwf1d) */}
        {programs.map((prog) => (
          <div
            key={prog.id}
            className={`flex flex-col ${prog.imageFirst ? 'md:flex-row' : 'md:flex-row-reverse'} min-h-[472px]`}
          >
            {/* Image panel */}
            <div className="w-full md:w-1/2 min-h-[472px] bg-[#022269] flex-shrink-0 relative overflow-hidden">
              <Image
                src={prog.image}
                alt={prog.imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            {/* Text panel — exact SectioncompLz5bwf1d typography */}
            <div className="w-full md:w-1/2 bg-white flex flex-col justify-center px-12 py-10">
              {/* Title: 45px Raleway bold, text-color-azure-21 */}
              <h2
                className="font-bold text-[#022269] font-['Raleway'] mb-0 leading-tight"
                style={{ fontSize: '45px' }}
              >
                {prog.title}
              </h2>

              {/* Subtitle: 25px red, Tajawal */}
              <p
                className="text-[#c71430] font-normal font-['Tajawal'] mt-2 mb-4"
                style={{ fontSize: '25px' }}
              >
                {prog.subtitle}
              </p>

              {/* Body lines: 25px navy, Tajawal, line-height 32.4px */}
              <div className="mb-6">
                {prog.lines.map((line, i) => (
                  <p
                    key={i}
                    className="text-[#022269] font-normal font-['Tajawal']"
                    style={{ fontSize: '25px', lineHeight: '32.4px' }}
                  >
                    {line}
                  </p>
                ))}
              </div>

              {/* Read More button: Component11 exact — red text, 19.4px, 122px wide, 42px tall */}
              <Link
                href={prog.href}
                className="flex items-center justify-center text-[#c71430] font-['Inter'] no-underline hover:opacity-70 transition-opacity cursor-pointer"
                style={{ fontSize: '19.4px', width: '122px', height: '42px' }}
              >
                Read More
              </Link>
            </div>
          </div>
        ))}
      </section>
    </>
  )
}
