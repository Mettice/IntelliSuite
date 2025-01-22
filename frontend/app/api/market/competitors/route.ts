import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/db'

export async function GET() {
  try {
    console.log('Prisma client:', Object.keys(prisma))  // See what models are available
    console.log('Fetching competitors...')
    const competitors = await prisma.competitor.findMany({
      orderBy: { lastUpdated: 'desc' }
    })
    console.log('Found competitors:', competitors)
    return NextResponse.json(competitors)
  } catch (error) {
    console.error('Error details:', error)
    return NextResponse.json(
      { error: 'Failed to fetch competitors' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    const result = await prisma.competitor.create({
      data: {
        name: data.name,
        website: data.website,
        strengths: data.strengths,
        weaknesses: data.weaknesses,
        marketShare: data.marketShare,
        lastUpdated: new Date()
      }
    })
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error creating competitor:', error)
    return NextResponse.json(
      { error: 'Failed to create competitor' },
      { status: 500 }
    )
  }
} 