import { Router } from 'express';
import { getMe, updateProfile } from '../controllers/userController.ts';
import { requireAuth } from '../middleware/authMiddleware.ts';

const router = Router();

router.use(requireAuth);

router.get('/me', getMe);
router.put('/profile', updateProfile);

export default router;
