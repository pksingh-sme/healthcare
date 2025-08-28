import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyTokenFromRequest } from '@/lib/auth'
import { Role } from '@prisma/client'
import { headers } from 'next/headers'

// PUT /api/demo-requests/[id] - Update a demo request status (protected endpoint)
export async function PUT(request: Request, { params }: { params: { id: string } }) {
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

    const { id } = params

    if (!id) {
      return NextResponse.json(
        { error: 'Missing demo request ID' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { status } = body

    // Validate status
    const validStatuses = ['PENDING', 'VIEWED', 'CONTACTED', 'DEMO_COMPLETED', 'CLOSED']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }

    // Update demo request status
    const updatedDemoRequest = await prisma.demoRequest.update({
      where: { id },
      data: { 
        status,
        updatedAt: new Date()
      }
    })

    return NextResponse.json(updatedDemoRequest)
  } catch (error) {
    console.error('Error updating demo request status:', error)
    return NextResponse.json(
      { error: 'Failed to update demo request status' },
      { status: 500 }
    )
  }
}

// DELETE /api/demo-requests/[id] - Delete a demo request (protected endpoint)
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
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

    const { id } = params

    if (!id) {
      return NextResponse.json(
        { error: 'Missing demo request ID' },
        { status: 400 }
      )
    }

    // Delete demo request
    await prisma.demoRequest.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Demo request deleted successfully' })
  } catch (error) {
    console.error('Error deleting demo request:', error)
    return NextResponse.json(
      { error: 'Failed to delete demo request' },
      { status: 500 }
    )
  }
}