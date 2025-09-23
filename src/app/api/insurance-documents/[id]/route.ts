import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyTokenFromRequest } from '@/lib/auth'
import { unlink } from 'fs/promises'
import { join } from 'path'

// Make this route dynamic to prevent static generation issues
export const dynamic = 'force-dynamic'

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await verifyTokenFromRequest(request)
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is a patient or admin
    if (user.role !== 'PATIENT' && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const documentId = params.id
    if (!documentId) {
      return NextResponse.json({ error: 'Document ID is required' }, { status: 400 })
    }

    // Find the document
    const document = await prisma.insuranceDocument.findUnique({
      where: { id: documentId }
    })

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    // Check permissions
    if (user.role === 'PATIENT' && user.patient?.id !== document.patientId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Delete file from filesystem
    try {
      const filepath = join(process.cwd(), 'public', document.url)
      await unlink(filepath)
    } catch (fileError) {
      console.warn('Failed to delete file from filesystem:', fileError)
      // Continue with database deletion even if file deletion fails
    }

    // Delete document from database
    await prisma.insuranceDocument.delete({
      where: { id: documentId }
    })

    return NextResponse.json({
      success: true,
      message: 'Insurance document deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting insurance document:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}