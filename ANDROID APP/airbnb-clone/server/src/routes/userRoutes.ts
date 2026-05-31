import { Router } from 'express';
import {
  getMe, updateMe, uploadAvatar, getPublicProfile,
  getWishlists, createWishlist, updateWishlist, deleteWishlist,
  toggleWishlistListing, becomeHost,
} from '../controllers/userController';
import { protect } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

router.get('/me', protect, getMe);
router.patch('/me', protect, updateMe);
router.post('/me/avatar', protect, upload.single('avatar'), uploadAvatar);
router.patch('/me/become-host', protect, becomeHost);

router.get('/me/wishlists', protect, getWishlists);
router.post('/me/wishlists', protect, createWishlist);
router.patch('/me/wishlists/:id', protect, updateWishlist);
router.delete('/me/wishlists/:id', protect, deleteWishlist);
router.post('/me/wishlists/:id/listings/:listingId', protect, toggleWishlistListing);

router.get('/:id', getPublicProfile);

export default router;
