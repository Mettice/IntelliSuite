export interface Competitor {
  id?: string
  name: string
  website: string
  strengths: string[]
  weaknesses: string[]
  marketShare: string
  lastUpdated: string
}

export interface MarketTrend {
  id?: string
  trend: string
  impact: 'HIGH' | 'MEDIUM' | 'LOW'
  description: string
  source: string
  date: string
}