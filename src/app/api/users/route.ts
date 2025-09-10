import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyTokenFromRequest } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await verifyTokenFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')
    const patientId = searchParams.get('patientId')
    const providerId = searchParams.get('providerId')
    const providersAndPatients = searchParams.get('providersAndPatients')

    // Build the where clause
    let whereClause: any = {
      isActive: true,
    }

    if (role) {
      whereClause.role = role
    }

    // For patients looking for their providers
    if (patientId && role === 'PROVIDER') {
      // Find providers who have appointments with this patient
      whereClause.provider = {
        appointments: {
          some: {
            patientId: patientId,
          },
        },
      }
    }

    // For providers looking for their patients and other providers
    if (providersAndPatients === 'true' && providerId) {
      // First, get patients who have appointments with this provider
      const patientIds = await prisma.appointment.findMany({
        where: {
          providerId: providerId,
        },
        select: {
          patientId: true,
        },
        distinct: ['patientId'],
      })

      const patientUserIds = await prisma.patient.findMany({
        where: {
          id: {
            in: patientIds.map(p => p.patientId),
          },
        },
        select: {
          userId: true,
        },
      })

      // Build a complex where clause to get both patients and providers
      whereClause.OR = [
        {
          id: {
            in: patientUserIds.map(p => p.userId),
          },
        },
        {
          role: 'PROVIDER',
        },
      ]
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        phone: true,
        patient: {
          select: {
            id: true,
            dateOfBirth: true,
            emergencyContact: true,
            insuranceType: true,
            insuranceProvider: true,
            insurancePolicyNumber: true,
            insuranceGroupNumber: true,
            allergies: true,
            medications: true,
          },
        },
        provider: {
          select: {
            id: true,
            specialty: true,
            department: true,
            licenseNumber: true,
          },
        },
      },
      orderBy: [
        { role: 'asc' },
        { firstName: 'asc' },
        { lastName: 'asc' },
      ],
    })

    return NextResponse.json({
      success: true,
      data: users,
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}