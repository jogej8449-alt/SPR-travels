import Car from '../models/Car.js';

// @desc    Fetch all cars
// @route   GET /api/cars
// @access  Public
export const getCars = async (req, res) => {
    const cars = await Car.find({});
    res.json(cars);
};

// @desc    Fetch single car
// @route   GET /api/cars/:id
// @access  Public
export const getCarById = async (req, res) => {
    const car = await Car.findById(req.params.id);

    if (car) {
        res.json(car);
    } else {
        res.status(404).json({ message: 'Car not found' });
    }
};

// @desc    Create a car
// @route   POST /api/cars
// @access  Private/Admin
export const createCar = async (req, res) => {
    const car = new Car({
        name: 'Sample name',
        type: 'SUV',
        seats: 5,
        pricePerDay: 100,
        transmission: 'Automatic',
        fuelType: 'Petrol',
        imageUrl: '/images/sample.jpg',
        description: 'Sample description',
    });

    const createdCar = await car.save();
    res.status(201).json(createdCar);
};
