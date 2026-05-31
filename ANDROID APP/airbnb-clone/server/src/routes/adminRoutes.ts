import { Router } from 'express';
import { getUsers, toggleBanUser, getAdminListings, toggleListingApproval, getAdminStats } from '../controllers/adminController';
import { protect } from '../middleware/auth';
import { roleGuard } from '../middleware/roleGuard';

const router = Router();

router.use(protect, roleGuard('admin'));

router.get('/stats', getAdminStats);
router.get('/users', getUsers);
router.patch('/users/:id/ban', toggleBanUser);
router.get('/listings', getAdminListings);
router.patch('/listings/:id/approve', toggleListingApproval);

export default router;
