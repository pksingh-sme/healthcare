import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyTokenFromRequest } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

// Make this route dynamic to prevent static generation issues
export const dynamic = 'force-dynamic'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
]

export async function POST(request: NextRequest) {
  try {
    const user = await verifyTokenFromRequest(request)
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is a patient or admin
    if (user.role !== 'PATIENT' && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const formData = await request.formData()
    const file = formData.get('insuranceDocument') as File
    const documentName = formData.get('documentName') as string

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!documentName) {
      return NextResponse.json({ error: 'Document name is required' }, { status: 400 })
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ 
        error: 'Invalid file type. Only PDF, Word documents, and images are allowed' 
      }, { status: 400 })
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ 
        error: 'File too large. Maximum size is 10MB' 
      }, { status: 400 })
    }

    // Determine patient ID
    let patientId: string | null = null
    
    if (user.role === 'PATIENT' && user.patient) {
      patientId = user.patient.id
    } else if (user.role === 'ADMIN') {
      // For admin, get patientId from form data
      patientId = formData.get('patientId') as string
      if (!patientId) {
        return NextResponse.json({ error: 'Patient ID is required for admin uploads' }, { status: 400 })
      }
    }

    if (!patientId) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 400 })
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'insurance')
    try {
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true })
      }
    } catch (dirError) {
      console.error('Error creating uploads directory:', dirError)
      return NextResponse.json({ 
        error: 'Server configuration error' 
      }, { status: 500 })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const extension = file.name.split('.').pop()
    const filename = `insurance_${patientId}_${timestamp}.${extension}`
    const filepath = join(uploadsDir, filename)

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filepath, buffer)

    // Generate public URL
    const fileUrl = `/uploads/insurance/${filename}`

    // Save document info to database
    const insuranceDocument = await prisma.insuranceDocument.create({
      data: {
        patientId,
        name: documentName,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        url: fileUrl
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Insurance document uploaded successfully',
      document: insuranceDocument
    })

  } catch (error) {
    console.error('Error uploading insurance document:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await verifyTokenFromRequest(request)
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is a patient or admin
    if (user.role !== 'PATIENT' && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Determine patient ID
    let patientId: string | null = null
    
    if (user.role === 'PATIENT' && user.patient) {
      patientId = user.patient.id
    } else if (user.role === 'ADMIN') {
      // For admin, get patientId from query params
      const url = new URL(request.url)
      patientId = url.searchParams.get('patientId')
      if (!patientId) {
        return NextResponse.json({ error: 'Patient ID is required for admin requests' }, { status: 400 })
      }
    }

    if (!patientId) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 400 })
    }

    // Get insurance documents for the patient
    const documents = await prisma.insuranceDocument.findMany({
      where: { patientId },
      orderBy: { uploadedAt: 'desc' }
    })

    return NextResponse.json({
      success: true,
      documents
    })

  } catch (error) {
    console.error('Error fetching insurance documents:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}