import { Request, Response, NextFunction } from 'express';
import Listing from '../models/Listing';
import Booking from '../models/Booking';
import { AppError } from '../middleware/errorHandler';

// @desc    Get all listings (with search + filter + pagination)
// @route   GET /api/listings
export const getListings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      search, city, country, type, category, minPrice, maxPrice,
      bedrooms, beds, bathrooms, maxGuests, amenities,
      superhost, instantBook,
      page = 1, limit = 20, sort = '-createdAt',
      lat, lng, radius,
    } = req.query;

    const query: any = { isActive: true };

    // Text search
    if (search) {
      query.$text = { $search: search as string };
    }

    // Location filters
    if (city) query['location.city'] = new RegExp(city as string, 'i');
    if (country) query['location.country'] = new RegExp(country as string, 'i');

    // Geo search
    if (lat && lng && radius) {
      query['location.coordinates'] = {
        $geoWithin: {
          $centerSphere: [[parseFloat(lng as string), parseFloat(lat as string)], parseFloat(radius as string) / 6378.1],
        },
      };
    }

    // Property filters
    if (type) query.type = type;
    if (category) query.category = category;
    if (minPrice || maxPrice) {
      query.pricePerNight = {};
      if (minPrice) query.pricePerNight.$gte = parseFloat(minPrice as string);
      if (maxPrice) query.pricePerNight.$lte = parseFloat(maxPrice as string);
    }
    if (bedrooms) query.bedrooms = { $gte: parseInt(bedrooms as string) };
    if (beds) query.beds = { $gte: parseInt(beds as string) };
    if (bathrooms) query.bathrooms = { $gte: parseInt(bathrooms as string) };
    if (maxGuests) query.maxGuests = { $gte: parseInt(maxGuests as string) };
    if (superhost) query.isSuperhost = true;

    // Amenities filter
    if (amenities) {
      const amenityList = (amenities as string).split(',');
      query.amenities = { $all: amenityList };
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const [listings, total] = await Promise.all([
      Listing.find(query)
        .populate('host', 'name avatar')
        .sort(sort as string)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Listing.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: listings,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
        hasMore: skip + listings.length < total,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single listing
// @route   GET /api/listings/:id
export const getListing = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate('host', 'name avatar bio createdAt');

    if (!listing) {
      return next(new AppError('Listing not found.', 404));
    }

    res.json({ success: true, data: listing });
  } catch (error) {
    next(error);
  }
};

// @desc    Create listing
// @route   POST /api/listings
export const createListing = async (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body.host = req.user!._id;
    const listing = await Listing.create(req.body);

    // Update user role to host if not already
    if (req.user!.role === 'guest') {
      req.user!.role = 'host';
      await req.user!.save({ validateBeforeSave: false });
    }

    res.status(201).json({ success: true, data: listing });
  } catch (error) {
    next(error);
  }
};

// @desc    Update listing
// @route   PATCH /api/listings/:id
export const updateListing = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(new AppError('Listing not found.', 404));
    }

    if (listing.host.toString() !== req.user!._id.toString() && req.user!.role !== 'admin') {
      return next(new AppError('Not authorized to update this listing.', 403));
    }

    listing = await Listing.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, data: listing });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete listing
// @route   DELETE /api/listings/:id
export const deleteListing = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(new AppError('Listing not found.', 404));
    }

    if (listing.host.toString() !== req.user!._id.toString() && req.user!.role !== 'admin') {
      return next(new AppError('Not authorized to delete this listing.', 403));
    }

    await listing.deleteOne();
    res.json({ success: true, message: 'Listing deleted.' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get listing availability
// @route   GET /api/listings/:id/availability
export const getAvailability = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const listing = await Listing.findById(req.params.id).select('availability');
    if (!listing) {
      return next(new AppError('Listing not found.', 404));
    }

    // Get booked dates
    const bookings = await Booking.find({
      listing: req.params.id,
      status: { $in: ['pending', 'confirmed'] },
      checkOut: { $gte: new Date() },
    }).select('checkIn checkOut');

    const bookedDates: Date[] = [];
    bookings.forEach((booking) => {
      const current = new Date(booking.checkIn);
      while (current < booking.checkOut) {
        bookedDates.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }
    });

    res.json({
      success: true,
      data: {
        ...listing.availability,
        bookedDates,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update listing availability
// @route   PATCH /api/listings/:id/availability
export const updateAvailability = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return next(new AppError('Listing not found.', 404));
    if (listing.host.toString() !== req.user!._id.toString()) {
      return next(new AppError('Not authorized.', 403));
    }

    listing.availability = { ...listing.availability, ...req.body };
    await listing.save();

    res.json({ success: true, data: listing.availability });
  } catch (error) {
    next(error);
  }
};

// @desc    Get host's listings
// @route   GET /api/listings/host/me
export const getMyListings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const listings = await Listing.find({ host: req.user!._id }).sort('-createdAt');
    res.json({ success: true, data: listings });
  } catch (error) {
    next(error);
  }
};
