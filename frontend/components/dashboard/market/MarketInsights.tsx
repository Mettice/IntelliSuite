'use client'

import { useState, useEffect } from 'react'

export default function MarketInsights() {
  const [insights, setInsights] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    const analyzeMarket = async () => {
      try {
        setLoading(true)
        const competitors = await fetch('/api/market/competitors').then(r => r.json())
        const trends = await fetch('/api/market/trends').then(r => r.json())
        
        const analysis = await fetch('/api/market/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ competitors, trends })
        }).then(r => r.json())
        
        setInsights(analysis.insights)
      } catch (err) {
        setError('Failed to generate insights')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    
    analyzeMarket()
  }, [])
  
  if (loading) return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900">Market Insights</h3>
      <div className="mt-4 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="space-y-3 mt-4">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  )

  if (error) return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900">Market Insights</h3>
      <div className="mt-4 text-red-500">{error}</div>
    </div>
  )

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900">Market Insights</h3>
      <div className="mt-4 prose max-w-none">{insights}</div>
    </div>
  )
} 