'use client'

import { useEffect, useState } from 'react'
import LeadTable from '../../../components/dashboard/LeadTable'
import { Lead, LeadAnalysis } from '../../../types'

export default function LeadsPage() {
  const [leads, setLeads] = useState<(Lead & LeadAnalysis)[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await fetch('/api/leads')
        const data = await response.json()
        setLeads(data || [])
        setLoading(false)
      } catch (error) {
        console.error('Error fetching leads:', error)
        setLoading(false)
      }
    }

    fetchLeads()
  }, [])

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Lead Management</h1>
        <LeadTable leads={leads} loading={loading} />
      </div>
    </div>
  )
} 