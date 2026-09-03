import mongoose from 'mongoose';

const carSchema = new mongoose.Schema({
    // Naming compatibility mapping
    name: { type: String, required: true }, // equivalent to vehicle_name
    type: { type: String, required: true }, // equivalent to category
    brand: { type: String },
    modelStr: { type: String }, // Using modelStr to avoid conflict with mongoose model keyword
    registrationNumber: { type: String, unique: true, sparse: true },

    seats: { type: Number, required: true },
    transmission: { type: String, enum: ['Automatic', 'Manual'], required: true },
    fuelType: { type: String, required: true },

    // Dynamic Extensible Pricing
    pricePerDay: { type: Number },
    pricePerHour: { type: Number },
    pricePerKm: { type: Number },

    // Rule Enginge
    driverRequired: { type: Boolean, default: false },
    selfDriveAllowed: { type: Boolean, default: true },

    imageUrl: { type: String, required: true },
    description: { type: String },
    isAvailable: { type: Boolean, default: true },
    availabilityStatus: { type: String, enum: ['Available', 'Maintenance', 'Booked Out'], default: 'Available' }
}, { timestamps: true });

export default mongoose.model('Car', carSchema);
