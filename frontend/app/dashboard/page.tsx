'use client'

import { useEffect, useState } from 'react'
import ScoreCard from '../../components/dashboard/ScoreCard'
import LeadTable from '../../components/dashboard/LeadTable'
import { Lead, LeadAnalysis } from '../../types'
import StatCard from '../../components/dashboard/StatCard'

export default function Dashboard() {
  const [stats, setStats] = useState({
    leads: {
      title: 'Total Leads',
      value: 0,
      description: 'All time leads',
      trend: { value: 0, isUpward: true }
    },
    conversion: {
      title: 'Conversion Rate',
      value: '0%',
      description: 'Last 30 days',
      trend: { value: 0, isUpward: true }
    },
    performance: {
      title: 'Average Score',
      value: '0/10',
      description: 'Lead quality score',
      trend: { value: 0, isUpward: true }
    }
  })
  const [leads, setLeads] = useState<(Lead & LeadAnalysis)[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await fetch('/api/leads')
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const data = await response.json()
        const leadsArray = Array.isArray(data) ? data : []
        setLeads(leadsArray)
        
        // Update stats
        setStats({
          leads: {
            ...stats.leads,
            value: leadsArray.length
          },
          conversion: {
            ...stats.conversion,
            value: `${(leadsArray.filter(lead => lead.converted).length / leadsArray.length * 100).toFixed(2)}%`
          },
          performance: {
            ...stats.performance,
            value: `${leadsArray.reduce((total, lead) => total + lead.score, 0) / leadsArray.length} / 10`
          }
        })
      } catch (error) {
        console.error('Error fetching leads:', error)
        setLeads([])
        setStats({
          leads: {
            ...stats.leads,
            value: 0
          },
          conversion: {
            ...stats.conversion,
            value: '0%'
          },
          performance: {
            ...stats.performance,
            value: '0 / 10'
          }
        })
      } finally {
        setLoading(false)
      }
    }

    fetchLeads()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Overview Section */}
      <section className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome to IntelliSuite</h1>
              <p className="mt-1 text-sm text-gray-500">Your AI-powered business intelligence platform</p>
            </div>
            <div className="flex space-x-3">
              <button className="btn-primary">Export Data</button>
              <button className="btn-secondary">Settings</button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard {...stats.leads} />
          <StatCard {...stats.conversion} />
          <StatCard {...stats.performance} />
        </div>
      </div>

      {/* Lead Management */}
      <section className="max-w-7xl mx-auto mt-8 px-4 sm:px-6 lg:px-8">
        <LeadTable leads={leads} loading={loading} />
      </section>
    </div>
  )
} 