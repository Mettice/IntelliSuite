'use client'

import { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

export default function AnalyticsPage() {
  const [stats, setStats] = useState({
    totalLeads: 0,
    conversionRate: 0,
    averageScore: 0,
    leadsByCategory: {
      hot: 0,
      warm: 0,
      cold: 0
    }
  })

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Lead Score Trend',
        data: [6, 7, 8, 7, 8, 9],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
        
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="text-2xl font-semibold text-gray-900">
                    {stats.totalLeads}
                  </div>
                  <div className="mt-1 text-sm text-gray-500">Total Leads</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="text-2xl font-semibold text-gray-900">
                    {stats.conversionRate}%
                  </div>
                  <div className="mt-1 text-sm text-gray-500">Conversion Rate</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="text-2xl font-semibold text-gray-900">
                    {stats.averageScore}/10
                  </div>
                  <div className="mt-1 text-sm text-gray-500">Average Score</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900">Lead Score Trend</h2>
          <div className="mt-4 h-96">
            <Line data={chartData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      </div>
    </div>
  )
} 