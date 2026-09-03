import express from 'express';
import { processCashCheckout, markCashCollected } from '../controllers/paymentController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/cash-checkout', protect, processCashCheckout);
router.put('/collect/:id', protect, admin, markCashCollected);

export default router;
