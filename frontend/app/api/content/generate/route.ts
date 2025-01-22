import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/db'

export async function POST(request: Request) {
  try {
    const { type, prompt } = await request.json()

    // Add error handling for FastAPI connection
    try {
      const response = await fetch('http://localhost:8000/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, prompt })
      })

      if (!response.ok) {
        throw new Error(`FastAPI responded with status: ${response.status}`)
      }

      const data = await response.json()

      // Save to database
      await prisma.content.create({
        data: {
          type,
          prompt,
          content: data.text,
          createdAt: new Date()
        }
      })

      return NextResponse.json(data)
    } catch (error) {
      if ((error as any).code === 'ECONNREFUSED') {
        return NextResponse.json(
          { error: 'Backend service is not running. Please start the FastAPI server.' },
          { status: 503 }
        )
      }
      throw error
    }
  } catch (error) {
    console.error('Content generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    )
  }
} 