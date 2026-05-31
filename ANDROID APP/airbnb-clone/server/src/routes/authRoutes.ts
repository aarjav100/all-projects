import { Router } from 'express';
import { register, login, googleAuth, forgotPassword, verifyOtp, resetPassword, refreshTokenHandler } from '../controllers/authController';
import { validate, registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from '../middleware/validate';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();

router.use(authLimiter);

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/google', googleAuth);
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', validate(resetPasswordSchema), resetPassword);
router.post('/refresh-token', refreshTokenHandler);

export default router;
