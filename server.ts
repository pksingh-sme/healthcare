import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { Server } from 'socket.io';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3001;

// Initialize Next.js app
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// Initialize Prisma Client
const prisma = new PrismaClient();

// JWT secret (should be the same as in your auth library)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Verify token function (simplified version of what's in your auth library)
const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch (error) {
    return null;
  }
};

app.prepare().then(() => {
  // Create HTTP server
  const server = createServer(async (req, res) => {
    try {
      // Be sure to pass `true` as the second argument to `url.parse`.
      // This tells it to parse the query portion of the URL.
      const parsedUrl = parse(req.url || '', true);
      const { pathname } = parsedUrl;

      // Handle socket.io requests
      if (pathname === '/api/socket') {
        // This will be handled by socket.io
        return;
      }

      // Handle all other requests with Next.js
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  // Initialize socket.io
  const io = new Server(server, {
    path: '/api/socket',
    addTrailingSlash: false,
    cors: {
      origin: process.env.NODE_ENV === 'production' 
        ? process.env.NEXTAUTH_URL 
        : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003'],
      methods: ['GET', 'POST'],
    },
  });

  // Authentication middleware
  io.use(async (socket: any, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const payload: any = verifyToken(token);
      if (!payload) {
        return next(new Error('Invalid token'));
      }

      // Get user info from database
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          role: true,
        },
      });

      if (!user) {
        return next(new Error('User not found'));
      }

      socket.userId = user.id;
      socket.userRole = user.role;
      socket.userName = `${user.firstName} ${user.lastName}`;
      
      next();
    } catch (error) {
      console.error('Socket authentication error:', error);
      next(new Error('Authentication error'));
    }
  });

  // Handle socket connections
  io.on('connection', (socket: any) => {
    console.log('User connected:', socket.userId);

    // Join user to their personal room
    socket.join(`user_${socket.userId}`);
    
    // Join user to role-based rooms
    if (socket.userRole === 'PROVIDER' || socket.userRole === 'ADMIN') {
      socket.join('staff');
    }
    if (socket.userRole === 'PATIENT') {
      socket.join('patients');
    }

    // Broadcast user online status to all connected clients (including self)
    const userOnlineData = {
      id: socket.userId,
      name: socket.userName,
    };
    
    // Emit to all clients including sender
    io.emit('userOnline', userOnlineData);

    // Handle joining specific rooms (e.g., appointment rooms)
    socket.on('join', (room: string) => {
      socket.join(room);
    });

    socket.on('leave', (room: string) => {
      socket.leave(room);
    });

    // Handle sending messages
    socket.on('sendMessage', async (data: { content: string; receiverId: string }) => {
      try {
        // Get receiver info to determine if they are a patient
        const receiver = await prisma.user.findUnique({
          where: { id: data.receiverId },
          include: {
            patient: true,
            provider: true,
          },
        });

        if (!receiver) {
          console.error(`Receiver not found: ${data.receiverId}`);
          socket.emit('error', { message: 'Receiver not found' });
          return;
        }

        // Get sender info
        const sender = await prisma.user.findUnique({
          where: { id: socket.userId },
          include: {
            patient: true,
            provider: true,
          },
        });

        // Determine the patient ID for the message
        let patientId = null;
        if (sender?.role === 'PATIENT') {
          patientId = sender.patient?.id;
        } else if (receiver.role === 'PATIENT') {
          patientId = receiver.patient?.id;
        }

        // Save message to database
        const message = await prisma.message.create({
          data: {
            senderId: socket.userId,
            receiverId: data.receiverId,
            patientId: patientId,
            content: data.content,
            isRead: false,
          },
          include: {
            sender: {
              select: {
                firstName: true,
                lastName: true,
                role: true,
              },
            },
          },
        });

        const messagePayload = {
          id: message.id,
          content: message.content,
          senderId: message.senderId,
          senderName: `${message.sender.firstName} ${message.sender.lastName}`,
          receiverId: data.receiverId,
          timestamp: message.createdAt.toISOString(),
          isRead: message.isRead,
        };

        // Emit to receiver's room with confirmation
        const receiverRoom = `user_${data.receiverId}`;
        
        io.to(receiverRoom).emit('newMessage', messagePayload);

        // Also emit back to sender for confirmation
        socket.emit('newMessage', {
          ...messagePayload,
          senderName: 'You',
        });

      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle marking messages as read
    socket.on('markMessageRead', async (messageId: string) => {
      try {
        await prisma.message.update({
          where: { id: messageId },
          data: { isRead: true },
        });
      } catch (error) {
        console.error('Error marking message as read:', error);
      }
    });

    // Handle typing indicators
    socket.on('typing', (data: { receiverId: string; isTyping: boolean }) => {
      socket.to(`user_${data.receiverId}`).emit('typing', {
        userId: socket.userId,
        userName: socket.userName,
        isTyping: data.isTyping,
      });
    });

    // Handle disconnection
    socket.on('disconnect', (reason: string) => {
      console.log('User disconnected:', socket.userId, reason);
      
      const userOfflineData = {
        id: socket.userId,
        name: socket.userName,
      };
      
      // Broadcast to all clients that user went offline
      io.emit('userOffline', userOfflineData);
    });
  });

  // Start server
  server.listen(port, hostname, (err?: any) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});