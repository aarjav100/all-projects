import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import Message from '../models/Message';
import Conversation from '../models/Conversation';

interface AuthSocket extends Socket {
  userId?: string;
}

const onlineUsers = new Map<string, string>();

export const initSocket = (httpServer: HttpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  // JWT Authentication middleware
  io.use((socket: AuthSocket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication required'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { id: string };
      socket.userId = decoded.id;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket: AuthSocket) => {
    const userId = socket.userId!;
    console.log(`🔌 User connected: ${userId}`);

    // Track online status
    onlineUsers.set(userId, socket.id);
    io.emit('user:online', { userId });

    // Join user's conversation rooms
    socket.on('conversation:join', (conversationId: string) => {
      socket.join(`conversation:${conversationId}`);
    });

    socket.on('conversation:leave', (conversationId: string) => {
      socket.leave(`conversation:${conversationId}`);
    });

    // Handle new message
    socket.on('message:send', async (data: {
      conversationId: string;
      content: string;
      type?: string;
    }) => {
      try {
        const message = await Message.create({
          conversation: data.conversationId,
          sender: userId,
          content: data.content,
          type: data.type || 'text',
          readBy: [userId],
        });

        // Update conversation
        const conversation = await Conversation.findById(data.conversationId);
        if (conversation) {
          conversation.lastMessage = data.content;
          conversation.lastMessageAt = new Date();
          
          const unreadCount = conversation.unreadCount || new Map();
          conversation.participants.forEach((p) => {
            if (p.toString() !== userId) {
              const current = unreadCount.get(p.toString()) || 0;
              unreadCount.set(p.toString(), current + 1);
            }
          });
          conversation.unreadCount = unreadCount;
          await conversation.save();
        }

        const populatedMessage = await Message.findById(message._id)
          .populate('sender', 'name avatar');

        // Emit to conversation room
        io.to(`conversation:${data.conversationId}`).emit('message:received', populatedMessage);

        // Emit notification to offline participants
        if (conversation) {
          conversation.participants.forEach((p) => {
            const participantId = p.toString();
            if (participantId !== userId) {
              const participantSocketId = onlineUsers.get(participantId);
              if (participantSocketId) {
                io.to(participantSocketId).emit('notification:new', {
                  type: 'new_message',
                  conversationId: data.conversationId,
                  message: populatedMessage,
                });
              }
            }
          });
        }
      } catch (error) {
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Typing indicators
    socket.on('typing:start', (conversationId: string) => {
      socket.to(`conversation:${conversationId}`).emit('typing:start', { userId });
    });

    socket.on('typing:stop', (conversationId: string) => {
      socket.to(`conversation:${conversationId}`).emit('typing:stop', { userId });
    });

    // Mark messages as read
    socket.on('message:read', async (conversationId: string) => {
      try {
        await Message.updateMany(
          {
            conversation: conversationId,
            sender: { $ne: userId },
            readBy: { $ne: userId },
          },
          { $addToSet: { readBy: userId } }
        );

        const conversation = await Conversation.findById(conversationId);
        if (conversation) {
          const unreadCount = conversation.unreadCount || new Map();
          unreadCount.set(userId, 0);
          conversation.unreadCount = unreadCount;
          await conversation.save();
        }

        socket.to(`conversation:${conversationId}`).emit('message:read', { userId });
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`🔌 User disconnected: ${userId}`);
      onlineUsers.delete(userId);
      io.emit('user:offline', { userId });
    });
  });

  return io;
};
