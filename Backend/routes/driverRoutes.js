import express from 'express';
import { getDrivers, createDriver } from '../controllers/driverController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.route('/').get(getDrivers).post(protect, admin, createDriver);

export default router;
