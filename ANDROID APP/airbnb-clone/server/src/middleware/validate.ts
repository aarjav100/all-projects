import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { AppError } from './errorHandler';

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const messages = error.details.map((d) => d.message).join('. ');
      return next(new AppError(messages, 400));
    }

    next();
  };
};

// Auth validation schemas
export const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(128).required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().length(6).required(),
  newPassword: Joi.string().min(6).max(128).required(),
});

// Listing validation
export const createListingSchema = Joi.object({
  title: Joi.string().trim().max(100).required(),
  description: Joi.string().max(2000).required(),
  type: Joi.string().valid('house', 'apartment', 'cabin', 'villa', 'cottage', 'castle', 'treehouse', 'boat', 'tent', 'other').required(),
  privacyType: Joi.string().valid('entire', 'private', 'shared').required(),
  category: Joi.string().optional(),
  location: Joi.object({
    address: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().optional(),
    country: Joi.string().required(),
    zipCode: Joi.string().optional(),
    coordinates: Joi.object({
      lat: Joi.number().min(-90).max(90).required(),
      lng: Joi.number().min(-180).max(180).required(),
    }).required(),
  }).required(),
  images: Joi.array().items(Joi.string()).min(1).required(),
  amenities: Joi.array().items(Joi.string()).optional(),
  bedrooms: Joi.number().min(0).required(),
  beds: Joi.number().min(1).required(),
  bathrooms: Joi.number().min(0).required(),
  maxGuests: Joi.number().min(1).required(),
  pricePerNight: Joi.number().min(1).required(),
  cleaningFee: Joi.number().min(0).optional(),
  rules: Joi.array().items(Joi.string()).optional(),
  cancellationPolicy: Joi.string().valid('flexible', 'moderate', 'strict').optional(),
});

// Booking validation
export const createBookingSchema = Joi.object({
  listing: Joi.string().required(),
  checkIn: Joi.date().iso().required(),
  checkOut: Joi.date().iso().greater(Joi.ref('checkIn')).required(),
  guests: Joi.object({
    adults: Joi.number().min(1).required(),
    children: Joi.number().min(0).optional(),
    infants: Joi.number().min(0).optional(),
    pets: Joi.number().min(0).optional(),
  }).required(),
  specialRequests: Joi.string().max(500).optional(),
});

// Review validation
export const createReviewSchema = Joi.object({
  booking: Joi.string().required(),
  ratings: Joi.object({
    cleanliness: Joi.number().min(1).max(5).required(),
    accuracy: Joi.number().min(1).max(5).required(),
    communication: Joi.number().min(1).max(5).required(),
    location: Joi.number().min(1).max(5).required(),
    checkin: Joi.number().min(1).max(5).required(),
    value: Joi.number().min(1).max(5).required(),
  }).required(),
  comment: Joi.string().max(1000).required(),
});
