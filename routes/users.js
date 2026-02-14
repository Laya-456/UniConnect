import { Router } from 'express';
import { authMiddleware } from '../middleware.js';
import {
  getMe,
  updateInterests,
  getMatchByInterest,
  getMatchByMood,
  getRecentChatPartners,
  getPublicProfile,
} from '../controllers/usersController.js';

const router = Router();
router.use(authMiddleware);
router.get('/me', getMe);
router.get('/:id/profile', getPublicProfile);
router.put('/interests', updateInterests);
router.get('/match/interest', getMatchByInterest);
router.get('/match/mood', getMatchByMood);
router.get('/chat-partners', getRecentChatPartners);
export default router;
