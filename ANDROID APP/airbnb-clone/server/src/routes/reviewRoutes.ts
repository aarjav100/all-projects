import { Router } from 'express';
import { createReview, getListingReviews, replyToReview, deleteReview } from '../controllers/reviewController';
import { protect } from '../middleware/auth';
import { validate, createReviewSchema } from '../middleware/validate';

const router = Router();

router.post('/', protect, validate(createReviewSchema), createReview);
router.get('/listing/:listingId', getListingReviews);
router.patch('/:id/reply', protect, replyToReview);
router.delete('/:id', protect, deleteReview);

export default router;
