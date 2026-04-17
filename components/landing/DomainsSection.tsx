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

            {/* Image with color overlay + logo */}
            <div className="relative min-h-[320px] overflow-hidden">
              <Image
                src="/images/who-we-are.jpg"
                alt="Loida British team working together"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-[#022269]/70" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10">
                <div className="relative w-32 h-32">
                  <Image src="/images/whiteredlogo.svg" alt="Loida British" fill className="object-contain" />
                </div>
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
            className={`relative z-0 flex flex-col ${prog.imageFirst ? 'md:flex-row' : 'md:flex-row-reverse'}`}
          >
            {/* Image panel */}
            <div className="w-full md:w-1/2 h-64 md:h-auto md:min-h-[472px] bg-[#022269] flex-shrink-0 relative overflow-hidden">
              <Image
                src={prog.image}
                alt={prog.imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            {/* Text panel */}
            <div className="w-full md:w-1/2 bg-white flex flex-col justify-center px-6 md:px-12 py-10">
              <h2 className="font-bold text-[#022269] font-['Raleway'] mb-0 leading-tight text-3xl md:text-[45px]">
                {prog.title}
              </h2>

              <p className="text-[#c71430] font-normal font-['Tajawal'] mt-2 mb-4 text-lg md:text-[25px]">
                {prog.subtitle}
              </p>

              <div className="mb-6">
                {prog.lines.map((line, i) => (
                  <p
                    key={i}
                    className="text-[#022269] font-normal font-['Tajawal'] text-base md:text-[25px]"
                    style={{ lineHeight: '1.6' }}
                  >
                    {line}
                  </p>
                ))}
              </div>

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
