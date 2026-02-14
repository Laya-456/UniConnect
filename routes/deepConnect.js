import { Router } from 'express';
import { authMiddleware } from '../middleware.js';
import { saveResponse } from '../controllers/deepConnectController.js';

const router = Router();
router.post('/', authMiddleware, saveResponse);
export default router;
