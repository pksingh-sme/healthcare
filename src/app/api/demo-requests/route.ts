import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyTokenFromRequest } from '@/lib/auth'
import { Role } from '@prisma/client'
import { headers } from 'next/headers'

// Make this route dynamic to prevent static generation issues
export const dynamic = 'force-dynamic'

// POST /api/demo-requests - Create a new demo request
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const {
      name,
      email,
      company,
      role,
      message,
      preferredDate,
      preferredTime
    } = body

    // Validate required fields
    if (!name || !email || !company || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create demo request in database
    const demoRequest = await prisma.demoRequest.create({
      data: {
        name,
        email,
        company,
        role,
        message: message || '',
        preferredDate: preferredDate ? new Date(preferredDate) : null,
        preferredTime: preferredTime || null,
        status: 'PENDING' // Default status
      }
    })

    return NextResponse.json(demoRequest, { status: 201 })
  } catch (error) {
    console.error('Error creating demo request:', error)
    return NextResponse.json(
      { error: 'Failed to create demo request' },
      { status: 500 }
    )
  }
}

// GET /api/demo-requests - Get all demo requests (protected endpoint)
export async function GET(request: Request) {
  try {
    // Check authentication
    const reqHeaders = headers()
    const user = await verifyTokenFromRequest({
      headers: reqHeaders,
    } as any)

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is admin
    if (user.role !== Role.ADMIN) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }
    
    const demoRequests = await prisma.demoRequest.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(demoRequests)
  } catch (error) {
    console.error('Error fetching demo requests:', error)
    return NextResponse.json(
      { error: 'Failed to fetch demo requests' },
      { status: 500 }
    )
  }
}