import { Router } from 'express';
import { authMiddleware } from '../middleware.js';
import { updateProfile } from '../controllers/profileController.js';

const router = Router();
router.use(authMiddleware);
router.put('/update', updateProfile);
export default router;
