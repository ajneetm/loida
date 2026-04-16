import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { CalendarDays, MapPin, Users, BookOpen } from 'lucide-react'

export default async function TrainerWorkshopsPage() {
  const session = await auth()
  if (!session?.user) redirect('/auth/login')

  const trainer = await prisma.trainer.findUnique({
    where: { userId: session.user.id },
    include: {
      accreditations: {
        where:   { status: 'ACTIVE' },
        include: {
          curriculum: {
            include: {
              workshops: { orderBy: { date: 'desc' } },
            },
          },
        },
      },
    },
  })

  if (!trainer) redirect('/dashboard')

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-[#1C2B39]">My Workshops</h1>
        <p className="text-sm text-[#6B8F9E] mt-1">Workshops for your accredited curricula</p>
      </div>

      {trainer.accreditations.length === 0 ? (
        <div className="bg-white border border-[#E8E4DC] p-12 text-center text-[#6B8F9E]">
          <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>No curricula accredited yet.</p>
        </div>
      ) : (
        trainer.accreditations.map(acc => (
          <div key={acc.id} className="space-y-3">
            <h2 className="font-medium text-[#1C2B39]">{acc.curriculum.name}</h2>

            {acc.curriculum.workshops.length === 0 ? (
              <div className="bg-white border border-[#E8E4DC] p-8 text-center text-sm text-[#6B8F9E]">
                No workshops added yet for this curriculum.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {acc.curriculum.workshops.map(w => (
                  <Link key={w.id} href={`/trainer/workshops/${w.id}`}
                    className="bg-white border border-[#E8E4DC] p-5 hover:border-[#1C2B39] transition-colors space-y-3 block">
                    <p className="font-medium text-[#1C2B39]">{w.title}</p>
                    <div className="flex flex-wrap gap-3 text-xs text-[#6B8F9E]">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="w-3.5 h-3.5" />
                        {new Date(w.date).toLocaleDateString()}
                      </span>
                      {w.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {w.location}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-[#6B8F9E]">
                      <Users className="w-3.5 h-3.5" />
                      View details →
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  )
}
