import { Router } from 'express';
import { authMiddleware } from '../middleware.js';
import { getInfo, checkLowMoodSuggestion } from '../controllers/wellnessController.js';

const router = Router();
router.get('/', getInfo);
router.get('/suggestion', authMiddleware, checkLowMoodSuggestion);
export default router;
