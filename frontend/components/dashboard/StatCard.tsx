interface StatCardProps {
  title: string
  value: number | string
  description: string
  trend?: {
    value: number
    isUpward: boolean
  }
}

export default function StatCard({ title, value, description, trend }: StatCardProps) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-500">{title}</h3>
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
          </div>
          {trend && (
            <div className={`${trend.isUpward ? 'text-green-600' : 'text-red-600'}`}>
              {trend.isUpward ? '↑' : '↓'} {trend.value}%
            </div>
          )}
        </div>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>
    </div>
  )
} 