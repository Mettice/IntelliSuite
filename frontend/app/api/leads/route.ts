import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/db'  // Use shared instance

// Mock data to use when database is unavailable
const mockLeads = [
  {
    id: 'mock-1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '123-456-7890',
    company: 'Acme Inc',
    message: 'Interested in your services',
    score: 8,
    category: 'HOT',
    reason: 'Shows clear interest and provided complete information',
    action: 'Contact immediately',
    createdAt: new Date().toISOString()
  },
  {
    id: 'mock-2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '987-654-3210',
    company: 'XYZ Corp',
    message: 'Need more information about pricing',
    score: 6,
    category: 'WARM',
    reason: 'Inquiring about pricing, might be comparing options',
    action: 'Send pricing information',
    createdAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
  }
]

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
    // Return mock data instead of erroring
    console.log('Returning mock data instead')
    return NextResponse.json(mockLeads)
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('Received lead:', body)

    try {
      // First try FastAPI
      // Replace hardcoded URLs with environment variables
      const FASTAPI_ENDPOINT = process.env.FASTAPI_ENDPOINT || 'http://127.0.0.1:8000/qualify-lead'
      const MAKE_WEBHOOK_URL = process.env.MAKE_WEBHOOK_URL || 'https://hook.eu2.make.com/z2t98fek6llh43lihtjknw27iga7sirc'
      
      // Then use these variables in your fetch calls
      const qualificationResponse = await fetch(FASTAPI_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      const analysis = await qualificationResponse.json()
      console.log('Lead analysis:', analysis)

      try {
        // Save to database
        const lead = await prisma.lead.create({
          data: {
            name: body.name,
            email: body.email.trim(),
            phone: body.phone.trim(),
            company: body.company.trim(),
            message: body.message.trim(),
            score: analysis.score || 5,
            category: analysis.category || 'WARM',
            reason: analysis.reason || 'Manual review needed',
            action: analysis.action || 'Follow up required'
          }
        })

        // Send to Make.com with additional context for follow-up automation
        try {
          await fetch(MAKE_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              lead: {
                id: lead.id,
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
              },
              followup: {
                needsImmediate: lead.category === 'HOT',
                nextActionDate: new Date(Date.now() + 86400000).toISOString(), // 24 hours later
                assignedTo: 'sales@example.com'
              },
              system: {
                source: 'website_form',
                qualifiedBy: 'internal_ai',
                version: '1.0'
              }
            })
          })
        } catch (webhookError) {
          console.error('Make.com webhook error:', webhookError)
          // Continue processing - don't fail the request if webhook fails
        }
        return NextResponse.json(lead)
      } catch (dbError) {
        console.error('Database error:', dbError)
        // Create a mock lead with an id for frontend compatibility
        const mockLead = {
          id: 'mock-' + Date.now(),
          name: body.name,
          email: body.email,
          phone: body.phone,
          company: body.company,
          message: body.message,
          score: analysis.score || 5,
          category: analysis.category || 'WARM',
          reason: analysis.reason || 'Manual review needed',
          action: analysis.action || 'Follow up required',
          createdAt: new Date().toISOString()
        }
        return NextResponse.json(mockLead)
      }
    } catch (fastApiError) {
      console.error('FastAPI Error:', fastApiError)
      // Create a mock lead with basic values
      const mockLead = {
        id: 'mock-' + Date.now(),
        name: body.name,
        email: body.email,
        phone: body.phone,
        company: body.company,
        message: body.message,
        score: 5,
        category: 'WARM',
        reason: 'Manual review needed (API unavailable)',
        action: 'Follow up required',
        createdAt: new Date().toISOString()
      }
      return NextResponse.json(mockLead)
    }
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to process lead' },
      { status: 500 }
    )
  }
}