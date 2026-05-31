import { Request, Response, NextFunction } from 'express';
import Conversation from '../models/Conversation';
import Message from '../models/Message';
import { AppError } from '../middleware/errorHandler';

// @desc    Get conversations
// @route   GET /api/conversations
export const getConversations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user!._id,
    })
      .populate('participants', 'name avatar')
      .populate('listing', 'title images')
      .sort('-updatedAt');

    res.json({ success: true, data: conversations });
  } catch (error) {
    next(error);
  }
};

// @desc    Create or get conversation
// @route   POST /api/conversations
export const createConversation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { participantId, listingId } = req.body;
    const userId = req.user!._id;

    // Check if conversation exists
    let conversation = await Conversation.findOne({
      participants: { $all: [userId, participantId] },
      ...(listingId && { listing: listingId }),
    })
      .populate('participants', 'name avatar')
      .populate('listing', 'title images');

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [userId, participantId],
        listing: listingId,
      });
      conversation = await conversation.populate('participants', 'name avatar');
      if (listingId) {
        conversation = await conversation.populate('listing', 'title images');
      }
    }

    res.status(201).json({ success: true, data: conversation });
  } catch (error) {
    next(error);
  }
};

// @desc    Get messages for conversation
// @route   GET /api/conversations/:id/messages
export const getMessages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) return next(new AppError('Conversation not found.', 404));

    const isParticipant = conversation.participants.some(
      (p) => p.toString() === req.user!._id.toString()
    );
    if (!isParticipant) return next(new AppError('Not authorized.', 403));

    const { page = 1, limit = 50 } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);

    const messages = await Message.find({ conversation: req.params.id })
      .populate('sender', 'name avatar')
      .sort('-createdAt')
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    // Mark messages as read
    await Message.updateMany(
      {
        conversation: req.params.id,
        sender: { $ne: req.user!._id },
        readBy: { $ne: req.user!._id },
      },
      { $addToSet: { readBy: req.user!._id } }
    );

    // Reset unread count
    const unreadCount = conversation.unreadCount || new Map();
    unreadCount.set(req.user!._id.toString(), 0);
    conversation.unreadCount = unreadCount;
    await conversation.save();

    res.json({ success: true, data: messages.reverse() });
  } catch (error) {
    next(error);
  }
};

// @desc    Send message
// @route   POST /api/conversations/:id/messages
export const sendMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) return next(new AppError('Conversation not found.', 404));

    const isParticipant = conversation.participants.some(
      (p) => p.toString() === req.user!._id.toString()
    );
    if (!isParticipant) return next(new AppError('Not authorized.', 403));

    const message = await Message.create({
      conversation: req.params.id,
      sender: req.user!._id,
      content: req.body.content,
      type: req.body.type || 'text',
      readBy: [req.user!._id],
    });

    // Update conversation
    conversation.lastMessage = req.body.content;
    conversation.lastMessageAt = new Date();

    // Increment unread count for other participants
    const unreadCount = conversation.unreadCount || new Map();
    conversation.participants.forEach((p) => {
      if (p.toString() !== req.user!._id.toString()) {
        const current = unreadCount.get(p.toString()) || 0;
        unreadCount.set(p.toString(), current + 1);
      }
    });
    conversation.unreadCount = unreadCount;
    await conversation.save();

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name avatar');

    res.status(201).json({ success: true, data: populatedMessage });
  } catch (error) {
    next(error);
  }
};
