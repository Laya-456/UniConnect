import { Router } from 'express';
import { authMiddleware } from '../middleware.js';
import { getAll, create } from '../controllers/kindnessController.js';

const router = Router();
router.get('/', getAll);
router.post('/', authMiddleware, create);
export default router;
