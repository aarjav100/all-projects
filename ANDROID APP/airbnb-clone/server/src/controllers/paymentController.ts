import { Request, Response, NextFunction } from 'express';
import stripe from '../config/stripe';
import Booking from '../models/Booking';
import { AppError } from '../middleware/errorHandler';

// @desc    Create payment intent
// @route   POST /api/payments/create-intent
export const createPaymentIntent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId);

    if (!booking) return next(new AppError('Booking not found.', 404));
    if (booking.guest.toString() !== req.user!._id.toString()) {
      return next(new AppError('Not authorized.', 403));
    }

    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.startsWith('sk_test_your')) {
      // Mock payment for development
      booking.paymentStatus = 'paid';
      booking.paymentIntentId = `mock_pi_${Date.now()}`;
      booking.status = 'confirmed';
      await booking.save();

      return res.json({
        success: true,
        data: {
          clientSecret: 'mock_client_secret',
          paymentIntentId: booking.paymentIntentId,
          mock: true,
        },
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(booking.totalPrice * 100),
      currency: 'usd',
      metadata: {
        bookingId: booking._id.toString(),
        guestId: req.user!._id.toString(),
      },
    });

    booking.paymentIntentId = paymentIntent.id;
    await booking.save();

    res.json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Confirm payment
// @route   POST /api/payments/confirm
export const confirmPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { paymentIntentId } = req.body;

    const booking = await Booking.findOne({ paymentIntentId });
    if (!booking) return next(new AppError('Booking not found.', 404));

    booking.paymentStatus = 'paid';
    booking.status = 'confirmed';
    await booking.save();

    res.json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
};

// @desc    Stripe webhook
// @route   POST /api/payments/webhook
export const stripeWebhook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sig = req.headers['stripe-signature'];

    if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
      return res.status(400).json({ error: 'Missing signature' });
    }

    const event = stripe.webhooks.constructEvent(
      req.body,
      sig as string,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as any;
        const booking = await Booking.findOne({ paymentIntentId: paymentIntent.id });
        if (booking) {
          booking.paymentStatus = 'paid';
          booking.status = 'confirmed';
          await booking.save();
        }
        break;
      }
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as any;
        const booking = await Booking.findOne({ paymentIntentId: paymentIntent.id });
        if (booking) {
          booking.paymentStatus = 'failed';
          await booking.save();
        }
        break;
      }
    }

    res.json({ received: true });
  } catch (error) {
    next(error);
  }
};

// @desc    Get payment history
// @route   GET /api/payments/history
export const getPaymentHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bookings = await Booking.find({
      $or: [{ guest: req.user!._id }, { host: req.user!._id }],
      paymentStatus: { $ne: 'pending' },
    })
      .populate('listing', 'title images')
      .sort('-createdAt');

    res.json({ success: true, data: bookings });
  } catch (error) {
    next(error);
  }
};
