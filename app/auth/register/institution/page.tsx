import InstitutionRegisterForm from './InstitutionRegisterForm'

export default function InstitutionRegisterPage() {
  return (
    <div className="min-h-screen bg-[#F8F7F4] flex items-center justify-center p-4">
      <div className="w-full max-w-xl space-y-6">
        <div>
          <p className="text-xs font-semibold tracking-widest text-[#6B8F9E] uppercase">Loida British</p>
          <h1 className="text-2xl font-semibold text-[#1C2B39] mt-1">Institution Registration</h1>
          <p className="text-sm text-[#6B8F9E] mt-1">
            Register your organization. Your application will be reviewed before approval.
          </p>
        </div>
        <InstitutionRegisterForm />
      </div>
    </div>
  )
}
