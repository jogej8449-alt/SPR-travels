import mongoose from 'mongoose';

const driverSchema = new mongoose.Schema({
    driver_id: { type: String, unique: true, sparse: true },
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    licenseNumber: { type: String, required: true, unique: true },

    experienceYears: { type: Number, required: true },
    languages: [{ type: String }],
    pricePerDay: { type: Number, required: true },

    rating: { type: Number, default: 4.5 },
    imageUrl: { type: String, required: true },

    isAvailable: { type: Boolean, default: true },
    availabilityStatus: { type: String, enum: ['Available', 'Busy', 'Unavailable'], default: 'Available' }
}, { timestamps: true });

export default mongoose.model('Driver', driverSchema);
