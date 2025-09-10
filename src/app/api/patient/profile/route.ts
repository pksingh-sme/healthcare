import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyTokenFromRequest } from '@/lib/auth'
import { logPHIAccess } from '@/lib/audit'
import { encryptPHI, decryptPHI } from '@/lib/encryption'

export async function GET(request: NextRequest) {
  try {
    const user = await verifyTokenFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (user.role !== 'PATIENT') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Log PHI access
    await logPHIAccess(
      user.id, 
      'READ', 
      'PatientProfile', 
      user.patient?.id, 
      'View patient profile', 
      request
    )

    const patient = await prisma.patient.findUnique({
      where: { userId: user.id },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
      },
    })

    if (!patient) {
      return NextResponse.json({ error: 'Patient profile not found' }, { status: 404 })
    }

    // Decrypt sensitive fields before sending to client
    return NextResponse.json({
      success: true,
      data: {
        id: patient.id,
        dateOfBirth: patient.dateOfBirth,
        gender: patient.gender,
        address: patient.address,
        city: patient.city,
        state: patient.state,
        zipCode: patient.zipCode,
        emergencyContact: patient.emergencyContact,
        emergencyPhone: patient.emergencyPhone,
        insuranceType: patient.insuranceType,
        insuranceProvider: patient.insuranceProvider,
        allergies: patient.allergies ? decryptPHI(patient.allergies) : null,
        medications: patient.medications ? decryptPHI(patient.medications) : null,
        medicalHistory: patient.medicalHistory ? decryptPHI(patient.medicalHistory) : null,
        user: patient.user,
      },
    })
  } catch (error) {
    console.error('Error fetching patient profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await verifyTokenFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (user.role !== 'PATIENT') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Log PHI modification
    await logPHIAccess(
      user.id, 
      'UPDATE', 
      'PatientProfile', 
      user.patient?.id, 
      'Update patient profile', 
      request
    )

    const body = await request.json()
    const {
      dateOfBirth,
      gender,
      address,
      city,
      state,
      zipCode,
      emergencyContact,
      emergencyPhone,
      allergies,
      medications,
    } = body

    const updatedPatient = await prisma.patient.update({
      where: { userId: user.id },
      data: {
        ...(dateOfBirth && { dateOfBirth: new Date(dateOfBirth) }),
        ...(gender && { gender }),
        ...(address && { address }),
        ...(city && { city }),
        ...(state && { state }),
        ...(zipCode && { zipCode }),
        ...(emergencyContact && { emergencyContact }),
        ...(emergencyPhone && { emergencyPhone }),
        ...(allergies !== undefined && { allergies: allergies ? encryptPHI(allergies) : null }),
        ...(medications !== undefined && { medications: medications ? encryptPHI(medications) : null }),
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        id: updatedPatient.id,
        dateOfBirth: updatedPatient.dateOfBirth,
        gender: updatedPatient.gender,
        address: updatedPatient.address,
        city: updatedPatient.city,
        state: updatedPatient.state,
        zipCode: updatedPatient.zipCode,
        emergencyContact: updatedPatient.emergencyContact,
        emergencyPhone: updatedPatient.emergencyPhone,
        insuranceType: updatedPatient.insuranceType,
        insuranceProvider: updatedPatient.insuranceProvider,
        allergies: updatedPatient.allergies ? decryptPHI(updatedPatient.allergies) : null,
        medications: updatedPatient.medications ? decryptPHI(updatedPatient.medications) : null,
        user: updatedPatient.user,
      },
      message: 'Profile updated successfully',
    })
  } catch (error) {
    console.error('Error updating patient profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}