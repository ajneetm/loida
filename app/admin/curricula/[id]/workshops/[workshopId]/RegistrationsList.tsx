'use client'

import { Users } from 'lucide-react'

interface Registration {
  id: string; name: string; email: string; phone?: string | null; registeredAt: string | Date
}

export default function RegistrationsList({ registrations }: { registrations: Registration[] }) {
  return (
    <div className="bg-white border border-[#E8E4DC]">
      <div className="px-5 py-4 border-b border-[#E8E4DC] flex items-center justify-between">
        <h2 className="font-medium text-[#1C2B39]">Registrations</h2>
        <span className="text-xs text-[#6B8F9E]">{registrations.length} registered</span>
      </div>

      {registrations.length === 0 ? (
        <div className="p-10 text-center text-[#6B8F9E] text-sm">
          <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
          No registrations yet
        </div>
      ) : (
        <div className="divide-y divide-[#E8E4DC]">
          {registrations.map(r => (
            <div key={r.id} className="flex items-center justify-between px-5 py-3 gap-4">
              <div>
                <p className="text-sm font-medium text-[#1C2B39]">{r.name}</p>
                <p className="text-xs text-[#6B8F9E]">{r.email}{r.phone ? ` · ${r.phone}` : ''}</p>
              </div>
              <p className="text-xs text-[#6B8F9E] flex-shrink-0">
                {new Date(r.registeredAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
