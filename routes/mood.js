import { Router } from 'express';
import { authMiddleware } from '../middleware.js';
import { getMyMood, logMood, getMoodMeter } from '../controllers/moodController.js';

const router = Router();
router.get('/', authMiddleware, getMyMood);
router.post('/', authMiddleware, logMood);
router.get('/meter', getMoodMeter);
export default router;
