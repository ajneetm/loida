import Link from 'next/link'

export default function PendingPage() {
  return (
    <div className="text-center space-y-4">
      <div className="w-14 h-14 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto">
        <span className="text-amber-400 text-2xl">⏳</span>
      </div>
      <h1 className="text-white text-xl font-semibold">حسابك قيد المراجعة</h1>
      <p className="text-white/50 text-sm leading-relaxed">
        تم إنشاء حسابك بنجاح. في انتظار موافقة الإدارة على اعتمادك كمدرب.
        <br />ستصلك رسالة عند التفعيل.
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
