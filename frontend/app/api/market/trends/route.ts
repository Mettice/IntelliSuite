import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/db'

export async function GET() {
  try {
    const trends = await prisma.marketTrend.findMany({
      orderBy: { date: 'desc' }
    })
    return NextResponse.json(trends)
  } catch (error) {
    console.error('Error fetching trends:', error)
    return NextResponse.json(
      { error: 'Failed to fetch trends' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    const result = await prisma.marketTrend.create({
      data: {
        trend: data.trend,
        impact: data.impact,
        description: data.description,
        source: data.source,
        date: new Date()
      }
    })
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error creating trend:', error)
    return NextResponse.json(
      { error: 'Failed to create trend' },
      { status: 500 }
    )
  }
} 