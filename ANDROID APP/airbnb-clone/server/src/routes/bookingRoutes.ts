import { Router } from 'express';
import {
  createBooking, getGuestBookings, getHostBookings,
  getBooking, cancelBooking, confirmBooking,
} from '../controllers/bookingController';
import { protect } from '../middleware/auth';
import { validate, createBookingSchema } from '../middleware/validate';

const router = Router();

router.use(protect);

router.post('/', validate(createBookingSchema), createBooking);
router.get('/guest/me', getGuestBookings);
router.get('/host/me', getHostBookings);
router.get('/:id', getBooking);
router.patch('/:id/cancel', cancelBooking);
router.patch('/:id/confirm', confirmBooking);

export default router;
