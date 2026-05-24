const Car = require('../models/Car');

// @desc    Get all cars (with pagination and basic search)
// @route   GET /api/cars
exports.getCars = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = {};
    if (req.query.search) {
      query = {
        $or: [
          { brand: { $regex: req.query.search, $options: 'i' } },
          { model: { $regex: req.query.search, $options: 'i' } }
        ]
      };
    }

    const cars = await Car.find(query).skip(skip).limit(limit).sort('-createdAt');
    const total = await Car.countDocuments(query);

    res.status(200).json({
      success: true,
      count: cars.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: cars
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Get single car
// @route   GET /api/cars/:id
exports.getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ success: false, error: 'Car not found' });
    }
    res.status(200).json({ success: true, data: car });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Create new car
// @route   POST /api/cars
exports.createCar = async (req, res) => {
  try {
    const car = await Car.create(req.body);
    res.status(201).json({ success: true, data: car });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Update car
// @route   PUT /api/cars/:id
exports.updateCar = async (req, res) => {
  try {
    const car = await Car.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!car) {
      return res.status(404).json({ success: false, error: 'Car not found' });
    }
    res.status(200).json({ success: true, data: car });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Delete car
// @route   DELETE /api/cars/:id
exports.deleteCar = async (req, res) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);
    if (!car) {
      return res.status(404).json({ success: false, error: 'Car not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};
