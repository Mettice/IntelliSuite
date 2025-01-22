'use client'

import { useState, useEffect } from 'react'
import { MarketTrend } from '../../../types/market'

export default function MarketTrends() {
  const [trends, setTrends] = useState<MarketTrend[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTrends()
  }, [])

  const fetchTrends = async () => {
    try {
      const response = await fetch('/api/market/trends')
      if (!response.ok) throw new Error('Failed to fetch trends')
      const data = await response.json()
      setTrends(data)
    } catch (err) {
      setError('Error loading trends')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div className="text-red-500">{error}</div>

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">Market Trends</h3>
      </div>

      <div className="space-y-4">
        {trends.map((trend) => (
          <div key={trend.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-base font-medium">{trend.trend}</h4>
                <p className="text-sm text-gray-500 mt-1">{trend.description}</p>
              </div>
              <span className={`text-sm px-2 py-1 rounded bg-blue-100 text-blue-800`}>
                {trend.impact} Impact
              </span>
            </div>
            
            <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
              <span>Source: {trend.source}</span>
              <span>{new Date(trend.date).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 