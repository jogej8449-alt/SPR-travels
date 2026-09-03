import Booking from '../models/Booking.js';
import Notification from '../models/Notification.js';

export const processCashCheckout = async (req, res) => {
    try {
        const { bookingData } = req.body;

        // Formally persisting the booking to Database as Pending Cash Collection
        // NOTE: No booking_id is generated here! It is deferred until Cash Collection.
        const newBooking = new Booking({
            user: req.user._id,
            car: bookingData.car,
            driver: bookingData.driver || null,
            pickupLocation: bookingData.pickupLocation,
            dropoffLocation: bookingData.dropoffLocation,
            startDate: bookingData.startDate,
            endDate: bookingData.endDate,
            duration: bookingData.duration,
            occasion: bookingData.occasion,
            passengers: bookingData.passengers,

            // Financial Breakdown
            baseAmount: bookingData.baseAmount || 0,
            driverAmount: bookingData.driverAmount || 0,
            distanceAmount: bookingData.distanceAmount || 0,
            decorationAmount: bookingData.decorationAmount || 0,
            taxAmount: bookingData.taxAmount || 0,
            discountAmount: bookingData.discountAmount || 0,
            totalPrice: bookingData.totalPrice,

            // Strict Status Mapping
            paymentStatus: 'Pending',
            status: 'Pending',
            paymentMethod: 'CASH'
        });

        const savedBooking = await newBooking.save();

        res.json({ success: true, booking: savedBooking });

    } catch (error) {
        console.error("Cash Checkout Error:", error);
        res.status(500).json({ success: false, message: 'Server error processing booking' });
    }
};

export const markCashCollected = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount_received } = req.body; // Explicit exact amount required from Cashier

        const booking = await Booking.findById(id);

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking Not Found' });
        }

        if (booking.paymentStatus !== 'Pending') {
            return res.status(400).json({ success: false, message: 'Payment is not pending.' });
        }

        // STRICT EXACT MATCH VALIDATION
        if (Number(amount_received) !== booking.totalPrice) {
            return res.status(400).json({
                success: false,
                message: `Incorrect Cash Amount. Expected ₹${booking.totalPrice.toLocaleString()}, but received ₹${Number(amount_received).toLocaleString()}`
            });
        }

        // Success! Confirm everything
        booking.paymentStatus = 'Collected';
        booking.status = 'Confirmed';

        // Generate the Deferred Booking ID
        const date = new Date();
        const year = date.getFullYear();
        const randomHash = Math.floor(100000 + Math.random() * 900000);
        booking.booking_id = `RR-${year}-${randomHash}`;

        // Track collection details
        booking.collectedBy = req.user._id;
        booking.collectedAt = new Date();

        await booking.save();

        await Notification.create({
            user: booking.user,
            title: "Booking Confirmed",
            message: `Your cash payment of ₹${booking.totalPrice.toLocaleString()} has been received. Your booking ${booking.booking_id} is confirmed.`,
            type: "Payment"
        });

        res.json({ success: true, message: 'Cash successfully marked as collected.', booking });

    } catch (error) {
        console.error("Admin Cash Collection Error:", error);
        res.status(500).json({ success: false, message: 'Server error updating cash status' });
    }
};
