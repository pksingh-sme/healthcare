import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyTokenFromRequest } from '@/lib/auth'
import { BillingStatus } from '@prisma/client'

// Make this route dynamic to prevent static generation issues
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const user = await verifyTokenFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const patientId = searchParams.get('patientId')

    let whereClause: any = {}

    if (user.role === 'PATIENT') {
      // Patients can only see their own billing records
      whereClause.patientId = user.patient?.id
    } else if (patientId && (user.role === 'ADMIN' || user.role === 'PROVIDER')) {
      // Providers/Admins can see specific patient's records
      whereClause.patientId = patientId
    }
    // Admins can see all records if no patientId specified

    const billingRecords = await prisma.billing.findMany({
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
        appointment: {
          select: {
            title: true,
            startTime: true,
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
        },
      },
      orderBy: {
        serviceDate: 'desc',
      },
    })

    return NextResponse.json({
      success: true,
      data: billingRecords,
    })
  } catch (error) {
    console.error('Error fetching billing records:', error)
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

    // Only providers and admins can create billing records
    if (user.role === 'PATIENT') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const {
      patientId,
      appointmentId,
      serviceDescription,
      serviceDate,
      subtotal,
      tax = 0,
      icdCodes = [],
      cptCodes = [],
      // Add initial payment information
      initialPaymentAmount = 0,
      initialPaymentMethod,
    } = body

    // Validate required fields
    if (!patientId || !serviceDescription || subtotal === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Generate unique invoice number
    const invoiceNumber = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    const total = subtotal + tax
    const paidAmount = initialPaymentAmount || 0

    // AI Stub: Auto-suggest ICD-10/CPT codes based on service description
    const suggestedCodes = {
      icd: serviceDescription.toLowerCase().includes('flu') ? ['J09.X2'] : [],
      cpt: serviceDescription.toLowerCase().includes('consultation') ? ['99213'] : [],
    }

    // Determine initial status based on payment
    let initialStatus: typeof BillingStatus[keyof typeof BillingStatus] = BillingStatus.PENDING
    if (paidAmount >= total - 0.01) {
      initialStatus = BillingStatus.PAID
    } else if (paidAmount > 0) {
      initialStatus = BillingStatus.PARTIAL
    }

    const billing = await prisma.billing.create({
      data: {
        patientId,
        appointmentId: appointmentId || undefined,
        invoiceNumber,
        serviceDate: serviceDate ? new Date(serviceDate) : new Date(),
        serviceDescription,
        icdCodes: JSON.stringify([...icdCodes, ...suggestedCodes.icd]),
        cptCodes: JSON.stringify([...cptCodes, ...suggestedCodes.cpt]),
        subtotal,
        tax,
        total,
        status: initialStatus,
        insuranceBilled: 0,
        patientResponsibility: total,
        paidAmount,
        ...(initialPaymentMethod && { paymentMethod: initialPaymentMethod }),
        ...(paidAmount > 0 && { paymentDate: new Date() }),
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
        appointment: {
          select: {
            title: true,
            startTime: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: billing,
      message: 'Billing record created successfully',
    })
  } catch (error) {
    console.error('Error creating billing record:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await verifyTokenFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { billingId, paymentMethod, paidAmount } = body

    if (!billingId) {
      return NextResponse.json(
        { error: 'Billing ID is required' },
        { status: 400 }
      )
    }

    // Get the billing record
    const billing = await prisma.billing.findUnique({
      where: { id: billingId },
    })

    if (!billing) {
      return NextResponse.json({ error: 'Billing record not found' }, { status: 404 })
    }

    // Check permissions
    if (user.role === 'PATIENT' && billing.patientId !== user.patient?.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Calculate new paid amount and determine new status
    const newPaidAmount = billing.paidAmount + (paidAmount || 0);
    let newStatus = billing.status;

    // Update status based on payment completion
    if (newPaidAmount >= billing.total - 0.01) { // Allow for rounding differences
      newStatus = BillingStatus.PAID;
    } else if (newPaidAmount > 0) {
      newStatus = BillingStatus.PARTIAL;
    } else if (newPaidAmount === 0) {
      newStatus = BillingStatus.PENDING;
    }

    // Additional validation to ensure status consistency
    // This will correct any inconsistencies in the database
    if (newPaidAmount >= billing.total - 0.01) {
      newStatus = BillingStatus.PAID;
    } else if (newPaidAmount > 0) {
      newStatus = BillingStatus.PARTIAL;
    } else {
      newStatus = BillingStatus.PENDING;
    }

    const updatedBilling = await prisma.billing.update({
      where: { id: billingId },
      data: {
        ...(paymentMethod && { paymentMethod }),
        ...(paidAmount !== undefined && {
          paidAmount: newPaidAmount,
          paymentDate: new Date(),
        }),
        status: newStatus,
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
      },
    })

    return NextResponse.json({
      success: true,
      data: updatedBilling,
      message: 'Payment processed successfully',
    })
  } catch (error) {
    console.error('Error processing payment:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}