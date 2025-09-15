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

    // Log PHI access for messaging
    await logPHIAccess(
      user.id,
      'READ',
      'Message',
      undefined,
      'View messages',
      request
    );

    const { searchParams } = new URL(request.url)
    const contactId = searchParams.get('contactId')

    let messages: any[] = []

    if (contactId) {
      // Get messages between current user and specific contact
      messages = await prisma.message.findMany({
        where: {
          OR: [
            {
              senderId: user.id,
              receiverId: contactId,
            },
            {
              senderId: contactId,
              receiverId: user.id,
            },
          ],
        },
        include: {
          sender: {
            select: {
              firstName: true,
              lastName: true,
              role: true,
            },
          },
          receiver: {
            select: {
              firstName: true,
              lastName: true,
              role: true,
            },
          },
        },
        orderBy: {
          createdAt: 'asc',
        },
      })
    } else {
      // Get all messages for the user
      messages = await prisma.message.findMany({
        where: {
          OR: [
            { senderId: user.id },
            { receiverId: user.id },
          ],
        },
        include: {
          sender: {
            select: {
              firstName: true,
              lastName: true,
              role: true,
            },
          },
          receiver: {
            select: {
              firstName: true,
              lastName: true,
              role: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
    }

    // Transform messages to include proper structure for frontend
    // Decrypt message content
    const transformedMessages = messages.map((msg) => ({
      id: msg.id,
      content: decryptPHI(msg.content),
      senderId: msg.senderId,
      receiverId: msg.receiverId,
      senderName: `${msg.sender.firstName} ${msg.sender.lastName}`,
      timestamp: msg.createdAt.toISOString(),
      isRead: msg.isRead,
    }))

    return NextResponse.json({
      success: true,
      data: transformedMessages,
    })
  } catch (error: any) {
    console.error('Error fetching messages:', error)
    console.error('Error details:', error.message)
    console.error('Error stack:', error.stack)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
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

    // Log PHI creation for messaging
    await logPHIAccess(
      user.id,
      'CREATE',
      'Message',
      undefined,
      'Send message',
      request
    );

    const body = await request.json()
    const { content, receiverId } = body

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: 'Message content is required' },
        { status: 400 }
      )
    }

    if (!receiverId) {
      return NextResponse.json(
        { error: 'Receiver ID is required' },
        { status: 400 }
      )
    }

    // Get full user info including patient/provider data
    const fullUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        patient: true,
        provider: true,
      },
    })

    // Get receiver info to determine patient association
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
      include: {
        patient: true,
        provider: true,
      },
    })

    if (!receiver) {
      return NextResponse.json(
        { error: 'Receiver not found' },
        { status: 404 }
      )
    }

    // Determine patient ID for medical record association
    let patientId = null
    if (fullUser?.role === 'PATIENT') {
      patientId = fullUser.patient?.id
    } else if (receiver.role === 'PATIENT') {
      patientId = receiver.patient?.id
    }

    const messageData = {
      content: encryptPHI(content.trim()),
      senderId: user.id,
      receiverId: receiverId,
      patientId: patientId,
      isRead: false,
    }

    const message = await prisma.message.create({
      data: messageData,
      include: {
        sender: {
          select: {
            firstName: true,
            lastName: true,
            role: true,
          },
        },
        receiver: {
          select: {
            firstName: true,
            lastName: true,
            role: true,
          },
        },
        patient: {
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

    // Decrypt content for response
    const decryptedMessage = {
      ...message,
      content: decryptPHI(message.content),
    };

    return NextResponse.json({
      success: true,
      data: decryptedMessage,
      message: 'Message sent successfully',
    })
  } catch (error: any) {
    console.error('Error sending message:', error)
    console.error('Error details:', error.message)
    console.error('Error stack:', error.stack)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
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

    // Log PHI update for messaging
    await logPHIAccess(
      user.id,
      'UPDATE',
      'Message',
      undefined,
      'Update message status',
      request
    );

    const body = await request.json()
    const { messageId, isRead } = body

    // Mark message as read
    const message = await prisma.message.update({
      where: { id: messageId },
      data: { isRead },
    })

    return NextResponse.json({
      success: true,
      data: message,
    })
  } catch (error) {
    console.error('Error updating message:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}