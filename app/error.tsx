'use client'
import Link from 'next/link'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen bg-[#F8F7F4] flex items-center justify-center px-6">
      <div className="bg-white rounded-2xl border border-stone-100 p-12 text-center max-w-md w-full">
        <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center text-red-400 text-2xl mx-auto mb-5">
          ⚠
        </div>
        <h2 className="font-display text-2xl text-[#0A1628] font-medium mb-2">Something went wrong</h2>
        <p className="text-stone-400 text-sm mb-6 leading-relaxed">
          {error.message || 'An unexpected error occurred. Please try again.'}
        </p>
        <div className="flex gap-3 justify-center">
          <button onClick={reset}
            className="bg-[#0A1628] hover:bg-[#1A2B4A] text-white text-sm font-medium px-5 py-2.5 rounded-full transition-colors">
            Try Again
          </button>
          <Link href="/dashboard"
            className="border border-stone-200 text-stone-600 hover:border-stone-400 text-sm font-medium px-5 py-2.5 rounded-full transition-colors">
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
