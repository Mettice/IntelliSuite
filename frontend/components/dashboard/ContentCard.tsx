interface ContentCardProps {
  title: string
  description: string
  icon: string
}

export default function ContentCard({ title, description, icon }: ContentCardProps) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow cursor-pointer">
      <div className="p-5">
        <div className="flex items-center mb-4">
          <span className="text-2xl mr-3">{icon}</span>
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        </div>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  )
} 