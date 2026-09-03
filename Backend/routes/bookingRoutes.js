import express from 'express';
import Booking from '../models/Booking.js';
import Driver from '../models/Driver.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';

const router = express.Router();

// POST /api/bookings — create booking (sets WAITING_FOR_CASH initially)
router.post('/', protect, async (req, res) => {
    try {
        const {
            car, carName, occasion, decorationRequired, decorationType,
            pickupLocation, pickupLatitude, pickupLongitude,
            dropoffLocation, dropLatitude, dropLongitude,
            startDate, startTime, duration, passengers,
            customerName, customerPhone, customerAddress
        } = req.body;

        if (!car || !pickupLocation || !dropoffLocation || !startDate) {
            return res.status(400).json({ success: false, message: 'Missing required booking fields' });
        }

        const endDate = new Date(startDate);
        endDate.setHours(endDate.getHours() + (duration || 4));

        const booking = new Booking({
            user: req.user._id,
            booking_id: `TEMP-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            car,
            carName,
            occasion,
            decorationRequired: decorationRequired || false,
            decorationType: decorationType || 'none',
            pickupLocation,
            pickupLatitude,
            pickupLongitude,
            dropoffLocation,
            dropLatitude,
            dropLongitude,
            startDate,
            endDate,
            startTime,
            duration,
            passengers,
            customerName,
            customerPhone,
            customerAddress,
            totalPrice: 0,
            paymentMethod: 'CASH',
            paymentStatus: 'PENDING',
            status: 'WAITING_FOR_CASH'
        });

        const saved = await booking.save();
        res.status(201).json({ success: true, booking: saved });
    } catch (error) {
        console.error('Create booking error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET /api/bookings/my — user's own bookings
router.get('/my', protect, async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id })
            .populate('car', 'name seats image')
            .populate('driver', 'name phone')
            .sort({ createdAt: -1 });
        res.json({ success: true, bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET /api/bookings/driver/feedback — aggregate feedback by driver name
router.get('/driver/feedback', protect, async (req, res) => {
    try {
        const { driverName } = req.query;
        if (!driverName) return res.status(400).json({ success: false, message: 'Driver name required' });

        // Find driver by name matching
        const driverModels = await Driver.find({ name: { $regex: driverName.split(' ')[0], $options: 'i' } });
        if (!driverModels.length) return res.json({ success: true, feedback: [] });

        const driverIds = driverModels.map(d => d._id);

        const bookings = await Booking.find({
            driver: { $in: driverIds },
            'driverFeedback': { $exists: true, $ne: null }
        }).populate('user', 'name').sort({ 'driverFeedback.submittedAt': -1 });

        // Map output
        const feedback = bookings.map(b => ({
            _id: b._id,
            booking_id: b.booking_id,
            rating: b.driverFeedback.rating,
            comment: b.driverFeedback.comment,
            submittedAt: b.driverFeedback.submittedAt,
            customerName: b.user?.name || 'Customer',
            tripDate: b.startDate
        })).filter(f => f.rating);

        res.json({ success: true, feedback });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// GET /api/bookings/:id — single booking detail
router.get('/:id', protect, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('car', 'name seats image description')
            .populate('driver', 'name phone experience rating')
            .populate('collectedBy', 'name');
        if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
        // Only owner or admin can view
        if (booking.user.toString() !== req.user._id.toString() && req.user.role === 'user') {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }
        res.json({ success: true, booking });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET /api/bookings — all bookings (admin)
router.get('/', protect, admin, async (req, res) => {
    try {
        const bookings = await Booking.find({})
            .populate('user', 'name email phone')
            .populate('car', 'name seats')
            .populate('driver', 'name phone')
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/bookings/:id/feedback — submit customer feedback for driver
router.post('/:id/feedback', protect, async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }
        if (booking.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized to leave feedback on this booking' });
        }
        if (!booking.driver) {
            return res.status(400).json({ success: false, message: 'No driver was assigned to this booking' });
        }
        if (booking.status !== 'COMPLETED') {
            return res.status(400).json({ success: false, message: 'Can only leave feedback on COMPLETED bookings' });
        }
        if (booking.driverFeedback && booking.driverFeedback.rating) {
            return res.status(400).json({ success: false, message: 'Feedback already submitted for this trip' });
        }

        booking.driverFeedback = {
            rating: Number(rating),
            comment,
            submittedAt: Date.now()
        };

        await booking.save();
        res.status(201).json({ success: true, message: 'Feedback submitted successfully', feedback: booking.driverFeedback });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
