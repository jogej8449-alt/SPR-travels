import express from 'express';
import Booking from '../models/Booking.js';
import Car from '../models/Car.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';

const router = express.Router();

// GET /api/admin/dashboard
router.get('/dashboard', protect, admin, async (req, res) => {
    try {
        const totalBookings = await Booking.countDocuments();

        const revenueResult = await Booking.aggregate([
            { $match: { paymentStatus: 'COLLECTED' } },
            { $group: { _id: null, total: { $sum: '$totalPrice' } } }
        ]);
        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

        const activeFleet = await Car.countDocuments({ isAvailable: true });

        const pendingApprovals = await Booking.countDocuments({ status: 'WAITING_FOR_CASH' });

        res.json({
            totalBookings,
            totalRevenue,
            activeFleet,
            pendingApprovals
        });
    } catch (error) {
        console.error('Admin Dashboard Error:', error);
        res.status(500).json({ message: 'Server error fetching dashboard stats' });
    }
});

export default router;
