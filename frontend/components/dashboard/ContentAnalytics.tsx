'use client'

export default function ContentAnalytics() {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Content Analytics</h3>
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-2xl font-semibold text-indigo-600">24</p>
          <p className="text-sm text-gray-500">Total Content</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-semibold text-indigo-600">12</p>
          <p className="text-sm text-gray-500">This Week</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-semibold text-indigo-600">85%</p>
          <p className="text-sm text-gray-500">Success Rate</p>
        </div>
      </div>
    </div>
  )
} 