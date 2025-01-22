'use client'

import { useState, useEffect } from 'react'
import { Competitor } from '@/types/market'
import CompetitorModal from './CompetitorModal'
import CompetitorChart from './CompetitorChart'
import { MagnifyingGlassIcon as SearchIcon, FunnelIcon as FilterIcon } from '@heroicons/react/24/outline'

interface Lead {
  competitorMentioned: string;
}

export default function CompetitorAnalysis() {
  const [competitors, setCompetitors] = useState<Competitor[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [competitorImpact, setCompetitorImpact] = useState<Record<string, number>>({})
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'marketShare'>('name')
  const [filterMarketShare, setFilterMarketShare] = useState<string>('all')

  const fetchCompetitors = async () => {
    try {
      const response = await fetch('/api/market/competitors')
      const data = await response.json()
      const parsedData = data.map((competitor: any) => ({
        ...competitor,
        strengths: JSON.parse(competitor.strengths[0]),
        weaknesses: JSON.parse(competitor.weaknesses[0])
      }))
      setCompetitors(parsedData)
    } catch (err) {
      setError('Error loading competitors')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCompetitors()
  }, [])

  useEffect(() => {
    const analyzeLeadImpact = async () => {
      const leads = await fetch('/api/leads').then(r => r.json())
      const competitors = await fetch('/api/market/competitors').then(r => r.json())
      
      // Calculate how competitors affect lead conversion
      const impact = competitors.reduce((acc: Record<string, number>, comp: Competitor) => ({
        ...acc,
        [comp.id || '']: leads.filter((l: Lead) => l.competitorMentioned === comp.name).length
      }), {})
      
      setCompetitorImpact(impact)
    }
    
    analyzeLeadImpact()
  }, [])

  const handleSaveCompetitor = async (competitor: Competitor) => {
    try {
      const response = await fetch('/api/market/competitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(competitor)
      })
      
      if (!response.ok) throw new Error('Failed to save competitor')
      
      await fetchCompetitors() // Refresh the list
    } catch (err) {
      setError('Error saving competitor')
      console.error(err)
    }
  }

  const filteredCompetitors = competitors
    .filter(comp => {
      const matchesSearch = comp.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesFilter = filterMarketShare === 'all' || 
        (filterMarketShare === 'high' && parseFloat(comp.marketShare) > 20) ||
        (filterMarketShare === 'medium' && parseFloat(comp.marketShare) <= 20 && parseFloat(comp.marketShare) > 10) ||
        (filterMarketShare === 'low' && parseFloat(comp.marketShare) <= 10)
      return matchesSearch && matchesFilter
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      return parseFloat(b.marketShare) - parseFloat(a.marketShare)
    })

  if (loading) return <div>Loading...</div>
  if (error) return <div className="text-red-500">{error}</div>

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">Competitor Analysis</h3>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-primary text-sm"
        >
          Add Competitor
        </button>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search competitors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'name' | 'marketShare')}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="name">Sort by Name</option>
            <option value="marketShare">Sort by Market Share</option>
          </select>
          <select
            value={filterMarketShare}
            onChange={(e) => setFilterMarketShare(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="all">All Market Shares</option>
            <option value="high">High (&gt;20%)</option>
            <option value="medium">Medium (10-20%)</option>
            <option value="low">Low (&lt;10%)</option>
          </select>
        </div>
      </div>

      {/* Chart */}
      <div className="mb-6 h-64">
        <CompetitorChart competitors={competitors} />
      </div>

      {/* Competitor List */}
      <div className="space-y-6">
        {filteredCompetitors.map((competitor, index) => (
          <div key={competitor.id || index} className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-base font-medium">{competitor.name}</h4>
                <p className="text-sm text-gray-500">{competitor.website}</p>
              </div>
              <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {competitor.marketShare} Market Share
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">Strengths</h5>
                <ul className="list-disc list-inside text-sm text-gray-600">
                  {competitor.strengths.map((strength: string, i: number) => (
                    <li key={i}>{strength}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">Weaknesses</h5>
                <ul className="list-disc list-inside text-sm text-gray-600">
                  {competitor.weaknesses.map((weakness: string, i: number) => (
                    <li key={i}>{weakness}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-4 text-xs text-gray-500">
              Last updated: {new Date(competitor.lastUpdated).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>

      <CompetitorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCompetitor}
      />
    </div>
  )
} 