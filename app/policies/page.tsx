import Link from 'next/link'
import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'

const policies = [
  'Equality & Diversity Policy',
  'Health & Safety Policy',
  'Complaints & Grievances Policy',
  'Financial Management Policy',
  'Data Protection & Privacy Policy',
  'Recruitment Policy',
  'Members Attendance & Absence Policy (Learners)',
  'Members Attendance & Absence Policy (Employees)',
  'Policies & Procedures Manual',
  'Quality Assurance Policy',
  'Remote Learning & Working Policy',
  'Training Policy',
  'Safeguarding Policy & Procedure',
  'Loida British Ltd Privacy Notice',
  'Loida British Ltd Cookie Disclosure',
  'Internal Quality Assurance (IQA) Policy',
  'Malpractice, Maladministration, and Plagiarism Policy',
  'Reasonable Adjustments, Special Consideration, and Extenuating Circumstances Policy',
  'Conflict of Interest Policy',
  'Access to Fair Assessment & External Assessment Policy',
  'Conduct of Assessment / Externally Set Assessment Policy',
]

export const metadata = {
  title: 'Policies | Loida British',
  description: 'Loida British Ltd policies and procedures',
}

export default function PoliciesPage() {
  return (
    <>
      <Navbar />

      {/* Hero bar */}
      <section className="pt-[117px] bg-[#022269]">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <p className="text-[#c71430] text-xs tracking-[0.3em] uppercase font-semibold mb-3 font-['Inter']">
            Loida British Ltd
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white font-['Raleway'] leading-tight">
            Policies
          </h1>
          <p className="text-blue-200 mt-3 font-['Tajawal'] text-lg">
            Our commitment to transparency, safety, and best practice.
          </p>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="bg-[#f0f7f9] border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-2 text-sm font-['Inter']">
          <Link href="/" className="text-[#022269] hover:underline">Home</Link>
          <span className="text-gray-400">›</span>
          <span className="text-gray-500">Policies</span>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="max-w-3xl">
          <div className="w-12 h-1 bg-[#c71430] mb-8" />
          <p className="text-[#022269] text-lg leading-relaxed font-['Tajawal'] mb-12">
            Loida British Ltd is committed to maintaining the highest standards across all areas of our work.
            The following policies govern how we operate, how we treat our learners and staff, and how we
            safeguard the quality and integrity of our programmes.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {policies.map((policy, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-4 bg-gray-50 border-l-4 border-[#022269] hover:bg-blue-50 hover:border-[#c71430] transition-colors group"
              >
                <span className="text-[#c71430] font-bold text-xs font-['Inter'] flex-shrink-0 mt-0.5 w-5">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="text-[#022269] text-sm font-['Inter'] leading-snug group-hover:text-[#011344]">
                  {policy}
                </p>
              </div>
            ))}
          </div>

          {/* Contact note */}
          <div className="mt-14 bg-[#022269] p-8">
            <h2 className="text-white font-bold text-xl font-['Raleway'] mb-2">
              Request a Policy Document
            </h2>
            <p className="text-blue-200 font-['Tajawal'] mb-5">
              To request a copy of any of our policy documents, please contact us directly.
            </p>
            <a
              href="mailto:info@loidabritish.com"
              className="inline-flex items-center gap-2 bg-[#c71430] hover:bg-[#a01028] text-white font-semibold px-7 h-[44px] font-['Inter'] transition-colors text-sm"
            >
              info@loidabritish.com
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
