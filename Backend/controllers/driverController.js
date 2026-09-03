import Driver from '../models/Driver.js';

// @desc    Fetch all drivers
// @route   GET /api/drivers
// @access  Public
export const getDrivers = async (req, res) => {
    const drivers = await Driver.find({});
    res.json(drivers);
};

// @desc    Create a driver
// @route   POST /api/drivers
// @access  Private/Admin
export const createDriver = async (req, res) => {
    const driver = new Driver({
        name: 'Sample Driver',
        experienceYears: 5,
        languages: ['English', 'Hindi'],
        pricePerDay: 50,
        imageUrl: '/images/driver.jpg',
    });

    const createdDriver = await driver.save();
    res.status(201).json(createdDriver);
};
