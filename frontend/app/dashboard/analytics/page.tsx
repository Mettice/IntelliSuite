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
  Legend,
  ChartData
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

type Lead = {
  id: string
  score: number
  category: 'HOT' | 'WARM' | 'COLD'
  createdAt: string
}

type LeadStats = {
  totalLeads: number
  conversionRate: number
  averageScore: number
  leadsByCategory: {
    HOT: number
    WARM: number
    COLD: number
  }
}

type MonthlyScores = {
  [key: string]: number[]
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<LeadStats>({
    totalLeads: 0,
    conversionRate: 0,
    averageScore: 0,
    leadsByCategory: {
      HOT: 0,
      WARM: 0,
      COLD: 0
    }
  })

  const [chartData, setChartData] = useState<ChartData<'line'>>({
    labels: [],
    datasets: [
      {
        label: 'Lead Score Trend',
        data: [],
        borderColor: '#818cf8',
        backgroundColor: '#818cf8',
        tension: 0.4
      }
    ]
  })

  useEffect(() => {
    async function fetchLeads() {
      try {
        const response = await fetch('/api/leads')
        const leads: Lead[] = await response.json()

        // Calculate stats
        const totalLeads = leads.length
        const averageScore = leads.reduce((acc, lead) => acc + lead.score, 0) / totalLeads || 0
        
        // Count leads by category
        const leadsByCategory = leads.reduce((acc, lead) => {
          acc[lead.category] = (acc[lead.category] || 0) + 1
          return acc
        }, { HOT: 0, WARM: 0, COLD: 0 })

        // Calculate conversion rate (HOT leads percentage)
        const conversionRate = (leadsByCategory.HOT / totalLeads * 100) || 0

        setStats({
          totalLeads,
          conversionRate: Math.round(conversionRate),
          averageScore: Math.round(averageScore * 10) / 10,
          leadsByCategory
        })

        // Prepare chart data
        const last6Months = Array.from({ length: 6 }, (_, i) => {
          const d = new Date()
          d.setMonth(d.getMonth() - i)
          return d.toLocaleString('default', { month: 'short' })
        }).reverse()

        const scoresByMonth: MonthlyScores = leads.reduce((acc: MonthlyScores, lead) => {
          const month = new Date(lead.createdAt).toLocaleString('default', { month: 'short' })
          if (!acc[month]) acc[month] = []
          acc[month].push(lead.score)
          return acc
        }, {})

        const monthlyAverages = last6Months.map(month => {
          const scores = scoresByMonth[month] || []
          return scores.length ? scores.reduce((a, b) => a + b) / scores.length : null
        })

        setChartData({
          labels: last6Months,
          datasets: [{
            label: 'Average Lead Score',
            data: monthlyAverages,
            borderColor: '#818cf8',
            backgroundColor: '#818cf8',
            tension: 0.4
          }]
        })

      } catch (error) {
        console.error('Failed to fetch leads:', error)
      }
    }

    fetchLeads()
  }, [])

  return (
    <div className="py-6 animate-fadeIn">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 to-indigo-100">
          Analytics Overview
        </h1>
        
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="glass-stat-card">
            <div className="glass-stat-value">{stats.totalLeads}</div>
            <div className="glass-stat-label">Total Leads</div>
          </div>

          <div className="glass-stat-card">
            <div className="glass-stat-value">{stats.conversionRate}%</div>
            <div className="glass-stat-label">Conversion Rate</div>
          </div>

          <div className="glass-stat-card">
            <div className="glass-stat-value">{stats.averageScore}/10</div>
            <div className="glass-stat-label">Average Score</div>
          </div>

          <div className="glass-stat-card">
            <div className="flex gap-4 justify-center text-sm">
              <span className="text-indigo-200">HOT: {stats.leadsByCategory.HOT}</span>
              <span className="text-indigo-200">WARM: {stats.leadsByCategory.WARM}</span>
              <span className="text-indigo-200">COLD: {stats.leadsByCategory.COLD}</span>
            </div>
            <div className="glass-stat-label">Leads by Category</div>
          </div>
        </div>

        <div className="mt-8 glass-card">
          <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 to-indigo-100 mb-6">
            Lead Score Trend
          </h2>
          <div className="h-96">
            <Line 
              data={chartData} 
              options={{ 
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 10,
                    grid: {
                      color: 'rgba(99, 102, 241, 0.1)',
                    },
                    ticks: {
                      color: '#e0e7ff'
                    }
                  },
                  x: {
                    grid: {
                      color: 'rgba(99, 102, 241, 0.1)',
                    },
                    ticks: {
                      color: '#e0e7ff'
                    }
                  }
                },
                plugins: {
                  legend: {
                    labels: {
                      color: '#e0e7ff'
                    }
                  }
                }
              }} 
            />
          </div>
        </div>
      </div>
    </div>
  )
} 