import { Request, Response, NextFunction } from 'express';
import Review from '../models/Review';
import Booking from '../models/Booking';
import { AppError } from '../middleware/errorHandler';

// @desc    Create review
// @route   POST /api/reviews
export const createReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { booking: bookingId, ratings, comment } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) return next(new AppError('Booking not found.', 404));

    if (booking.guest.toString() !== req.user!._id.toString()) {
      return next(new AppError('Only the guest can review.', 403));
    }

    if (booking.status !== 'completed') {
      return next(new AppError('Can only review completed bookings.', 400));
    }

    if (booking.isReviewed) {
      return next(new AppError('Already reviewed.', 400));
    }

    const review = await Review.create({
      booking: bookingId,
      reviewer: req.user!._id,
      listing: booking.listing,
      host: booking.host,
      ratings,
      comment,
    });

    booking.isReviewed = true;
    await booking.save();

    const populatedReview = await Review.findById(review._id)
      .populate('reviewer', 'name avatar');

    res.status(201).json({ success: true, data: populatedReview });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for listing
// @route   GET /api/reviews/listing/:listingId
export const getListingReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);

    const [reviews, total] = await Promise.all([
      Review.find({ listing: req.params.listingId })
        .populate('reviewer', 'name avatar')
        .sort('-createdAt')
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Review.countDocuments({ listing: req.params.listingId }),
    ]);

    // Calculate rating breakdown
    const ratingStats = await Review.aggregate([
      { $match: { listing: require('mongoose').Types.ObjectId.createFromHexString(req.params.listingId) } },
      {
        $group: {
          _id: null,
          avgCleanliness: { $avg: '$ratings.cleanliness' },
          avgAccuracy: { $avg: '$ratings.accuracy' },
          avgCommunication: { $avg: '$ratings.communication' },
          avgLocation: { $avg: '$ratings.location' },
          avgCheckin: { $avg: '$ratings.checkin' },
          avgValue: { $avg: '$ratings.value' },
          avgOverall: { $avg: '$overallRating' },
        },
      },
    ]);

    res.json({
      success: true,
      data: reviews,
      stats: ratingStats[0] || null,
      pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Host reply to review
// @route   PATCH /api/reviews/:id/reply
export const replyToReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return next(new AppError('Review not found.', 404));

    if (review.host.toString() !== req.user!._id.toString()) {
      return next(new AppError('Only the host can reply.', 403));
    }

    review.hostReply = req.body.reply;
    review.hostRepliedAt = new Date();
    await review.save();

    res.json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
export const deleteReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return next(new AppError('Review not found.', 404));

    if (review.reviewer.toString() !== req.user!._id.toString() && req.user!.role !== 'admin') {
      return next(new AppError('Not authorized.', 403));
    }

    await review.deleteOne();
    res.json({ success: true, message: 'Review deleted.' });
  } catch (error) {
    next(error);
  }
};
