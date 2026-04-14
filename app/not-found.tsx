import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0A1628] flex items-center justify-center px-6">
      <div className="text-center">
        <p className="font-display text-[120px] text-white/5 font-light leading-none select-none">404</p>
        <div className="-mt-8">
          <p className="text-[#B8973A] text-xs tracking-[0.3em] uppercase mb-4">Page Not Found</p>
          <h1 className="font-display text-4xl text-white font-light mb-4">
            This path doesn&apos;t exist.
          </h1>
          <p className="text-white/40 text-sm mb-8 max-w-sm mx-auto">
            The page you are looking for may have moved, or the URL might be incorrect.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/dashboard" className="bg-[#B8973A] hover:bg-[#D4B05A] text-white text-sm font-medium px-6 py-2.5 rounded-full transition-colors">
              Go to Dashboard
            </Link>
            <Link href="/" className="text-white/50 hover:text-white text-sm transition-colors">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
