import express from 'express';
import { getCars, getCarById, createCar } from '../controllers/carController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.route('/').get(getCars).post(protect, admin, createCar);
router.route('/:id').get(getCarById);

export default router;
