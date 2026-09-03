import express from 'express';
import { getPricing, createPricing, updatePricing, deletePricing } from '../controllers/pricingController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.get('/', getPricing);
router.post('/', protect, admin, createPricing);
router.put('/:id', protect, admin, updatePricing);
router.delete('/:id', protect, admin, deletePricing);

export default router;
