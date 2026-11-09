import { Router } from 'express';
import { login, logout, getMe, getAdminStats } from '../controllers/authController.ts';
import { requireAuth } from '../middleware/authMiddleware.ts';

const router = Router();

router.post('/login', login);
router.post('/logout', logout);
router.get('/me', getMe);
router.get('/stats', requireAuth, getAdminStats);

export default router;
