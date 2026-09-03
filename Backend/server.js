import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Route Imports
import authRoutes from './routes/authRoutes.js';
import carRoutes from './routes/carRoutes.js';
import driverRoutes from './routes/driverRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import cashRoutes from './routes/cashRoutes.js';
import pricingRoutes from './routes/pricingRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// Route Registration
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/cash', cashRoutes);
app.use('/api/pricing', pricingRoutes);
app.use('/api/admin', adminRoutes);

// Health Check
app.get('/', (req, res) => {
    res.send('RIDE RENT API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
