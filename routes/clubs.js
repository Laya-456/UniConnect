import { Router } from 'express';
import { getClubs } from '../controllers/clubsController.js';

const router = Router();
router.get('/', getClubs);
export default router;
