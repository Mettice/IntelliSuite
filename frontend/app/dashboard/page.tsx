'use client'

import { useEffect, useState } from 'react'
import ScoreCard from '../../components/dashboard/ScoreCard'
import LeadTable from '../../components/dashboard/LeadTable'
import { Lead, LeadAnalysis } from '../../types'

export default function Dashboard() {
  const [stats, setStats] = useState({
    hot: 0,
    warm: 0,
    cold: 0
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
          hot: leadsArray.filter(lead => lead.category === 'HOT').length,
          warm: leadsArray.filter(lead => lead.category === 'WARM').length,
          cold: leadsArray.filter(lead => lead.category === 'COLD').length
        })
      } catch (error) {
        console.error('Error fetching leads:', error)
        setLeads([])
        setStats({ hot: 0, warm: 0, cold: 0 })
      } finally {
        setLoading(false)
      }
    }

    fetchLeads()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Lead Management Dashboard
            </h1>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Export Leads
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <ScoreCard title="Hot Leads" count={stats.hot} category="hot" />
          <ScoreCard title="Warm Leads" count={stats.warm} category="warm" />
          <ScoreCard title="Cold Leads" count={stats.cold} category="cold" />
        </div>

        <div className="mt-8">
          <LeadTable leads={leads} loading={loading} />
        </div>
      </main>
    </div>
  )
} 