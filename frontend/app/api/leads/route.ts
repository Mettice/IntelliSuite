import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/db'  // Use shared instance

export async function GET() {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        company: true,
        message: true,
        score: true,
        category: true,
        reason: true,
        action: true,
        createdAt: true
      }
    })
    // Ensure we return an array
    return NextResponse.json(leads || [])
  } catch (error) {
    console.error('Database error:', error)
    // Return empty array on error
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('Received lead:', body)

    try {
      // First try FastAPI
      const qualificationResponse = await fetch('http://127.0.0.1:8000/qualify-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      const analysis = await qualificationResponse.json()
      console.log('Lead analysis:', analysis)

      // Save to database
      const lead = await prisma.lead.create({
        data: {
          name: body.name,
          email: body['email '].trim(),
          phone: body['phone '].trim(),
          company: body['company '].trim(),
          message: body['message '].trim(),
          score: analysis.score || 5,
          category: analysis.category || 'WARM',
          reason: analysis.reason || 'Manual review needed',
          action: analysis.action || 'Follow up required'
        }
      })

      // Send to Make.com
      await fetch('https://hook.eu2.make.com/z2t98fek6llh43lihtjknw27iga7sirc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: lead.name,
          email: lead.email,
          phone: lead.phone,
          company: lead.company,
          message: lead.message,
          score: lead.score,
          category: lead.category,
          reason: lead.reason,
          action: lead.action,
          createdAt: lead.createdAt
        })
      })

      return NextResponse.json(lead)
    } catch (fastApiError) {
      console.error('FastAPI Error:', fastApiError)
      // Save lead without analysis if FastAPI fails
      const lead = await prisma.lead.create({
        data: {
          name: body.name,
          email: body['email '].trim(),
          phone: body['phone '].trim(),
          company: body['company '].trim(),
          message: body['message '].trim(),
          score: 5,
          category: 'WARM',
          reason: 'FastAPI unavailable - Manual review needed',
          action: 'Follow up required'
        }
      })
      return NextResponse.json(lead)
    }
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to process lead' },
      { status: 500 }
    )
  }
} 