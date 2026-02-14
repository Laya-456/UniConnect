import { Router } from 'express';
import { authMiddleware } from '../middleware.js';
import { getChatWithUser, sendMessage } from '../controllers/chatController.js';

const router = Router();
router.use(authMiddleware);
router.get('/:userId', getChatWithUser);
router.post('/', sendMessage);
export default router;
