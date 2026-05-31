import { Router } from 'express';
import { createPaymentIntent, confirmPayment, stripeWebhook, getPaymentHistory } from '../controllers/paymentController';
import { protect } from '../middleware/auth';

const router = Router();

router.post('/webhook', stripeWebhook); // Must be before protect
router.use(protect);
router.post('/create-intent', createPaymentIntent);
router.post('/confirm', confirmPayment);
router.get('/history', getPaymentHistory);

export default router;
