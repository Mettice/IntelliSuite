export function StatCardSkeleton() {
  return (
    <div className="glass-card animate-pulse">
      <div className="p-6">
        <div className="h-4 bg-gray-800/20 rounded w-1/4"></div>
        <div className="mt-4 h-8 bg-gray-800/20 rounded w-1/2"></div>
        <div className="mt-2 h-4 bg-gray-800/20 rounded w-3/4"></div>
      </div>
    </div>
  )
}

export function TableSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-800/20 rounded w-full mb-4"></div>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-16 bg-gray-800/20 rounded w-full mb-2"></div>
      ))}
    </div>
  )
} 