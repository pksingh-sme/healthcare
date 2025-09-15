import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyTokenFromRequest } from '@/lib/auth'
import { Role, InsuranceType } from '@prisma/client'
import { z } from 'zod'

const updatePatientSchema = z.object({
  firstName: z.string().min(1, 'First name is required').optional(),
  lastName: z.string().min(1, 'Last name is required').optional(),
  email: z.string().email('Invalid email format').optional(),
  phone: z.string().optional(),
  dateOfBirth: z.string().min(1, 'Date of birth is required').optional(),
  gender: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  emergencyContact: z.string().optional(),
  emergencyPhone: z.string().optional(),
  insuranceType: z.enum(['PRIVATE', 'MEDICARE', 'MEDICAID', 'SELF_PAY', 'OTHER']).optional(),
  insuranceProvider: z.string().optional(),
})

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await verifyTokenFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (user.role !== Role.ADMIN) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const patientId = params.id
    if (!patientId) {
      return NextResponse.json({ error: 'Patient ID is required' }, { status: 400 })
    }

    // Find the patient
    const existingPatient = await prisma.patient.findUnique({
      where: { id: patientId },
      include: { user: true }
    })

    if (!existingPatient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 })
    }

    const body = await request.json()
    const validatedData = updatePatientSchema.parse(body)

    // Update user and patient in a transaction
    const result = await prisma.$transaction(async (prisma) => {
      // Update user
      const updatedUser = await prisma.user.update({
        where: { id: existingPatient.userId },
        data: {
          ...(validatedData.firstName && { firstName: validatedData.firstName }),
          ...(validatedData.lastName && { lastName: validatedData.lastName }),
          ...(validatedData.email && { email: validatedData.email }),
          ...(validatedData.phone !== undefined && { phone: validatedData.phone }),
        },
      })

      // Update patient record
      const updatedPatient = await prisma.patient.update({
        where: { id: patientId },
        data: {
          ...(validatedData.dateOfBirth && { dateOfBirth: new Date(validatedData.dateOfBirth) }),
          ...(validatedData.gender !== undefined && { gender: validatedData.gender }),
          ...(validatedData.address !== undefined && { address: validatedData.address }),
          ...(validatedData.city !== undefined && { city: validatedData.city }),
          ...(validatedData.state !== undefined && { state: validatedData.state }),
          ...(validatedData.zipCode !== undefined && { zipCode: validatedData.zipCode }),
          ...(validatedData.emergencyContact !== undefined && { emergencyContact: validatedData.emergencyContact }),
          ...(validatedData.emergencyPhone !== undefined && { emergencyPhone: validatedData.emergencyPhone }),
          ...(validatedData.insuranceType !== undefined && { insuranceType: validatedData.insuranceType as any }),
          ...(validatedData.insuranceProvider !== undefined && { insuranceProvider: validatedData.insuranceProvider }),
        },
      })

      return { user: updatedUser, patient: updatedPatient }
    })

    return NextResponse.json({
      success: true,
      data: {
        id: result.patient.id,
        user: {
          id: result.user.id,
          firstName: result.user.firstName,
          lastName: result.user.lastName,
          email: result.user.email,
          phone: result.user.phone,
          role: result.user.role,
        },
        dateOfBirth: result.patient.dateOfBirth,
        gender: result.patient.gender,
        address: result.patient.address,
        city: result.patient.city,
        state: result.patient.state,
        zipCode: result.patient.zipCode,
        emergencyContact: result.patient.emergencyContact,
        emergencyPhone: result.patient.emergencyPhone,
        insuranceType: result.patient.insuranceType,
        insuranceProvider: result.patient.insuranceProvider,
      },
      message: 'Patient updated successfully',
    })
  } catch (error) {
    console.error('Error updating patient:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 })
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}