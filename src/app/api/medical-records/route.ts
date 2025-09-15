import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyTokenFromRequest } from '@/lib/auth'
import { logPHIAccess } from '@/lib/audit'
import { encryptPHI, decryptPHI } from '@/lib/encryption'

// Make this route dynamic to prevent static generation issues
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const user = await verifyTokenFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Log PHI access
    await logPHIAccess(
      user.id,
      'READ',
      'MedicalRecord',
      undefined,
      'View medical records',
      request
    );

    // Only providers and admins can access medical records
    if (user.role === 'PATIENT') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const patientId = searchParams.get('patientId')
    const appointmentId = searchParams.get('appointmentId')

    let whereClause: any = {}

    if (patientId) {
      whereClause.patientId = patientId
    }

    if (appointmentId) {
      whereClause.appointmentId = appointmentId
    }

    if (user.role === 'PROVIDER') {
      // Providers can only see records they created
      whereClause.providerId = user.provider?.id
    }

    const records = await prisma.medicalRecord.findMany({
      where: whereClause,
      include: {
        patient: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
        provider: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        appointment: {
          select: {
            title: true,
            startTime: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Decrypt sensitive fields with proper error handling
    const decryptedRecords = records.map(record => ({
      ...record,
      notes: record.notes && typeof record.notes === 'string' && record.notes.includes(':') 
        ? decryptPHI(record.notes) 
        : record.notes || null,
      labResults: record.labResults && typeof record.labResults === 'string' && record.labResults.includes(':') 
        ? decryptPHI(record.labResults) 
        : record.labResults || null,
      prescriptions: record.prescriptions && typeof record.prescriptions === 'string' && record.prescriptions.includes(':') 
        ? decryptPHI(record.prescriptions) 
        : record.prescriptions || null,
    }));

    return NextResponse.json({
      success: true,
      data: decryptedRecords,
    })
  } catch (error) {
    console.error('Error fetching medical records:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await verifyTokenFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Log PHI creation
    await logPHIAccess(
      user.id,
      'CREATE',
      'MedicalRecord',
      undefined,
      'Create medical record',
      request
    );

    // Only providers and admins can create medical records
    if (user.role === 'PATIENT') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const {
      patientId,
      appointmentId,
      chiefComplaint,
      diagnosis,
      treatment,
      notes,
      bloodPressureSystolic,
      bloodPressureDiastolic,
      heartRate,
      temperature,
      weight,
      height,
      labResults,
      prescriptions,
    } = body

    // Validate required fields
    if (!patientId) {
      return NextResponse.json(
        { error: 'Patient ID is required' },
        { status: 400 }
      )
    }

    // AI Stub: Calculate readmission risk based on various factors
    let readmissionRisk = 0.1 // Base risk

    // Increase risk based on vital signs
    if (bloodPressureSystolic && bloodPressureSystolic > 140) {
      readmissionRisk += 0.2
    }
    if (heartRate && (heartRate > 100 || heartRate < 60)) {
      readmissionRisk += 0.15
    }
    if (temperature && temperature > 100.4) {
      readmissionRisk += 0.25
    }

    // Increase risk based on diagnosis keywords
    const diagnosis_lower = diagnosis?.toLowerCase() || ''
    if (diagnosis_lower.includes('diabetes') || diagnosis_lower.includes('heart') || diagnosis_lower.includes('chronic')) {
      readmissionRisk += 0.3
    }

    // Cap at 1.0
    readmissionRisk = Math.min(readmissionRisk, 1.0)

    // AI Stub: Generate suggested ICD-10/CPT codes based on diagnosis and treatment
    const suggestedCodes = []
    if (diagnosis_lower.includes('diabetes')) {
      suggestedCodes.push('E11.9 - Type 2 diabetes mellitus without complications')
    }
    if (diagnosis_lower.includes('hypertension') || diagnosis_lower.includes('high blood pressure')) {
      suggestedCodes.push('I10 - Essential hypertension')
    }
    if (diagnosis_lower.includes('flu') || diagnosis_lower.includes('influenza')) {
      suggestedCodes.push('J09.X2 - Influenza due to identified novel influenza A virus')
    }
    if (treatment?.toLowerCase().includes('consultation')) {
      suggestedCodes.push('99213 - Office or other outpatient visit')
    }

    const record = await prisma.medicalRecord.create({
      data: {
        patientId,
        providerId: user.provider?.id || '',
        appointmentId: appointmentId || undefined,
        chiefComplaint: chiefComplaint || undefined,
        diagnosis: diagnosis || undefined,
        treatment: treatment || undefined,
        notes: notes ? encryptPHI(notes) : undefined,
        bloodPressureSystolic: bloodPressureSystolic || undefined,
        bloodPressureDiastolic: bloodPressureDiastolic || undefined,
        heartRate: heartRate || undefined,
        temperature: temperature || undefined,
        weight: weight || undefined,
        height: height || undefined,
        labResults: labResults ? encryptPHI(labResults) : undefined,
        prescriptions: prescriptions ? encryptPHI(prescriptions) : undefined,
        readmissionRisk,
        suggestedCodes: suggestedCodes.length > 0 ? suggestedCodes.join('; ') : undefined,
      },
      include: {
        patient: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
        provider: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        appointment: {
          select: {
            title: true,
            startTime: true,
          },
        },
      },
    })

    // Decrypt sensitive fields before sending response with proper error handling
    const decryptedRecord = {
      ...record,
      notes: record.notes && typeof record.notes === 'string' && record.notes.includes(':') 
        ? decryptPHI(record.notes) 
        : record.notes || null,
      labResults: record.labResults && typeof record.labResults === 'string' && record.labResults.includes(':') 
        ? decryptPHI(record.labResults) 
        : record.labResults || null,
      prescriptions: record.prescriptions && typeof record.prescriptions === 'string' && record.prescriptions.includes(':') 
        ? decryptPHI(record.prescriptions) 
        : record.prescriptions || null,
    };

    return NextResponse.json({
      success: true,
      data: decryptedRecord,
      message: 'Medical record created successfully',
    })
  } catch (error) {
    console.error('Error creating medical record:', error)
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

    // Log PHI update
    await logPHIAccess(
      user.id,
      'UPDATE',
      'MedicalRecord',
      undefined,
      'Update medical record',
      request
    );

    // Only providers and admins can update medical records
    if (user.role === 'PATIENT') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { recordId, ...updateData } = body

    // Encrypt sensitive fields if provided
    if (updateData.notes !== undefined) {
      updateData.notes = updateData.notes ? encryptPHI(updateData.notes) : null;
    }
    if (updateData.labResults !== undefined) {
      updateData.labResults = updateData.labResults ? encryptPHI(updateData.labResults) : null;
    }
    if (updateData.prescriptions !== undefined) {
      updateData.prescriptions = updateData.prescriptions ? encryptPHI(updateData.prescriptions) : null;
    }

    if (!recordId) {
      return NextResponse.json(
        { error: 'Record ID is required' },
        { status: 400 }
      )
    }

    // Check if record exists and user has permission
    const existingRecord = await prisma.medicalRecord.findUnique({
      where: { id: recordId },
    })

    if (!existingRecord) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 })
    }

    // Providers can only update their own records
    if (user.role === 'PROVIDER' && existingRecord.providerId !== user.provider?.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const updatedRecord = await prisma.medicalRecord.update({
      where: { id: recordId },
      data: updateData,
      include: {
        patient: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
        provider: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    })

    // Decrypt sensitive fields before sending response with proper error handling
    const decryptedRecord = {
      ...updatedRecord,
      notes: updatedRecord.notes && typeof updatedRecord.notes === 'string' && updatedRecord.notes.includes(':') 
        ? decryptPHI(updatedRecord.notes) 
        : updatedRecord.notes || null,
      labResults: updatedRecord.labResults && typeof updatedRecord.labResults === 'string' && updatedRecord.labResults.includes(':') 
        ? decryptPHI(updatedRecord.labResults) 
        : updatedRecord.labResults || null,
      prescriptions: updatedRecord.prescriptions && typeof updatedRecord.prescriptions === 'string' && updatedRecord.prescriptions.includes(':') 
        ? decryptPHI(updatedRecord.prescriptions) 
        : updatedRecord.prescriptions || null,
    };

    return NextResponse.json({
      success: true,
      data: decryptedRecord,
      message: 'Medical record updated successfully',
    })
  } catch (error) {
    console.error('Error updating medical record:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}