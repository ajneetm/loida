import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { CalendarDays, MapPin, ChevronLeft, Users, Image, Video, Link2, Code2, MonitorPlay } from 'lucide-react'
import CopyLinkButton from './CopyLinkButton'
import RegistrationsWithCerts from './RegistrationsWithCerts'

const TYPE_ICONS: Record<string, any> = {
  IMAGE: Image, VIDEO: Video, LINK: Link2, EMBED: MonitorPlay, CODE: Code2,
}

export default async function TrainerWorkshopDetailPage({ params }: { params: { workshopId: string } }) {
  const session = await auth()
  if (!session?.user) redirect('/auth/login')

  const trainer = await prisma.trainer.findUnique({ where: { userId: session.user.id } })
  if (!trainer) redirect('/dashboard')

  const workshop = await prisma.workshop.findUnique({
    where:   { id: params.workshopId },
    include: {
      curriculum:    true,
      materials:     { orderBy: { order: 'asc' } },
      registrations: { orderBy: { registeredAt: 'desc' } },
    },
  })
  if (!workshop) redirect('/trainer/workshops')

  // Verify accreditation
  const acc = await prisma.trainerAccreditation.findUnique({
    where: { trainerId_curriculumId: { trainerId: trainer.id, curriculumId: workshop.curriculumId } },
  })
  if (!acc || acc.status !== 'ACTIVE') redirect('/trainer/workshops')

  // Get already-requested emails for this workshop
  const existingCerts = await prisma.certificateRequest.findMany({
    where:  { workshopId: workshop.id, trainerId: trainer.id },
    select: { traineeEmail: true },
  })
  const existingCertEmails = existingCerts.map(c => c.traineeEmail)

  return (
    <div className="space-y-6">
      <Link href="/trainer/workshops"
        className="flex items-center gap-1.5 text-sm text-[#6B8F9E] hover:text-[#1C2B39] transition-colors w-fit">
        <ChevronLeft className="w-4 h-4" />
        {workshop.curriculum.name}
      </Link>

      {/* Header */}
      <div className="bg-white border border-[#E8E4DC] p-6 space-y-3">
        <h1 className="text-xl font-semibold text-[#1C2B39]">{workshop.title}</h1>
        <div className="flex flex-wrap gap-4 text-sm text-[#6B8F9E]">
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
          <span className="flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            {workshop.registrations.length} registered
          </span>
        </div>
        <CopyLinkButton workshopId={workshop.id} />
      </div>

      {/* Materials */}
      {workshop.materials.length > 0 && (
        <div className="bg-white border border-[#E8E4DC]">
          <div className="px-5 py-4 border-b border-[#E8E4DC]">
            <h2 className="font-medium text-[#1C2B39]">Materials</h2>
          </div>
          <div className="divide-y divide-[#E8E4DC]">
            {workshop.materials.map(m => {
              const Icon = TYPE_ICONS[m.type] ?? Link2
              return (
                <div key={m.id} className="flex items-start gap-4 px-5 py-4">
                  <div className="w-8 h-8 bg-[#F8F7F4] flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-[#6B8F9E]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#1C2B39] text-sm">{m.title}</p>
                    {m.type === 'IMAGE' && (
                      <img src={m.content} alt={m.title} className="mt-2 max-h-48 object-cover border border-[#E8E4DC]" />
                    )}
                    {m.type === 'EMBED' && (
                      <div className="mt-2" dangerouslySetInnerHTML={{ __html: m.content }} />
                    )}
                    {m.type === 'CODE' && (
                      <pre className="mt-2 bg-[#F8F7F4] p-3 text-xs overflow-x-auto border border-[#E8E4DC] max-h-48">
                        {m.content}
                      </pre>
                    )}
                    {(m.type === 'LINK' || m.type === 'VIDEO') && (
                      <a href={m.content} target="_blank" rel="noopener noreferrer"
                        className="text-xs text-[#022269] hover:underline mt-1 block truncate">
                        {m.content}
                      </a>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Registrations with certificate selection */}
      <RegistrationsWithCerts
        registrations={workshop.registrations}
        workshopId={workshop.id}
        curriculumId={workshop.curriculumId}
        workshopDate={workshop.date.toISOString()}
        existingEmails={existingCertEmails}
      />
    </div>
  )
}
