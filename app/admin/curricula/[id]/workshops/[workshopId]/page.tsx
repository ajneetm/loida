import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { CalendarDays, MapPin, Users, ChevronLeft } from 'lucide-react'
import MaterialsManager from './MaterialsManager'
import RegistrationsList from './RegistrationsList'

export default async function WorkshopDetailPage({
  params,
}: {
  params: { id: string; workshopId: string }
}) {
  const session = await auth()
  if ((session?.user as any)?.role !== 'ADMIN') redirect('/dashboard')

  const workshop = await prisma.workshop.findUnique({
    where:   { id: params.workshopId },
    include: {
      curriculum:    true,
      materials:     { orderBy: { order: 'asc' } },
      registrations: { orderBy: { registeredAt: 'desc' } },
    },
  })

  if (!workshop || workshop.curriculumId !== params.id) redirect(`/admin/curricula/${params.id}`)

  return (
    <div className="space-y-6">
      {/* Back */}
      <Link href={`/admin/curricula/${params.id}`}
        className="flex items-center gap-1.5 text-sm text-[#6B8F9E] hover:text-[#1C2B39] transition-colors w-fit">
        <ChevronLeft className="w-4 h-4" />
        {workshop.curriculum.name}
      </Link>

      {/* Header */}
      <div className="bg-white border border-[#E8E4DC] p-6 space-y-2">
        <h1 className="text-xl font-semibold text-[#1C2B39]">{workshop.title}</h1>
        <div className="flex flex-wrap gap-4 text-sm text-[#6B8F9E]">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="w-4 h-4" />
            {new Date(workshop.date).toLocaleDateString()}
          </span>
          {workshop.location && (
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              {workshop.location}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            {workshop.registrations.length} registered
          </span>
        </div>
        {workshop.registrationUrl && (
          <a href={workshop.registrationUrl} target="_blank" rel="noopener noreferrer"
            className="inline-block text-xs text-[#022269] hover:underline mt-1">
            Registration Link ↗
          </a>
        )}
      </div>

      {/* Materials */}
      <MaterialsManager workshopId={workshop.id} initialMaterials={workshop.materials} />

      {/* Registrations */}
      <RegistrationsList registrations={workshop.registrations} />
    </div>
  )
}
