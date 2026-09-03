import mongoose from 'mongoose';

const pricingSchema = new mongoose.Schema({
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
    vehicleName: { type: String }, // denormalized for easy display
    packageHours: { type: Number, required: true },   // 4, 8, or 12
    includedKm: { type: Number, required: true },      // 40, 80, or 120
    packagePrice: { type: Number, required: true },    // ₹1800, ₹3600, ₹5000
    extraHourPrice: { type: Number, default: 450 },    // ₹450/hr
    extraKmPrice: { type: Number, default: 20 },       // ₹20/km
    driverIncluded: { type: Boolean, default: true },
    selfDriveAllowed: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('Pricing', pricingSchema);
