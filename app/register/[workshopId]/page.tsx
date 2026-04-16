import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { CalendarDays, MapPin } from 'lucide-react'
import RegisterForm from './RegisterForm'

export default async function WorkshopRegisterPage({ params }: { params: { workshopId: string } }) {
  const workshop = await prisma.workshop.findUnique({
    where:   { id: params.workshopId },
    include: { curriculum: true },
  })

  if (!workshop) notFound()

  return (
    <div className="min-h-screen bg-[#F8F7F4] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">

        {/* Header */}
        <div className="text-center">
          <p className="text-xs font-semibold tracking-widest text-[#6B8F9E] uppercase">
            {workshop.curriculum.name}
          </p>
          <h1 className="text-2xl font-semibold text-[#1C2B39] mt-2">{workshop.title}</h1>
          <div className="flex items-center justify-center gap-4 mt-3 text-sm text-[#6B8F9E]">
            <span className="flex items-center gap-1.5">
              <CalendarDays className="w-4 h-4" />
              {new Date(workshop.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            {workshop.location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                {workshop.location}
              </span>
            )}
          </div>
        </div>

        {/* Form */}
        <RegisterForm workshopId={workshop.id} />
      </div>
    </div>
  )
}
