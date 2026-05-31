import { Router } from 'express';
import {
  getListings, getListing, createListing, updateListing, deleteListing,
  getAvailability, updateAvailability, getMyListings,
} from '../controllers/listingController';
import { protect, optionalAuth } from '../middleware/auth';
import { roleGuard } from '../middleware/roleGuard';
import { validate, createListingSchema } from '../middleware/validate';

const router = Router();

router.get('/', optionalAuth, getListings);
router.get('/host/me', protect, getMyListings);
router.get('/:id', optionalAuth, getListing);
router.get('/:id/availability', getAvailability);

router.post('/', protect, validate(createListingSchema), createListing);
router.patch('/:id', protect, updateListing);
router.delete('/:id', protect, deleteListing);
router.patch('/:id/availability', protect, updateAvailability);

export default router;
