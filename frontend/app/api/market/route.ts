import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    endpoints: [
      '/api/market/competitors',
      '/api/market/trends'
    ]
  })
} 