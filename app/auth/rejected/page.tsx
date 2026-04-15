import Link from 'next/link'

export default function RejectedPage() {
  return (
    <div className="text-center space-y-4">
      <div className="w-14 h-14 rounded-full bg-red-500/20 flex items-center justify-center mx-auto">
        <span className="text-red-400 text-2xl">✕</span>
      </div>
      <h1 className="text-white text-xl font-semibold">لم يتم اعتماد الحساب</h1>
      <p className="text-white/50 text-sm leading-relaxed">
        عذراً، لم تتم الموافقة على حسابك كمدرب.
        <br />للاستفسار تواصل مع وكيلك أو مع إدارة لويدا.
      </p>
      <Link
        href="/auth/login"
        className="inline-block mt-4 text-white/40 text-sm hover:text-white/70 transition-colors"
      >
        ← العودة لتسجيل الدخول
      </Link>
    </div>
  )
}
