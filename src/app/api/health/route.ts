import { NextResponse } from 'next/server'

// Make this route dynamic to prevent static generation issues
export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'ClinicEase AI Healthcare Management System by Clinch Infosystems'
  })
}