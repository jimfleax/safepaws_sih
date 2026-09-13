import { Router } from 'express';
import { googleLogin, logout } from '../controllers/authController.ts';
import { requireAuth } from '../middleware/authMiddleware.ts';

const router = Router();

router.post('/google', googleLogin);
router.post('/logout', requireAuth, logout);

export default router;
