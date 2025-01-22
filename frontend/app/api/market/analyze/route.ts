import { NextResponse } from 'next/server'
import { openai, analyzeCompetitor } from '@/lib/ai'

export async function POST(request: Request) {
  try {
    const { competitors, trends } = await request.json()
    
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{
        role: "system",
        content: "You are a market analysis expert. Analyze the competitors and market trends to provide strategic insights."
      }, {
        role: "user",
        content: `Analyze these market conditions:
          Competitors: ${JSON.stringify(competitors)}
          Market Trends: ${JSON.stringify(trends)}
          
          Provide insights on:
          1. Competitive landscape
          2. Market opportunities
          3. Potential threats
          4. Strategic recommendations`
      }]
    })
    
    return NextResponse.json({
      insights: response.choices[0].message.content
    })
  } catch (error) {
    console.error('Error analyzing market:', error)
    return NextResponse.json(
      { error: 'Failed to analyze market' },
      { status: 500 }
    )
  }
} 