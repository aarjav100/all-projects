import express from 'express';
import { body, validationResult } from 'express-validator';
import { supabase } from '../config/supabase.js';
import { protect, admin, teacher } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get user's messages
// @route   GET /api/messages
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { data: messages, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:profiles!messages_sender_id_fkey(*),
        recipient:profiles!messages_recipient_id_fkey(*)
      `)
      .or(`sender_id.eq.${req.user.id},recipient_id.eq.${req.user.id}`)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({
        success: false,
        error: 'Error fetching messages',
      });
    }

    res.json({
      success: true,
      data: messages,
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error fetching messages',
    });
  }
});

// @desc    Get conversation with specific user
// @route   GET /api/messages/conversation/:userId
// @access  Private
router.get('/conversation/:userId', protect, async (req, res) => {
  try {
    const { data: messages, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:profiles!messages_sender_id_fkey(*),
        recipient:profiles!messages_recipient_id_fkey(*)
      `)
      .or(`and(sender_id.eq.${req.user.id},recipient_id.eq.${req.params.userId}),and(sender_id.eq.${req.params.userId},recipient_id.eq.${req.user.id})`)
      .order('created_at', { ascending: true });

    if (error) {
      return res.status(500).json({
        success: false,
        error: 'Error fetching conversation',
      });
    }

    res.json({
      success: true,
      data: messages,
    });
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error fetching conversation',
    });
  }
});

// @desc    Send message
// @route   POST /api/messages
// @access  Private
router.post('/', [
  protect,
  body('recipient_id').isUUID(),
  body('subject').trim().notEmpty(),
  body('content').trim().notEmpty(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: errors.array(),
      });
    }

    const { data: message, error } = await supabase
      .from('messages')
      .insert([{
        sender_id: req.user.id,
        recipient_id: req.body.recipient_id,
        subject: req.body.subject,
        content: req.body.content,
        status: 'unread',
      }])
      .select(`
        *,
        sender:profiles!messages_sender_id_fkey(*),
        recipient:profiles!messages_recipient_id_fkey(*)
      `)
      .single();

    if (error) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: message,
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error sending message',
    });
  }
});

// @desc    Mark message as read
// @route   PATCH /api/messages/:id/read
// @access  Private
router.patch('/:id/read', protect, async (req, res) => {
  try {
    const { data: message, error } = await supabase
      .from('messages')
      .update({ status: 'read' })
      .eq('id', req.params.id)
      .eq('recipient_id', req.user.id)
      .select()
      .single();

    if (error || !message) {
      return res.status(404).json({
        success: false,
        error: 'Message not found',
      });
    }

    res.json({
      success: true,
      message: 'Message marked as read',
      data: message,
    });
  } catch (error) {
    console.error('Mark message read error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error marking message as read',
    });
  }
});

// @desc    Delete message
// @route   DELETE /api/messages/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', req.params.id)
      .or(`sender_id.eq.${req.user.id},recipient_id.eq.${req.user.id}`);

    if (error) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }

    res.json({
      success: true,
      message: 'Message deleted successfully',
    });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error deleting message',
    });
  }
});

// @desc    Get unread message count
// @route   GET /api/messages/unread-count
// @access  Private
router.get('/unread-count', protect, async (req, res) => {
  try {
    const { count, error } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('recipient_id', req.user.id)
      .eq('status', 'unread');

    if (error) {
      return res.status(500).json({
        success: false,
        error: 'Error fetching unread count',
      });
    }

    res.json({
      success: true,
      data: { unreadCount: count || 0 },
    });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error fetching unread count',
    });
  }
});

export default router; 