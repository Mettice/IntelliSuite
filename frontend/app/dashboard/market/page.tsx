'use client'

import CompetitorAnalysis from '../../../components/dashboard/market/CompetitorAnalysis'
import MarketTrends from '../../../components/dashboard/market/MarketTrends'
import MarketInsights from '../../../components/dashboard/market/MarketInsights'

export default function MarketIntelligence() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <section className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Market Intelligence</h1>
              <p className="mt-1 text-sm text-gray-500">Track competitors and market trends</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <MarketInsights />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CompetitorAnalysis />
            <MarketTrends />
          </div>
        </div>
      </div>
    </div>
  )
} 