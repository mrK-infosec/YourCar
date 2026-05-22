/**
 * CAR ROUTING MAP
 * This file maps incoming URLs (e.g. GET /api/cars) to specific functions
 * inside the "carController". It also inserts validation and authorization
 * middleware where appropriate to protect administrative pathways.
 */

// Import Express Router and controllers
const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');

// Import JWT authentication middleware
const protect = require('../middleware/auth');

// Import express-validator check rules
const { validateCar } = require('../utils/validation');

/**
 * -------------------------------------------------------------
 * Public Pathways (Access: Open to anyone)
 * -------------------------------------------------------------
 */

// URL: GET /api/cars -> Fetch list of all vehicles
router.get('/cars', carController.getCars);

// URL: GET /api/cars/:id -> Fetch details of a single vehicle
router.get('/cars/:id', carController.getCarById);

/**
 * -------------------------------------------------------------
 * Administrative Pathways (Access: Requires valid Admin JWT Token)
 * -------------------------------------------------------------
 */

// URL: POST /api/admin/cars -> Insert a brand new car
// 1st: checks if the caller is a logged-in admin (protect)
// 2nd: validates incoming car properties (validateCar)
// 3rd: executes database insertion (createCar)
router.post('/admin/cars', protect, validateCar, carController.createCar);

// URL: PUT /api/admin/cars/:id -> Modify an existing car's details
router.put('/admin/cars/:id', protect, validateCar, carController.updateCar);

// URL: DELETE /api/admin/cars/:id -> Delete a car listing from catalog
router.delete('/admin/cars/:id', protect, carController.deleteCar);

// Export the router so it can be mounted in server.js
module.exports = router;
