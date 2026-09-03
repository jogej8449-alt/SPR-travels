import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Booking from '../models/Booking.js';
import Notification from '../models/Notification.js';
import connectDB from '../config/db.js';

dotenv.config();
await connectDB();

const clearData = async () => {
    try {
        await Booking.deleteMany();
        await Notification.deleteMany();
        console.log('Bookings and Notifications cleared completely!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
}

clearData();
