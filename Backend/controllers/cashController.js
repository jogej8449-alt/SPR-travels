import Booking from '../models/Booking.js';
import Notification from '../models/Notification.js';

// GET /api/cash/pending — all bookings waiting for cash
export const getPendingCash = async (req, res) => {
    try {
        const bookings = await Booking.find({ status: 'WAITING_FOR_CASH' })
            .populate('user', 'name email phone')
            .populate('car', 'name seats')
            .populate('driver', 'name phone')
            .sort({ createdAt: -1 });
        res.json({ success: true, bookings });
    } catch (error) {
        console.error('getPendingCash error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// GET /api/cash/collected — all confirmed/collected bookings
export const getCollectedCash = async (req, res) => {
    try {
        const bookings = await Booking.find({ paymentStatus: 'COLLECTED' })
            .populate('user', 'name email phone')
            .populate('car', 'name seats')
            .populate('collectedBy', 'name')
            .sort({ collectedAt: -1 });
        res.json({ success: true, bookings });
    } catch (error) {
        console.error('getCollectedCash error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// POST /api/cash/:bookingId/confirm — cashier/admin confirms cash received
export const confirmCash = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { amount_received } = req.body;

        if (!amount_received) {
            return res.status(400).json({ success: false, message: 'amount_received is required' });
        }

        const booking = await Booking.findById(bookingId)
            .populate('user', 'name email')
            .populate('car', 'name');

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        if (booking.paymentStatus !== 'PENDING') {
            return res.status(400).json({ success: false, message: 'Payment is not pending' });
        }

        if (booking.status !== 'WAITING_FOR_CASH') {
            return res.status(400).json({ success: false, message: 'Booking is not waiting for cash' });
        }

        const amountReceived = Number(amount_received);
        const amountDue = booking.totalPrice || 0;

        if (amountDue > 0 && amountReceived !== amountDue) {
            return res.status(400).json({
                success: false,
                message: `Amount received (₹${amountReceived}) does not match the amount due (₹${amountDue}).`
            });
        }

        if (amountReceived <= 0) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid amount greater than 0."
            });
        }

        // Generate formal booking ID ONLY upon cash confirmation
        booking.booking_id = `RR-${new Date().getFullYear()}-${String(Math.floor(100000 + Math.random() * 900000))}`;

        // Confirm payment
        booking.paymentStatus = 'COLLECTED';
        booking.status = 'CONFIRMED';
        booking.amountReceived = amountReceived;
        booking.totalPrice = amountReceived; // Sync the final negotiated price universally so dashboard revenue is correct
        booking.collectedBy = req.user._id;
        booking.collectedAt = new Date();

        await booking.save();

        // Create notification for the customer
        await Notification.create({
            user: booking.user._id || booking.user,
            title: '🎉 Booking Confirmed',
            message: `Your cash payment of ₹${amountReceived.toLocaleString('en-IN')} has been received. Your booking ${booking.booking_id} is confirmed.`,
            type: 'Payment'
        });

        res.json({
            success: true,
            message: 'Cash confirmed. Booking is now CONFIRMED.',
            booking
        });

    } catch (error) {
        console.error('confirmCash error:', error);
        res.status(500).json({ success: false, message: 'Server error confirming cash' });
    }
};
