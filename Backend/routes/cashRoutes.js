import express from 'express';
import { getPendingCash, getCollectedCash, confirmCash } from '../controllers/cashController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.get('/pending', protect, admin, getPendingCash);
router.get('/collected', protect, admin, getCollectedCash);
router.post('/:bookingId/confirm', protect, admin, confirmCash);

export default router;
