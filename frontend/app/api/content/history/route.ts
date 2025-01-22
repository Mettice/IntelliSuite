import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/db'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')

  try {
    const history = await prisma.content.findMany({
      where: { type: type || undefined },
      orderBy: { createdAt: 'desc' },
      take: 10
    })

    return NextResponse.json(history)
  } catch (error) {
    console.error('Error fetching content history:', error)
    return NextResponse.json(
      { error: 'Failed to fetch content history' },
      { status: 500 }
    )
  }
} 