import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Car from '../models/Car.js';
import Driver from '../models/Driver.js';
import Booking from '../models/Booking.js';
import Notification from '../models/Notification.js';
import connectDB from '../config/db.js';

dotenv.config();
connectDB();

const importData = async () => {
    try {
        await User.deleteMany();
        await Car.deleteMany();
        await Driver.deleteMany();
        await Booking.deleteMany();
        await Notification.deleteMany();

        const createdUsers = await User.create([
            { name: 'S.prudhvi rajesh', phone: '9346184719', email: 'sheggemmounika@gmail.com', password: 'Pandu@16', role: 'admin' },
            { name: 'sheggam annamaya', phone: '8639737339', email: 'bannusheggem@gmail.com', password: 'Bannu@09', role: 'admin' }
        ]);

        const sampleCars = [
            { name: 'Kia Carens', registrationNumber: 'AP 40ER8470', type: 'SUV', seats: 7, transmission: 'Automatic', fuelType: 'Diesel', imageUrl: '/images/kia-carens.jpg', description: 'Premium 7-seater SUV.' }
        ];

        await Car.insertMany(sampleCars);

        await Driver.insertMany([
            { name: 'S.prudhvi rajesh', phone: '9346184719', licenseNumber: 'AP071234561', experienceYears: 10, languages: ['Telugu', 'English'], pricePerDay: 20, imageUrl: '/images/driver1.jpg' },
            { name: 'sheggam annamaya', phone: '8639737339', licenseNumber: 'AP071234562', experienceYears: 40, languages: ['Telugu', 'Hindi'], pricePerDay: 20, imageUrl: '/images/driver1.jpg' }
        ]);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
}

importData();
