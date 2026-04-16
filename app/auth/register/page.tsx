import Link from 'next/link'
import { GraduationCap, Building2 } from 'lucide-react'

export default function RegisterChoicePage() {
  return (
    <div className="min-h-screen bg-[#F8F7F4] flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-8">

        <div className="text-center">
          <p className="text-xs font-semibold tracking-widest text-[#6B8F9E] uppercase">Loida British</p>
          <h1 className="text-2xl font-semibold text-[#1C2B39] mt-2">Join Our Network</h1>
          <p className="text-sm text-[#6B8F9E] mt-1">Choose how you'd like to register</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/auth/register/trainer"
            className="bg-white border border-[#E8E4DC] p-8 flex flex-col items-center gap-4 hover:border-[#1C2B39] hover:shadow-sm transition-all group">
            <div className="w-14 h-14 bg-[#F8F7F4] group-hover:bg-[#1C2B39] flex items-center justify-center transition-colors">
              <GraduationCap className="w-7 h-7 text-[#1C2B39] group-hover:text-white transition-colors" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-[#1C2B39]">Trainer</p>
              <p className="text-xs text-[#6B8F9E] mt-1">Register as an individual trainer</p>
            </div>
          </Link>

          <Link href="/auth/register/institution"
            className="bg-white border border-[#E8E4DC] p-8 flex flex-col items-center gap-4 hover:border-[#1C2B39] hover:shadow-sm transition-all group">
            <div className="w-14 h-14 bg-[#F8F7F4] group-hover:bg-[#1C2B39] flex items-center justify-center transition-colors">
              <Building2 className="w-7 h-7 text-[#1C2B39] group-hover:text-white transition-colors" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-[#1C2B39]">Institution</p>
              <p className="text-xs text-[#6B8F9E] mt-1">Register your organization</p>
            </div>
          </Link>
        </div>

        <p className="text-center text-sm text-[#6B8F9E]">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-[#1C2B39] font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
