import { Request, Response, NextFunction } from 'express';
import Notification from '../models/Notification';

// @desc    Get notifications
// @route   GET /api/notifications
export const getNotifications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);

    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find({ user: req.user!._id })
        .sort('-createdAt')
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Notification.countDocuments({ user: req.user!._id }),
      Notification.countDocuments({ user: req.user!._id, isRead: false }),
    ]);

    res.json({
      success: true,
      data: notifications,
      unreadCount,
      pagination: { page: pageNum, limit: limitNum, total },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark notification as read
// @route   PATCH /api/notifications/:id/read
export const markRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user!._id },
      { isRead: true },
      { new: true }
    );
    res.json({ success: true, data: notification });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark all as read
// @route   PATCH /api/notifications/read-all
export const markAllRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await Notification.updateMany(
      { user: req.user!._id, isRead: false },
      { isRead: true }
    );
    res.json({ success: true, message: 'All notifications marked as read.' });
  } catch (error) {
    next(error);
  }
};
