export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-pulse">
      {/* Banner skeleton */}
      <div className="h-36 bg-stone-100 rounded-2xl" />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => (
          <div key={i} className="bg-white rounded-2xl border border-stone-100 p-6">
            <div className="h-8 w-12 bg-stone-100 rounded-lg mb-2" />
            <div className="h-3 w-24 bg-stone-50 rounded" />
          </div>
        ))}
      </div>

      {/* Content area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-stone-100 p-6 h-64" />
        <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-100 p-6 h-64" />
      </div>
    </div>
  )
}
