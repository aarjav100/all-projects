import { Request, Response, NextFunction } from 'express';
import Booking from '../models/Booking';
import Listing from '../models/Listing';
import Notification from '../models/Notification';
import { AppError } from '../middleware/errorHandler';

// @desc    Create booking
// @route   POST /api/bookings
export const createBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { listing: listingId, checkIn, checkOut, guests, specialRequests } = req.body;

    const listing = await Listing.findById(listingId);
    if (!listing) return next(new AppError('Listing not found.', 404));
    if (!listing.isActive) return next(new AppError('Listing is not available.', 400));

    // Check guest count
    const totalGuests = guests.adults + (guests.children || 0);
    if (totalGuests > listing.maxGuests) {
      return next(new AppError(`Maximum ${listing.maxGuests} guests allowed.`, 400));
    }

    // Check for overlapping bookings
    const overlap = await Booking.findOne({
      listing: listingId,
      status: { $in: ['pending', 'confirmed'] },
      $or: [
        { checkIn: { $lt: new Date(checkOut), $gte: new Date(checkIn) } },
        { checkOut: { $gt: new Date(checkIn), $lte: new Date(checkOut) } },
        { checkIn: { $lte: new Date(checkIn) }, checkOut: { $gte: new Date(checkOut) } },
      ],
    });
    if (overlap) {
      return next(new AppError('Dates not available. The listing is already booked.', 400));
    }

    // Calculate price
    const nights = Math.ceil(
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)
    );
    const subtotal = listing.pricePerNight * nights;
    const cleaningFee = listing.cleaningFee || 0;
    const serviceFee = Math.round(subtotal * 0.12);
    const taxes = Math.round(subtotal * 0.08);
    const total = subtotal + cleaningFee + serviceFee + taxes;

    const booking = await Booking.create({
      guest: req.user!._id,
      listing: listingId,
      host: listing.host,
      checkIn,
      checkOut,
      guests,
      totalPrice: total,
      priceBreakdown: {
        nightlyRate: listing.pricePerNight,
        nights,
        subtotal,
        cleaningFee,
        serviceFee,
        taxes,
        total,
      },
      specialRequests,
    });

    // Create notification for host
    await Notification.create({
      user: listing.host,
      type: 'booking_request',
      title: 'New Booking Request',
      body: `${req.user!.name} wants to book ${listing.title}`,
      data: { bookingId: booking._id, listingId },
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('listing', 'title images location pricePerNight')
      .populate('host', 'name avatar')
      .populate('guest', 'name avatar');

    res.status(201).json({ success: true, data: populatedBooking });
  } catch (error) {
    next(error);
  }
};

// @desc    Get guest bookings
// @route   GET /api/bookings/guest/me
export const getGuestBookings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = req.query;
    const query: any = { guest: req.user!._id };
    if (status) query.status = status;

    const bookings = await Booking.find(query)
      .populate('listing', 'title images location pricePerNight')
      .populate('host', 'name avatar')
      .sort('-createdAt');

    res.json({ success: true, data: bookings });
  } catch (error) {
    next(error);
  }
};

// @desc    Get host bookings
// @route   GET /api/bookings/host/me
export const getHostBookings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = req.query;
    const query: any = { host: req.user!._id };
    if (status) query.status = status;

    const bookings = await Booking.find(query)
      .populate('listing', 'title images location')
      .populate('guest', 'name avatar email')
      .sort('-createdAt');

    res.json({ success: true, data: bookings });
  } catch (error) {
    next(error);
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
export const getBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('listing')
      .populate('host', 'name avatar email phone')
      .populate('guest', 'name avatar email phone');

    if (!booking) return next(new AppError('Booking not found.', 404));

    // Check authorization
    const userId = req.user!._id.toString();
    if (
      booking.guest._id.toString() !== userId &&
      booking.host._id.toString() !== userId &&
      req.user!.role !== 'admin'
    ) {
      return next(new AppError('Not authorized.', 403));
    }

    res.json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel booking
// @route   PATCH /api/bookings/:id/cancel
export const cancelBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return next(new AppError('Booking not found.', 404));

    if (!['pending', 'confirmed'].includes(booking.status)) {
      return next(new AppError('Cannot cancel this booking.', 400));
    }

    const userId = req.user!._id.toString();
    if (booking.guest.toString() !== userId && booking.host.toString() !== userId) {
      return next(new AppError('Not authorized.', 403));
    }

    booking.status = 'cancelled';
    booking.cancelledBy = req.user!._id;
    booking.cancelledAt = new Date();
    booking.cancellationReason = req.body.reason || 'No reason provided';
    await booking.save();

    // Notify the other party
    const notifyUserId = booking.guest.toString() === userId ? booking.host : booking.guest;
    await Notification.create({
      user: notifyUserId,
      type: 'booking_cancelled',
      title: 'Booking Cancelled',
      body: `A booking has been cancelled by ${req.user!.name}`,
      data: { bookingId: booking._id },
    });

    res.json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
};

// @desc    Confirm booking (host)
// @route   PATCH /api/bookings/:id/confirm
export const confirmBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return next(new AppError('Booking not found.', 404));

    if (booking.host.toString() !== req.user!._id.toString()) {
      return next(new AppError('Only the host can confirm bookings.', 403));
    }

    if (booking.status !== 'pending') {
      return next(new AppError('Only pending bookings can be confirmed.', 400));
    }

    booking.status = 'confirmed';
    await booking.save();

    await Notification.create({
      user: booking.guest,
      type: 'booking_confirmed',
      title: 'Booking Confirmed!',
      body: 'Your booking has been confirmed by the host.',
      data: { bookingId: booking._id },
    });

    res.json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
};
