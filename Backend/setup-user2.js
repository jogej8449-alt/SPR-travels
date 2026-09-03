import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('12345678', salt);
    const db = mongoose.connection.db;

    // Explicitly update or create the user in the atlas remote db
    const existing = await db.collection('users').findOne({ email: 'jogeswar@gmail.com' });
    if (existing) {
        await db.collection('users').updateOne(
            { email: 'jogeswar@gmail.com' },
            { $set: { password: hashedPassword, role: 'admin' } }
        );
        console.log('User updated successfully');
    } else {
        await db.collection('users').insertOne({
            name: 'Jogeswar',
            email: 'jogeswar@gmail.com',
            password: hashedPassword,
            role: 'admin',
            createdAt: new Date(),
            updatedAt: new Date()
        });
        console.log('User created successfully');
    }
    process.exit(0);
}).catch(console.error);
