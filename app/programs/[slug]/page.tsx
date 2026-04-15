import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'

/* ─── Advanced sub-courses ─────────────────────────────────────────── */
const advancedCourses = [
  { title: 'Business Level 3, 4 & 5',            color: '#022269',
    desc: 'In-depth understanding of how organisations operate — covering finance, administration, HR, economics, and marketing to succeed in business and management roles.' },
  { title: 'Information & Communication Technology', color: '#607980',
    desc: 'Computer-based technologies and their applications — hardware, software, programming, networking, and digital media, preparing students for IT industry careers.' },
  { title: 'Health & Social Care',                color: '#c71430',
    desc: 'Knowledge, skills, and practical experience for the health and social care sector — care ethics, communication, anatomy, physiology, and social policy.' },
  { title: 'Education & Training',                color: '#022269',
    desc: 'Skills and practices needed to effectively teach or train others — lesson planning, engaging instruction, and assessment for aspiring educators and trainers.' },
  { title: 'Computing',                           color: '#607980',
    desc: 'Principles and practices of computing — programming, software development, hardware, and cybersecurity for a comprehensive understanding of modern technology.' },
  { title: 'Diploma in Law',                      color: '#c71430',
    desc: 'A conversion course for graduates pursuing a legal career — foundational legal principles and preparation for the Solicitors Qualifying Exam (SQE).' },
  { title: 'Diploma in Accounting',               color: '#022269',
    desc: 'Practical accounting principles and practices — a stepping stone to further study or career opportunities in the accounting and finance field.' },
  { title: 'Diploma in Applied Chemistry',        color: '#607980',
    desc: 'Vocational qualification in applied science — organic, inorganic, and analytical chemistry, along with spectroscopy and laboratory techniques.' },
  { title: 'Chemistry A Level',                   color: '#c71430',
    desc: 'Advanced-level qualification building on GCSE — physical, organic, and inorganic chemistry for higher education or professional pathways.' },
  { title: 'Biology A Level',                     color: '#022269',
    desc: 'Study of living organisms — cell biology, genetics, physiology, and ecology with hands-on practical skills development throughout the course.' },
  { title: 'Maths A Level',                       color: '#607980',
    desc: 'Rigorous mathematics building on GCSE — essential for science, engineering, economics, or other quantitative degree pathways.' },
  { title: 'Psychology A Level',                  color: '#c71430',
    desc: 'Scientific study of human behaviour and mental processes — covering social influence, memory, attachment, and psychopathology with real-world applications.' },
  { title: 'Access to Midwifery',                color: '#022269',
    desc: 'Level 3 Access to Higher Education Diploma preparing students for a midwifery degree — covering human biology, midwifery studies, and relevant social sciences.' },
  { title: 'Access to Medicine',                  color: '#607980',
    desc: 'Specialised Access to HE Diploma for mature learners — an alternative route to university medicine programmes for those without standard A-level entry requirements.' },
  { title: 'Access to Science',                   color: '#c71430',
    desc: 'Level 3 qualification preparing adults for science degrees — covering biology, chemistry, and physics alongside study skills for university-level study.' },
]

/* ─── Program data ──────────────────────────────────────────────────── */
type Section = {
  heading: string
  body?: string
  numbered?: { label: string; text: string }[]
  bullets?: string[]
  impact?: string[]
  table?: { col1: string; col2: string; col3: string }[]
}

const programs: Record<string, {
  title: string
  subtitle: string
  image: string
  imageAlt: string
  accentColor: string
  intro: string
  sections: Section[]
  cta: string
  isAdvanced?: boolean
  subCards?: { title: string; desc?: string }[]
}> = {

  /* ── ESOL ── */
  esol: {
    title: 'ESOL Award',
    subtitle: 'International & Skills for Life qualifications',
    image: '/images/esol-hero.jpg',
    imageAlt: 'ESOL English language qualifications',
    accentColor: '#c71430',
    intro: 'Our ESOL qualifications cover all English linguistic modes — Reading, Writing, Speaking & Listening — and are available as Awards and Certificates at all levels from Entry 1 through Level 2.',
    sections: [
      {
        heading: 'ESOL International Qualifications',
        body: 'Designed for candidates who are not native speakers of English and who wish to achieve a high-quality, internationally recognised qualification. Ideal for candidates preparing for entry to higher education or professional employment in the UK or elsewhere.',
        table: [
          { col1: 'Entry 1 (CEFR A1)', col2: 'Entry Level Certificate in ESOL International', col3: 'Suitable for those at the very beginning of their English language journey.' },
          { col1: 'Entry 2 (CEFR A2)', col2: 'Entry Level Certificate in ESOL International', col3: 'Suitable for those preparing for higher education or professional employment in the UK or globally.' },
          { col1: 'Entry 3 (CEFR B1)', col2: 'Entry Level Certificate in ESOL International', col3: 'For candidates with a good grounding in English seeking formal recognition.' },
          { col1: 'Level 1 (CEFR B2)', col2: 'Level 1 Certificate in ESOL International', col3: 'For candidates demonstrating upper-intermediate English competence.' },
          { col1: 'Level 2 (CEFR C1)', col2: 'Level 2 Certificate in ESOL International', col3: 'Advanced level — ideal for those aiming for higher education or professional settings.' },
        ],
      },
      {
        heading: 'ESOL Skills for Life',
        body: 'These qualifications help learners who are not native English speakers to get or advance in sustainable jobs, gain skills for daily life, and become more independent.',
        bullets: [
          'Get or advance in sustainable jobs',
          'Gain skills for daily life activities',
          'Become more independent',
          'Connect with the wider society',
          'Build social confidence',
          'Access various services and benefits',
        ],
      },
      {
        heading: 'Available Qualifications',
        body: 'All qualifications are regulated, nationally recognised, and available across multiple levels.',
        bullets: [
          'Entry Level Award in ESOL Skills for Life — Writing (Entry 1)',
          'Entry Level Award in ESOL Skills for Life — Reading (Entry 1)',
          'Entry Level Certificate in ESOL Skills for Life (Entry 1)',
          'Level 1 Award in ESOL Skills for Life',
          'Level 2 Certificate in ESOL Skills for Life',
        ],
      },
    ],
    cta: 'Enrol in ESOL',
  },

  /* ── Life Skills ── */
  'life-skills': {
    title: 'Loida British Life Skills',
    subtitle: 'For those who are seeking a fresh start',
    image: '/images/lifeskills-hero.jpg',
    imageAlt: 'Life Skills programme',
    accentColor: '#022269',
    intro: 'At Loida British Life Skills, we are committed to supporting individuals who are seeking a fresh start. Our programme is designed to equip you with the essential life skills, confidence, and motivation needed to move forward and achieve your goals.',
    sections: [
      {
        heading: 'Why Choose Our Life Skills Course?',
        numbered: [
          { label: 'Comprehensive Skill Development', text: 'Our course covers a wide range of essential life skills, including communication, problem-solving, time management, and financial literacy — crucial for personal growth and career readiness.' },
          { label: 'Empowerment & Confidence Building', text: 'Our supportive environment and tailored guidance are focused on boosting your self-esteem and empowering you to take proactive steps towards a better future.' },
          { label: 'Practical & Applicable Lessons', text: 'Our curriculum is designed to be practical and directly applicable to real-life situations. You\'ll learn to navigate daily challenges, manage stress, and set achievable goals.' },
          { label: 'Career Readiness', text: 'From crafting a standout CV to acing job interviews, we provide the tools and knowledge you need to secure employment and present your best self to potential employers.' },
        ],
      },
      {
        heading: 'Our Impact',
        impact: [
          'Personal Growth — gain the confidence and skills necessary to take control of your life and pursue new opportunities with a positive outlook',
          'Career Advancement — equip yourself with the tools needed to re-enter the workforce, transition to a new career path, or start your own venture',
          'Community & Support — join a community of like-minded individuals on a similar journey. Share experiences, support each other, and celebrate successes together',
        ],
      },
      {
        heading: 'Life Skills Programme for Senior Managers & CEOs',
        body: 'Welcome to the Life Skills Programme at Loida British Ltd, designed exclusively for senior managers and CEOs dedicated to holistic personal and professional development. This programme is tailored to help you achieve a balanced and fulfilling life while excelling in your leadership roles.',
        numbered: [
          { label: 'Leadership Excellence', text: 'Enhance your decision-making with advanced leadership techniques. Develop emotional intelligence to better understand and motivate your team. Foster a culture of innovation and resilience within your organisation.' },
          { label: 'Work-Life Balance', text: 'Learn effective time management strategies to balance professional responsibilities with personal life. Incorporate mindfulness and stress-reduction practices to maintain peak performance.' },
          { label: 'Effective Communication', text: 'Master the art of clear and impactful communication. Improve your negotiation skills and conflict resolution strategies. Enhance your ability to inspire and engage with your team.' },
          { label: 'Personal Well-being', text: 'Adopt healthy lifestyle habits to sustain high energy levels and mental clarity. Understand the importance of physical fitness and nutrition in maintaining productivity.' },
          { label: 'Strategic Thinking', text: 'Strengthen your strategic planning and execution skills. Learn to anticipate market trends and adapt proactively. Cultivate a long-term vision for sustained organisational growth.' },
          { label: 'Networking & Relationships', text: 'Build a robust network of like-minded senior professionals and industry leaders. Enhance your relationship-building skills to foster meaningful professional connections and leverage your network for growth.' },
        ],
      },
      {
        heading: 'Join Us',
        body: 'At Loida British Life Skills, we believe that everyone deserves a chance to succeed and thrive. Our dedicated team is here to provide the helping hand you need to move forward in life. Join us today and take the first step towards a brighter, more fulfilling future.',
      },
    ],
    cta: 'Join the Programme',
  },

  /* ── Business Mentoring ── */
  'business-mentoring': {
    title: 'Business Mentoring',
    subtitle: 'Practical tools to develop your potential',
    image: '/images/mentoring-hero.jpg',
    imageAlt: 'Business mentoring and collaboration',
    accentColor: '#c71430',
    intro: 'At Loida British Mentoring, we are dedicated to empowering individuals to reach their highest potential and achieve substantial financial growth. Our comprehensive mentoring programme provides personalised guidance, expert advice, and strategic insights.',
    sections: [
      {
        heading: 'Why Choose Us?',
        numbered: [
          { label: 'Personalised Mentorship', text: 'Every professional\'s journey is unique, and so is our approach. We offer customised mentoring sessions that address your specific goals and challenges, ensuring you receive the guidance and support you need to excel.' },
          { label: 'Expert Guidance', text: 'Our mentors are seasoned industry leaders with a wealth of experience across various sectors — bringing invaluable knowledge and practical insights to help you make informed decisions.' },
          { label: 'Strategic Growth', text: 'Whether you\'re an individual aiming for career advancement or a manager striving to lead more effectively, we equip you with the strategies and tools necessary for sustained success.' },
          { label: 'Holistic Development', text: 'Beyond financial growth, we focus on your overall development — from leadership skills to personal branding, our mentoring covers all aspects of professional excellence.' },
        ],
      },
      {
        heading: 'Our Impact',
        impact: [
          'Individuals — transform your career trajectory with personalised mentorship that hones your skills, boosts your confidence, and opens doors to new opportunities',
        ],
      },
      {
        heading: 'Entrepreneurship Programme',
        body: 'Designed for those taking their first steps into business. You will learn that as an entrepreneur, it is important to experiment, accept failure, and learn to try again.',
      },
      {
        heading: 'Beginners Entrepreneurship Programme',
        body: 'Designed for those taking their first steps into business. You will learn that as an entrepreneur, it is important to experiment, accept failure, and learn to try again.',
        bullets: [
          'Equip yourself with practical tools to develop and test entrepreneurial ideas',
          'Cultivate resilience through unique in-house entrepreneur tools and experience',
          'Take advantage of opportunities with real-world experienced professionals',
          'Build valuable connections for future career prospects',
          'Develop innovative ideas with prototype creation and testing',
        ],
      },
      {
        heading: 'Advanced Entrepreneurship Programme',
        body: 'Top-tier development courses designed for CEOs, aspiring entrepreneurs, and seasoned professionals seeking to elevate their leadership and entrepreneurial skills.',
        bullets: [
          'Advanced Level Entrepreneurship for CEOs and Senior Managers',
          'Strategic Business Development and Scaling',
          'Investment Readiness and Fundraising',
          'Building and Leading High-Performance Teams',
        ],
      },
    ],
    cta: 'Start Mentoring',
  },

  /* ── Public Sector ── */
  'public-sector': {
    title: 'Training — Public Sector',
    subtitle: 'Shaping future leaders in public service',
    image: '/images/publicsector-hero.jpg',
    imageAlt: 'Public sector training and leadership',
    accentColor: '#022269',
    intro: 'Training in the public sector is a fundamental tool for developing human resources and improving administrative performance. At Loida British, we deliver targeted, high-impact training programmes for public service professionals.',
    sections: [
      {
        heading: 'Our Approach',
        body: 'Our training is delivered by experienced practitioners with deep knowledge of public sector challenges. We combine theory with practical case studies and real-world scenarios to ensure participants can immediately apply their learning.',
        bullets: [
          'Tailored to public sector organisational structures and culture',
          'Delivered by experienced public service professionals',
          'Flexible delivery — in-person, online, or blended',
          'Nationally recognised certifications',
          'Suitable for all levels — entry to senior management',
        ],
      },
      {
        heading: 'Who Should Attend?',
        body: 'Our programmes are designed for civil servants, local government officers, public health administrators, and anyone working within or alongside government and public institutions.',
        impact: [
          'Civil servants and government officers',
          'Local council and municipal staff',
          'Public health and NHS administrators',
          'NGO and non-profit sector professionals',
          'Anyone transitioning into public service roles',
        ],
      },
    ],
    cta: 'Request Training',
    subCards: [
      { title: 'Human Resources & Development',    desc: 'Strategic HR management, talent development, and workforce planning for public organisations.' },
      { title: 'Procurement & Contract Management', desc: 'Best practices in public procurement, supplier management, and contract compliance.' },
      { title: 'Legal & Compliance',               desc: 'Understanding public sector law, regulatory frameworks, and ethics in government.' },
      { title: 'Financial Training',               desc: 'Budgeting, financial reporting, and resource management for public sector finance teams.' },
      { title: 'Leadership & Management',          desc: 'Developing effective leaders at all levels of government and public service organisations.' },
      { title: 'Project Management',               desc: 'Delivering public sector projects on time and within budget using proven frameworks.' },
      { title: 'Digital Transformation',           desc: 'Driving technology adoption and innovation in government and public institutions.' },
      { title: 'Ethics & Anti-Corruption',         desc: 'Building integrity, transparency, and accountability across public sector operations.' },
    ],
  },

  /* ── Advanced ── */
  advanced: {
    title: 'Advance Courses',
    subtitle: 'Go further … Learn deeper',
    image: '/images/advanced-hero.jpg',
    imageAlt: 'Advanced specialised learning',
    accentColor: '#c71430',
    intro: 'Explore specialised knowledge and sharpen your skills with our expertly designed, in-depth advanced courses. From business and technology to law, science, and health — we offer a wide range of nationally recognised qualifications.',
    sections: [],
    cta: 'Enrol Now',
    isAdvanced: true,
  },
}

export function generateStaticParams() {
  return Object.keys(programs).map(slug => ({ slug }))
}

export default function ProgramPage({ params }: { params: { slug: string } }) {
  const program = programs[params.slug]
  if (!program) notFound()

  return (
    <>
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative h-[480px] pt-[117px] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <Image src={program.image} alt={program.imageAlt} fill className="object-cover object-center" priority />
        </div>
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(2,34,105,0.95) 0%, rgba(2,34,105,0.55) 55%, transparent 100%)' }}
        />
        <div className="relative z-10 max-w-6xl mx-auto px-6 pb-14 w-full">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-0.5" style={{ background: program.accentColor }} />
            <p className="text-xs tracking-[0.3em] uppercase font-semibold font-['Inter']"
              style={{ color: program.accentColor }}>
              Loida British Programme
            </p>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white font-['Raleway'] leading-tight mb-3">
            {program.title}
          </h1>
          <p className="text-blue-200 text-xl font-['Tajawal']">{program.subtitle}</p>
        </div>
      </section>

      {/* ── Breadcrumb ───────────────────────────────────────────────── */}
      <div className="bg-[#f0f7f9] border-b border-gray-200 sticky top-[0px] z-10">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-2 text-sm font-['Inter']">
          <Link href="/" className="text-[#022269] hover:underline">Home</Link>
          <span className="text-gray-400">›</span>
          <Link href="/#what-we-offer" className="text-[#022269] hover:underline">What We Offer</Link>
          <span className="text-gray-400">›</span>
          <span className="text-gray-500">{program.title}</span>
        </div>
      </div>

      {/* ── Intro ────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <div className="max-w-3xl">
            <div className="w-14 h-1 mb-6" style={{ background: program.accentColor }} />
            <p className="text-[#022269] text-xl leading-relaxed font-['Tajawal']">{program.intro}</p>
          </div>
        </div>
      </div>

      {/* ── Sections ─────────────────────────────────────────────────── */}
      {program.sections.map((section, si) => {
        const isOdd = si % 2 === 0
        return (
          <section key={si} className={isOdd ? 'bg-white' : 'bg-[#f8f9fc]'}>
            <div className="max-w-6xl mx-auto px-6 py-16">

              {/* Section header */}
              <div className="flex items-start gap-6 mb-10">
                <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center text-white font-bold text-lg font-['Raleway']"
                  style={{ background: program.accentColor }}>
                  {String(si + 1).padStart(2, '0')}
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#022269] font-['Raleway'] leading-tight">
                    {section.heading}
                  </h2>
                  {section.body && (
                    <p className="text-gray-500 mt-3 leading-relaxed font-['Inter'] max-w-3xl">
                      {section.body}
                    </p>
                  )}
                </div>
              </div>

              {/* Numbered items */}
              {section.numbered && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 ml-20">
                  {section.numbered.map((item, ni) => (
                    <div key={ni} className="flex gap-4 p-6 border-l-4 bg-white shadow-sm hover:shadow-md transition-shadow"
                      style={{ borderColor: program.accentColor }}>
                      <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-white text-sm font-bold font-['Raleway']"
                        style={{ background: program.accentColor }}>
                        {ni + 1}
                      </div>
                      <div>
                        <p className="font-bold text-[#022269] font-['Raleway'] mb-1">{item.label}</p>
                        <p className="text-gray-500 text-sm leading-relaxed font-['Inter']">{item.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Bullets */}
              {section.bullets && (
                <div className="ml-20 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {section.bullets.map((b, bi) => (
                    <div key={bi} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-5 h-5 mt-0.5 flex items-center justify-center"
                        style={{ background: program.accentColor }}>
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="square"/>
                        </svg>
                      </span>
                      <span className="text-gray-700 text-sm leading-relaxed font-['Inter']">{b}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Table (ESOL qualifications) */}
              {section.table && (
                <div className="ml-0 mt-2 overflow-x-auto">
                  <table className="w-full text-sm font-['Inter'] border-collapse">
                    <thead>
                      <tr style={{ background: program.accentColor }}>
                        <th className="text-white text-left px-4 py-3 font-semibold w-32">Level</th>
                        <th className="text-white text-left px-4 py-3 font-semibold">Qualification</th>
                        <th className="text-white text-left px-4 py-3 font-semibold">Suitability</th>
                      </tr>
                    </thead>
                    <tbody>
                      {section.table.map((row, ri) => (
                        <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-4 py-3 font-bold text-[#022269]">{row.col1}</td>
                          <td className="px-4 py-3 text-gray-700">{row.col2}</td>
                          <td className="px-4 py-3 text-gray-500">{row.col3}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Impact list */}
              {section.impact && (
                <div className="ml-20 space-y-3">
                  {section.impact.map((item, ii) => (
                    <div key={ii} className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0">
                      <div className="w-2 h-2 flex-shrink-0" style={{ background: program.accentColor }} />
                      <p className="text-gray-700 font-['Inter'] text-sm">{item}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )
      })}

      {/* ── Sub-course cards (Public Sector) ─────────────────────────── */}
      {program.subCards && (
        <section className="bg-[#f8f9fc] py-16">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-8 h-0.5" style={{ background: program.accentColor }} />
              <h2 className="text-2xl font-bold text-[#022269] font-['Raleway']">Training Courses</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {program.subCards.map((card, ci) => (
                <div key={ci}
                  className="bg-white border-t-4 p-6 hover:shadow-lg transition-shadow flex flex-col group"
                  style={{ borderColor: program.accentColor }}>
                  <div className="w-8 h-8 mb-4 flex items-center justify-center text-white text-xs font-bold font-['Inter']"
                    style={{ background: program.accentColor }}>
                    {String(ci + 1).padStart(2, '0')}
                  </div>
                  <h3 className="font-bold text-[#022269] font-['Raleway'] mb-2 text-sm leading-snug
                    group-hover:text-[#c71430] transition-colors">
                    {card.title}
                  </h3>
                  {card.desc && (
                    <p className="text-gray-500 text-xs leading-relaxed font-['Inter'] flex-1">{card.desc}</p>
                  )}
                  <Link href="/contact"
                    className="mt-4 text-xs font-medium font-['Inter'] transition-opacity hover:opacity-70"
                    style={{ color: program.accentColor }}>
                    Read More →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Advanced courses grid ─────────────────────────────────────── */}
      {program.isAdvanced && (
        <section className="bg-white py-16">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-8 h-0.5 bg-[#c71430]" />
              <h2 className="text-2xl font-bold text-[#022269] font-['Raleway']">Available Courses</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {advancedCourses.map((course, ci) => (
                <div key={ci}
                  className="border-t-4 bg-gray-50 hover:bg-white hover:shadow-md transition-all flex flex-col group"
                  style={{ borderColor: course.color }}>
                  <div className="p-6 flex flex-col flex-1">
                    <span className="text-xs font-bold tracking-[0.2em] uppercase font-['Inter'] mb-3"
                      style={{ color: course.color }}>
                      {String(ci + 1).padStart(2, '0')}
                    </span>
                    <h3 className="text-[#022269] font-bold font-['Raleway'] text-lg leading-snug mb-3
                      group-hover:text-[#c71430] transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed font-['Inter'] flex-1">{course.desc}</p>
                    <Link href="/contact"
                      className="mt-5 pt-4 border-t border-gray-200 text-sm font-medium font-['Inter']
                        hover:opacity-70 transition-opacity"
                      style={{ color: course.color }}>
                      For More →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Bottom CTA ───────────────────────────────────────────────── */}
      <section className="bg-[#022269] py-16">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase font-['Inter'] mb-2"
              style={{ color: program.accentColor }}>
              Loida British
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-white font-['Raleway']">Ready to get started?</h2>
            <p className="text-blue-200 mt-2 font-['Tajawal']">Contact us to learn more or enrol today.</p>
          </div>
          <div className="flex flex-wrap gap-3 flex-shrink-0">
            <Link href="/contact"
              className="px-8 py-3 text-white font-semibold font-['Inter'] text-sm transition-colors"
              style={{ background: program.accentColor }}>
              {program.cta}
            </Link>
            <Link href="/#what-we-offer"
              className="px-8 py-3 border border-white/40 hover:bg-white/10 text-white font-['Inter'] text-sm transition-colors">
              All Programmes
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
