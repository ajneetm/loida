import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'

const policies = [
  {
    name: 'Equality & Diversity Policy',
    file: '706dde_7ad109025f57455e88cc9acd7d23478d.pdf',
    icon: '706dde_c46e49e5dafa410592d63ba93ee6026e~mv2.jpg',
  },
  {
    name: 'Health & Safety Policy',
    file: '706dde_1906d45ae3e341e2a92fbf2adbac0c13.pdf',
    icon: '65_MjExMi53MDEyLm4wMDEuMzDQoS5wNi4zMA_ed.jpg',
  },
  {
    name: 'Complaints & Grievances Policy',
    file: '706dde_fab81f45b5254ed58b8767ef4c403467.pdf',
    icon: '706dde_94f9983d2def4f769acaab8d12216318~mv2.jpg',
  },
  {
    name: 'Financial Management Policy',
    file: '706dde_bbd0a9cf95774db19593937600bd2e49.pdf',
    icon: 'aug02_12_edited.jpg',
  },
  {
    name: 'Data Protection & Privacy Policy',
    file: '706dde_7dc7c9a4c39c4076b8f0464bced8d253.pdf',
    icon: 'Encryption_and_data_protection,_privacy_.jpg',
  },
  {
    name: 'Recruitment Policy',
    file: '706dde_23dcbcdcbadd4d0aac4aeaeffb8d26ad.pdf',
    icon: 'headhunting_17_edited.jpg',
  },
  {
    name: 'Members Attendance & Absence Policy (Learners)',
    file: '706dde_1d63ca36101b41d8b998f370229f91b1.pdf',
    icon: 'personnel-management-concept-business-re.png',
  },
  {
    name: 'Members Attendance & Absence Policy (Employees)',
    file: '706dde_1df2164df6634fc897e0b867b910a012.pdf',
    icon: 'personnel-management-concept-business-re (1).png',
  },
  {
    name: 'Policies & Procedures Manual',
    file: '706dde_bedce214256748e0b54ecbdbcd8e2746.pdf',
    icon: '706dde_ef442d6b759e46f4a8a4f32bcdc4caea~mv2.jpg',
  },
  {
    name: 'Quality Assurance Policy',
    file: '706dde_5e465016507f430ca6d78ba1b53c0457.pdf',
    icon: '706dde_366bcd7c0dc248ffab722c01839fe094~mv2.jpg',
  },
  {
    name: 'Remote Learning & Working Policy',
    file: '706dde_58805852fd5747cba821492d7dd36f8b.pdf',
    icon: '706dde_1a103b83634f40288c38d62bda490d1d~mv2.jpg',
  },
  {
    name: 'Training Policy',
    file: '706dde_e72b50ede47a49249c013d47632cfae8.pdf',
    icon: '706dde_a53d28bf59a44452b3fc482a46084c4e~mv2.jpg',
  },
  {
    name: 'Safeguarding Policy & Procedure',
    file: '706dde_4aeef602567c4f938e14cf50b4b2695e.pdf',
    icon: '706dde_0a9e634c6c2b416090fd23d26935504f~mv2.jpg',
  },
  {
    name: 'Loida British Ltd Privacy Notice',
    file: '706dde_613175e4143b47fab5992df9b8aefcb3.pdf',
    icon: '706dde_2462114977884abcb21fa3467efa7b58~mv2.jpg',
  },
  {
    name: 'Loida British Ltd Cookie Disclosure',
    file: '706dde_a924f7dc81ba4d9695c93d789cc72cf3.pdf',
    icon: '706dde_3a85f5446eeb47cfb9a60a84fc3867e7~mv2.jpg',
  },
  {
    name: 'Internal Quality Assurance (IQA) Policy',
    file: '706dde_f9c5cc3d212a4be5ba988495178e8b62.pdf',
    icon: '706dde_c21bd89a0541470b811838e637ec9479~mv2.jpg',
  },
  {
    name: 'Malpractice, Maladministration, and Plagiarism Policy',
    file: '706dde_d1d00d5d372042fc97088505276f3d39.pdf',
    icon: '706dde_c802434c16ec44d38a114d9e5a462250~mv2.jpg',
  },
  {
    name: 'Reasonable Adjustments, Special Consideration, and Extenuating Circumstances Policy',
    file: '706dde_02853a82af9f49289207a41ffd53fe92.pdf',
    icon: '706dde_bbe01ec059904e41bbff3734c28466a9~mv2.jpg',
  },
  {
    name: 'Conflict of Interest Policy',
    file: '706dde_f2f8fe2456a64ba99c00d24cf2615cdd.pdf',
    icon: '706dde_4a1106be05804af8b4f73a2eb00c6993~mv2.jpg',
  },
  {
    name: 'Access to Fair Assessment & External Assessment Policy',
    file: '706dde_59208984a2634ab4ab0ad1e970436743.pdf',
    icon: '706dde_056331495be040a4a032c497f3d0ab23~mv2.jpg',
  },
  {
    name: 'Conduct of Assessment / Externally Set Assessment Policy',
    file: '706dde_b9b70c00fa164016879c0db9cdd55cdf.pdf',
    icon: '706dde_cae5f9c34d4b4a7586c12edcccfd4d7c~mv2.jpg',
  },
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
        <div className="max-w-4xl">
          <div className="w-12 h-1 bg-[#c71430] mb-8" />
          <p className="text-[#022269] text-lg leading-relaxed font-['Tajawal'] mb-12">
            Loida British Ltd is committed to maintaining the highest standards across all areas of our work.
            The following policies govern how we operate, how we treat our learners and staff, and how we
            safeguard the quality and integrity of our programmes.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {policies.map((policy, i) => (
              <a
                key={i}
                href={`/polices/${policy.file}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col bg-gray-50 border-t-4 border-[#022269] hover:border-[#c71430] hover:bg-blue-50 transition-colors group overflow-hidden"
              >
                <div className="flex items-center justify-center bg-white p-4 h-28">
                  <Image
                    src={`/polices/icons/${policy.icon}`}
                    alt={policy.name}
                    width={80}
                    height={80}
                    className="object-contain w-20 h-20"
                  />
                </div>
                <div className="flex items-start gap-2 p-4">
                  <span className="text-[#c71430] font-bold text-xs font-['Inter'] flex-shrink-0 mt-0.5">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="text-[#022269] text-sm font-['Inter'] leading-snug group-hover:text-[#011344] flex-1">
                    {policy.name}
                  </p>
                </div>
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
