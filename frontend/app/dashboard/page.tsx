'use client'

import { useEffect, useState } from 'react'
import ScoreCard from '../../components/dashboard/ScoreCard'
import LeadTable from '../../components/dashboard/LeadTable'
import { Lead, LeadAnalysis } from '../../types'

export default function Dashboard() {
  const [stats, setStats] = useState({
    hot: 0,
    warm: 0,
    cold: 0,
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
          hot: leadsArray.filter((lead) => lead.category === 'HOT').length,
          warm: leadsArray.filter((lead) => lead.category === 'WARM').length,
          cold: leadsArray.filter((lead) => lead.category === 'COLD').length,
        })
      } catch (error) {
        console.error('Error fetching leads:', error)
        // Use empty leads array but don't crash
        setLeads([])
        setStats({ hot: 0, warm: 0, cold: 0 })
        // Show a toast or notification to the user that data is unavailable
        alert('Unable to fetch leads data. Using mock data or demo mode.')
      } finally {
        setLoading(false)
      }
    }

    fetchLeads()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Lead Management Dashboard
            </h1>
            
          </div>
        </div>
      </header>

      {/* Main Content */}
    <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <ScoreCard
          title="Hot Leads"
          count={stats.hot}
          category="hot"
          loading={loading}
        />
        <ScoreCard
          title="Warm Leads"
          count={stats.warm}
          category="warm"
          loading={loading}
        />
        <ScoreCard
          title="Cold Leads"
          count={stats.cold}
          category="cold"
          loading={loading}
        />
      </div>

      {/* Lead Table */}
      <div className="mt-10">
        <LeadTable leads={leads} loading={loading} />
      </div>
    </main>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      )}
    </div>
  )
}