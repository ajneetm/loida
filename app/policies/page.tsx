import Link from 'next/link'
import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'

const policies = [
  { name: 'Equality & Diversity Policy', file: '706dde_7ad109025f57455e88cc9acd7d23478d.pdf' },
  { name: 'Health & Safety Policy', file: '706dde_1906d45ae3e341e2a92fbf2adbac0c13.pdf' },
  { name: 'Complaints & Grievances Policy', file: '706dde_fab81f45b5254ed58b8767ef4c403467.pdf' },
  { name: 'Financial Management Policy', file: '706dde_bbd0a9cf95774db19593937600bd2e49.pdf' },
  { name: 'Data Protection & Privacy Policy', file: '706dde_7dc7c9a4c39c4076b8f0464bced8d253.pdf' },
  { name: 'Recruitment Policy', file: '706dde_23dcbcdcbadd4d0aac4aeaeffb8d26ad.pdf' },
  { name: 'Members Attendance & Absence Policy (Learners)', file: '706dde_1d63ca36101b41d8b998f370229f91b1.pdf' },
  { name: 'Members Attendance & Absence Policy (Employees)', file: '706dde_1df2164df6634fc897e0b867b910a012.pdf' },
  { name: 'Policies & Procedures Manual', file: '706dde_bedce214256748e0b54ecbdbcd8e2746.pdf' },
  { name: 'Quality Assurance Policy', file: '706dde_5e465016507f430ca6d78ba1b53c0457.pdf' },
  { name: 'Remote Learning & Working Policy', file: '706dde_58805852fd5747cba821492d7dd36f8b.pdf' },
  { name: 'Training Policy', file: '706dde_e72b50ede47a49249c013d47632cfae8.pdf' },
  { name: 'Safeguarding Policy & Procedure', file: '706dde_4aeef602567c4f938e14cf50b4b2695e.pdf' },
  { name: 'Loida British Ltd Privacy Notice', file: '706dde_613175e4143b47fab5992df9b8aefcb3.pdf' },
  { name: 'Loida British Ltd Cookie Disclosure', file: '706dde_a924f7dc81ba4d9695c93d789cc72cf3.pdf' },
  { name: 'Internal Quality Assurance (IQA) Policy', file: '706dde_f9c5cc3d212a4be5ba988495178e8b62.pdf' },
  { name: 'Malpractice, Maladministration, and Plagiarism Policy', file: '706dde_d1d00d5d372042fc97088505276f3d39.pdf' },
  { name: 'Reasonable Adjustments, Special Consideration, and Extenuating Circumstances Policy', file: '706dde_02853a82af9f49289207a41ffd53fe92.pdf' },
  { name: 'Conflict of Interest Policy', file: '706dde_f2f8fe2456a64ba99c00d24cf2615cdd.pdf' },
  { name: 'Access to Fair Assessment & External Assessment Policy', file: '706dde_59208984a2634ab4ab0ad1e970436743.pdf' },
  { name: 'Conduct of Assessment / Externally Set Assessment Policy', file: '706dde_b9b70c00fa164016879c0db9cdd55cdf.pdf' },
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
              <a
                key={i}
                href={`/polices/${policy.file}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 p-4 bg-gray-50 border-l-4 border-[#022269] hover:bg-blue-50 hover:border-[#c71430] transition-colors group"
              >
                <span className="text-[#c71430] font-bold text-xs font-['Inter'] flex-shrink-0 mt-0.5 w-5">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="text-[#022269] text-sm font-['Inter'] leading-snug group-hover:text-[#011344] flex-1">
                  {policy.name}
                </p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 text-gray-400 group-hover:text-[#c71430] flex-shrink-0 mt-0.5 transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
                </svg>
              </a>
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
