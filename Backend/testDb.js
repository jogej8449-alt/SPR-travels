import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const uri = 'mongodb://jogej8449_db_user:ngRRnSgEqzTqkkCZ@ac-xjmrf2l-shard-00-00.erfnvxu.mongodb.net:27017,ac-xjmrf2l-shard-00-01.erfnvxu.mongodb.net:27017,ac-xjmrf2l-shard-00-02.erfnvxu.mongodb.net:27017/?ssl=true&replicaSet=atlas-113of7-shard-0&authSource=admin&retryWrites=true&w=majority&appName=carproject';

mongoose.connect(uri).then(async () => {
    try {
        const bookings = await mongoose.connection.collection('bookings').find({}).toArray();
        console.log('Bookings:', bookings.length);
        console.log('Payment:', bookings.map(b => b.paymentStatus));
        console.log('Status:', bookings.map(b => b.status));

        const cars = await mongoose.connection.collection('cars').find({}).toArray();
        console.log('Cars:', cars.length, 'Available:', cars.map(c => c.isAvailable + ' ' + c.availabilityStatus));
    } catch (e) {
        console.error(e);
    }
    process.exit(0);
});
