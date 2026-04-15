import { redirect } from 'next/navigation'

// Self-registration is disabled — accounts are created by Admin/Agent only
export default function SignupPage() {
  redirect('/auth/login')
}
