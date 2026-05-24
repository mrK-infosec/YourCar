/**
 * CAR CONTROLLER
 * This file contains the logic for processing vehicle inventory actions.
 * It queries MongoDB using our Mongoose 'Car' model.
 * Each function uses standard try-catch blocks to catch errors.
 */

// Import the Car model to query database collections
const Car = require('../models/Car');

/**
 * @desc    Retrieve all cars
 * @route   GET /api/cars
 * @access  Public
 */
exports.getCars = async (req, res, next) => {
  try {
    let query;

    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude from filtering
    const removeFields = ['select', 'sort', 'page', 'limit'];

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach((param) => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`);

    // Finding resource
    query = Car.find(JSON.parse(queryStr));

    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    } else {
      // Default projection: Exclude heavy text fields if not requested
      query = query.select('-description');
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt'); // Default sort
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    // Hard cap limit at 50 to prevent memory leak and unbounded queries
    let limit = parseInt(req.query.limit, 10) || 10;
    if (limit > 50) {
      limit = 50; 
    }
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    // Executing query
    const cars = await query;

    // Respond with a 200 OK and the list of cars
    res.status(200).json({
      success: true,
      count: cars.length,
      pagination: {
        page,
        limit
      },
      data: cars
    });
  } catch (error) {
    // If an error happens, pass it to the global error handler middleware
    next(error);
  }
};

/**
 * @desc    Retrieve a single car details by its ID
 * @route   GET /api/cars/:id
 * @access  Public
 */
exports.getCarById = async (req, res, next) => {
  try {
    // Find car by its ID in MongoDB
    const car = await Car.findById(req.params.id);

    // If no car is found, set status to 404 and return error message
    if (!car) {
      res.status(404);
      throw new Error(`Car with ID ${req.params.id} was not found`);
    }

    // Return the found car data
    res.status(200).json({
      success: true,
      data: car
    });
  } catch (error) {
    // Pass any errors to our global handler (e.g. invalid ID format errors)
    next(error);
  }
};

/**
 * @desc    Create a new Car listing
 * @route   POST /api/admin/cars
 * @access  Admin (Protected by JWT)
 */
exports.createCar = async (req, res, next) => {
  try {
    // Deconstruct fields from the validated request body
    const { name, brand, price, marketPrice, marketTrend, imageUrl, description, seats, luggage, category } = req.body;

    // Create a new Car document and save it in MongoDB
    const newCar = await Car.create({
      name,
      brand,
      price,
      marketPrice,
      marketTrend,
      imageUrl,
      description,
      seats,
      luggage,
      category
    });

    // Respond with 201 Created and the new car document
    res.status(201).json({
      success: true,
      message: 'New car added successfully!',
      data: newCar
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an existing Car listing
 * @route   PUT /api/admin/cars/:id
 * @access  Admin (Protected by JWT)
 */
exports.updateCar = async (req, res, next) => {
  try {
    // Find the car by ID
    let car = await Car.findById(req.params.id);

    // Return 404 if not found
    if (!car) {
      res.status(404);
      throw new Error(`Car with ID ${req.params.id} was not found`);
    }

    // Update the car fields and run schema validation checks
    car = await Car.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Returns the updated version of the document, not the old one
      runValidators: true // Enforces Mongoose schema validations during updates
    });

    // Respond with 200 OK and updated car details
    res.status(200).json({
      success: true,
      message: 'Car listing updated successfully!',
      data: car
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a Car listing
 * @route   DELETE /api/admin/cars/:id
 * @access  Admin (Protected by JWT)
 */
exports.deleteCar = async (req, res, next) => {
  try {
    // Find the car by ID
    const car = await Car.findById(req.params.id);

    // Return 404 if not found
    if (!car) {
      res.status(404);
      throw new Error(`Car with ID ${req.params.id} was not found`);
    }

    // Remove the car document from MongoDB
    await Car.findByIdAndDelete(req.params.id);

    // Respond with a success message
    res.status(200).json({
      success: true,
      message: `Car listing with name "${car.name}" has been deleted.`
    });
  } catch (error) {
    next(error);
  }
};
