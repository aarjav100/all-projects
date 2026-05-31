import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import Listing from '../models/Listing';
import Booking from '../models/Booking';

// @desc    Get all users (admin)
// @route   GET /api/admin/users
export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const query: any = {};
    if (search) query.name = new RegExp(search as string, 'i');

    const [users, total] = await Promise.all([
      User.find(query).sort('-createdAt').skip((pageNum - 1) * limitNum).limit(limitNum),
      User.countDocuments(query),
    ]);

    res.json({ success: true, data: users, pagination: { page: pageNum, limit: limitNum, total } });
  } catch (error) {
    next(error);
  }
};

// @desc    Ban/unban user
// @route   PATCH /api/admin/users/:id/ban
export const toggleBanUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });

    user.isVerified = !user.isVerified;
    await user.save({ validateBeforeSave: false });

    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all listings (admin)
// @route   GET /api/admin/listings
export const getAdminListings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);

    const [listings, total] = await Promise.all([
      Listing.find().populate('host', 'name email').sort('-createdAt')
        .skip((pageNum - 1) * limitNum).limit(limitNum),
      Listing.countDocuments(),
    ]);

    res.json({ success: true, data: listings, pagination: { page: pageNum, limit: limitNum, total } });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve/deactivate listing
// @route   PATCH /api/admin/listings/:id/approve
export const toggleListingApproval = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ success: false, error: 'Listing not found' });

    listing.isActive = !listing.isActive;
    await listing.save();

    res.json({ success: true, data: listing });
  } catch (error) {
    next(error);
  }
};

// @desc    Get admin stats
// @route   GET /api/admin/stats
export const getAdminStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const [totalUsers, totalListings, totalBookings, revenue] = await Promise.all([
      User.countDocuments(),
      Listing.countDocuments(),
      Booking.countDocuments(),
      Booking.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } },
      ]),
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalListings,
        totalBookings,
        totalRevenue: revenue[0]?.total || 0,
      },
    });
  } catch (error) {
    next(error);
  }
};
