import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    // Deferred Booking ID — generated only after cash is confirmed
    booking_id: { type: String, unique: true, sparse: true },

    // Relations
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },


    // Event
    occasion: { type: String },
    decorationRequired: { type: Boolean, default: false },
    decorationType: {
        type: String,
        enum: ['none', 'basic', 'premium', 'luxury'],
        default: 'none'
    },

    // Locations
    pickupLocation: { type: String, required: true },
    pickupLatitude: { type: Number },
    pickupLongitude: { type: Number },
    dropoffLocation: { type: String, required: true },
    dropLatitude: { type: Number },
    dropLongitude: { type: Number },

    // Trip details
    bookingDate: { type: Date, default: Date.now },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    startTime: { type: String },   // e.g. "10:00 AM"
    duration: { type: Number },    // in hours
    passengers: { type: Number },

    // Booking Pricing Structure
    totalPrice: { type: Number, default: 0 },

    // Payment
    paymentMethod: { type: String, default: 'CASH' },
    paymentStatus: {
        type: String,
        enum: ['PENDING', 'COLLECTED'],
        default: 'PENDING'
    },
    status: {
        type: String,
        enum: [
            'WAITING_FOR_CASH',
            'CONFIRMED',
            'DRIVER_ASSIGNED',
            'ONGOING',
            'COMPLETED',
            'CANCELLED'
        ],
        default: 'WAITING_FOR_CASH'
    },

    // Cash collection
    amountReceived: { type: Number },
    collectedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    collectedAt: { type: Date },

    // Driver Feedback
    driverFeedback: {
        rating: { type: Number, min: 1, max: 5 },
        comment: { type: String },
        submittedAt: { type: Date }
    },

    // Customer Identity Details
    customerName: { type: String },
    customerPhone: { type: String },
    customerAddress: { type: String },

    // Car name denormalized for easy display
    carName: { type: String },
}, { timestamps: true });

export default mongoose.model('Booking', bookingSchema);
