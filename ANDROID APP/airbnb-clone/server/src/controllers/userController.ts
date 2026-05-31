import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import { AppError } from '../middleware/errorHandler';
import { uploadToCloudinary } from '../middleware/upload';

// @desc    Get current user
// @route   GET /api/users/me
export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user!._id);
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// @desc    Update current user
// @route   PATCH /api/users/me
export const updateMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const allowedFields = ['name', 'phone', 'bio', 'notificationPreferences'];
    const updates: any = {};
    
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const user = await User.findByIdAndUpdate(req.user!._id, updates, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload avatar
// @route   POST /api/users/me/avatar
export const uploadAvatar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return next(new AppError('Please upload an image.', 400));
    }

    const imageUrl = await uploadToCloudinary(req.file.buffer, 'airbnb-clone/avatars');

    const user = await User.findByIdAndUpdate(
      req.user!._id,
      { avatar: imageUrl },
      { new: true }
    );

    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// @desc    Get public profile
// @route   GET /api/users/:id
export const getPublicProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.params.id).select('name avatar bio role createdAt');
    if (!user) {
      return next(new AppError('User not found.', 404));
    }
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// @desc    Get wishlists
// @route   GET /api/users/me/wishlists
export const getWishlists = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user!._id).populate('wishlists.listings');
    res.json({ success: true, data: user?.wishlists || [] });
  } catch (error) {
    next(error);
  }
};

// @desc    Create wishlist
// @route   POST /api/users/me/wishlists
export const createWishlist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name } = req.body;
    const user = await User.findById(req.user!._id);
    if (!user) return next(new AppError('User not found.', 404));

    user.wishlists.push({ name, listings: [] });
    await user.save();

    res.status(201).json({ success: true, data: user.wishlists });
  } catch (error) {
    next(error);
  }
};

// @desc    Update wishlist
// @route   PATCH /api/users/me/wishlists/:id
export const updateWishlist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user!._id);
    if (!user) return next(new AppError('User not found.', 404));

    const wishlist = user.wishlists.id(req.params.id);
    if (!wishlist) return next(new AppError('Wishlist not found.', 404));

    if (req.body.name) wishlist.name = req.body.name;
    await user.save();

    res.json({ success: true, data: wishlist });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete wishlist
// @route   DELETE /api/users/me/wishlists/:id
export const deleteWishlist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user!._id);
    if (!user) return next(new AppError('User not found.', 404));

    const wishlistIndex = user.wishlists.findIndex(
      (w: any) => w._id.toString() === req.params.id
    );
    if (wishlistIndex === -1) return next(new AppError('Wishlist not found.', 404));

    user.wishlists.splice(wishlistIndex, 1);
    await user.save();

    res.json({ success: true, message: 'Wishlist deleted.' });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle listing in wishlist
// @route   POST /api/users/me/wishlists/:id/listings/:listingId
export const toggleWishlistListing = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user!._id);
    if (!user) return next(new AppError('User not found.', 404));

    const wishlist = user.wishlists.id(req.params.id);
    if (!wishlist) return next(new AppError('Wishlist not found.', 404));

    const listingId = req.params.listingId;
    const idx = wishlist.listings.findIndex((l: any) => l.toString() === listingId);

    if (idx > -1) {
      wishlist.listings.splice(idx, 1);
    } else {
      wishlist.listings.push(listingId as any);
    }

    await user.save();
    res.json({ success: true, data: wishlist });
  } catch (error) {
    next(error);
  }
};

// @desc    Switch to host
// @route   PATCH /api/users/me/become-host
export const becomeHost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user!._id,
      { role: 'host' },
      { new: true }
    );
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};
