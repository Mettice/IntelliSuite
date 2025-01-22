export default function LoadingState() {
  return (
    <div className="animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      <div className="space-y-3 mt-4">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded"></div>
      </div>
    </div>
  )
} 