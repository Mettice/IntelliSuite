interface ScoreCardProps {
  title: string
  count: number
  category: 'hot' | 'warm' | 'cold'
  loading?: boolean
}

export default function ScoreCard({ title, count, category, loading }: ScoreCardProps) {
  // Define colors for each category
  const colors = {
    hot: {
      bg: 'bg-red-50', // Light red background
      text: 'text-red-600', // Dark red text
      border: 'border-red-200', // Light red border
    },
    warm: {
      bg: 'bg-yellow-50', // Light yellow background
      text: 'text-yellow-600', // Dark yellow text
      border: 'border-yellow-200', // Light yellow border
    },
    cold: {
      bg: 'bg-blue-50', // Light blue background
      text: 'text-blue-600', // Dark blue text
      border: 'border-blue-200', // Light blue border
    },
  }

  const categoryColors = colors[category]

  return (
    <div className={`p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 ${categoryColors.bg} border ${categoryColors.border}`}>
      <h3 className="text-lg font-medium text-gray-700">{title}</h3>
      {loading ? (
        <div className="h-8 w-20 bg-gray-200 rounded mt-2 animate-pulse"></div>
      ) : (
        <p className={`text-4xl font-bold mt-2 ${categoryColors.text}`}>
          {count}
        </p>
      )}
    </div>
  )
}