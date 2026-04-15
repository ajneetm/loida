import Link from 'next/link'

export default function ApplySuccessPage() {
  return (
    <div className="max-w-lg mx-auto text-center py-20">
      <div className="w-20 h-20 rounded-none bg-green-50 border border-green-100 flex items-center justify-center text-3xl mx-auto mb-6">
        ✓
      </div>
      <h1 className="font-display text-3xl text-[#022269] font-light mb-4">
        Application Submitted!
      </h1>
      <p className="text-stone-500 text-sm leading-relaxed mb-8">
        Thank you for applying to become a Loida British coach. Our team will review your application within 3–5 business days and reach out via email.
      </p>
      <div className="bg-white rounded-none border border-stone-100 p-6 text-left mb-8 space-y-3">
        {[
          { step: '01', text: 'Application reviewed by our team' },
          { step: '02', text: 'Onboarding call scheduled' },
          { step: '03', text: 'Profile activated on the platform' },
          { step: '04', text: 'Start accepting clients & sessions' },
        ].map(item => (
          <div key={item.step} className="flex items-center gap-4">
            <span className="font-display text-2xl text-stone-200 w-8 flex-shrink-0">{item.step}</span>
            <p className="text-stone-500 text-sm">{item.text}</p>
          </div>
        ))}
      </div>
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 bg-[#022269] hover:bg-[#011344] text-white text-sm font-medium px-6 py-3 rounded-none transition-colors"
      >
        Back to Dashboard →
      </Link>
    </div>
  )
}
