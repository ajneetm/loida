import Link from 'next/link'

export default function PendingPage() {
  return (
    <div className="text-center space-y-4">
      <div className="w-14 h-14 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto">
        <span className="text-amber-400 text-2xl">⏳</span>
      </div>
      <h1 className="text-white text-xl font-semibold">Account Pending Approval</h1>
      <p className="text-white/50 text-sm leading-relaxed">
        Your trainer account has been created and is awaiting admin approval.
        <br />You will be notified once your account is activated.
      </p>
      <Link
        href="/auth/login"
        className="inline-block mt-4 text-white/40 text-sm hover:text-white/70 transition-colors"
      >
        ← Back to Login
      </Link>
    </div>
  )
}
