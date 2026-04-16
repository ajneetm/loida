'use client'

import { signOut } from 'next-auth/react'

export default function PendingPage() {
  return (
    <div className="text-center space-y-4">
      <div className="w-14 h-14 bg-amber-500/20 flex items-center justify-center mx-auto">
        <span className="text-amber-400 text-2xl">⏳</span>
      </div>
      <h1 className="text-white text-xl font-semibold">Account Pending Approval</h1>
      <p className="text-white/50 text-sm leading-relaxed">
        Your trainer account has been created and is awaiting admin approval.
        <br />You will be notified once your account is activated.
      </p>
      <button
        type="button"
        onClick={() => signOut({ callbackUrl: '/auth/login' })}
        className="mt-4 px-5 py-2 bg-white/10 hover:bg-white/20 text-white text-sm transition-colors"
      >
        Sign Out
      </button>
    </div>
  )
}
