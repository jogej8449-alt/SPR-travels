import Booking from '../models/Booking.js';

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
export const addBooking = async (req, res) => {
    const { car, startDate, totalPrice } = req.body;

    if (!car || !startDate || totalPrice === undefined) {
        res.status(400).json({ message: 'No booking items provided' });
        return;
    } else {
        const booking = new Booking({
            ...req.body,
            user: req.user._id
        });

        const createdBooking = await booking.save();
        res.status(201).json(createdBooking);
    }
};

// @desc    Get user bookings
// @route   GET /api/bookings/mybookings
// @access  Private
export const getMyBookings = async (req, res) => {
    const bookings = await Booking.find({ user: req.user._id }).populate('car', 'name imageUrl').populate('driver', 'name');
    res.json(bookings);
};

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private/Admin
export const getBookings = async (req, res) => {
    const bookings = await Booking.find({}).populate('user', 'id name').populate('car', 'name type');
    res.json(bookings);
};
