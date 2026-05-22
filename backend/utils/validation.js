/**
 * REQUEST VALIDATION SCHEMA RULES (express-validator)
 * This utility file defines check rules for all API requests.
 * By validating data before processing it in our database, we prevent
 * malformed inputs, data corruption, and common attacks like SQL/NoSQL Injection or XSS.
 */

// Import functions from express-validator
const { body, param, validationResult } = require('express-validator');

/**
 * Helper middleware function that checks if express-validator caught any errors.
 * If errors are found, we return a 400 Bad Request with a list of details.
 * If there are no errors, we call next() to proceed to the controller!
 */
const checkValidationErrors = (req, res, next) => {
  // Extract all validation errors from the request
  const errors = validationResult(req);
  
  // If there are errors, stop execution and respond immediately
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      // Format the errors into a clean key-value array
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  
  // If no validation errors, proceed to the controller
  next();
};

/**
 * Validation rules for adding or updating a Car
 */
const validateCar = [
  body('name')
    .notEmpty().withMessage('Car name is required')
    .trim()
    .escape(), // Escapes HTML tags to prevent XSS (Cross-Site Scripting)
    
  body('brand')
    .notEmpty().withMessage('Car brand is required')
    .trim()
    .escape(),
    
  body('price')
    .notEmpty().withMessage('Car price is required')
    .isNumeric().withMessage('Price must be a number')
    .float({ min: 0 }).withMessage('Price must be at least 0'),
    
  body('imageUrl')
    .notEmpty().withMessage('Image URL is required')
    .isURL().withMessage('Please provide a valid image URL link')
    .trim(),
    
  body('description')
    .notEmpty().withMessage('Description is required')
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters')
    .trim()
    .escape(),
    
  body('seats')
    .notEmpty().withMessage('Number of seats is required')
    .isInt({ min: 1, max: 9 }).withMessage('Seats must be an integer between 1 and 9'),
    
  body('luggage')
    .notEmpty().withMessage('Luggage capacity is required')
    .isInt({ min: 0 }).withMessage('Luggage must be 0 or more'),
    
  body('category')
    .notEmpty().withMessage('Category is required')
    .isIn(['First Class', 'Business Class', 'SUV', 'Economy']).withMessage('Invalid category specified'),
    
  // Run our error-checker middleware after executing the above checks
  checkValidationErrors
];

/**
 * Validation rules for creating a checkout Order
 */
const validateOrder = [
  // Validate customer nested properties
  body('customer.fullName')
    .notEmpty().withMessage('Customer full name is required')
    .trim()
    .escape(),
    
  body('customer.phone')
    .notEmpty().withMessage('Customer phone number is required')
    .trim()
    .escape(),
    
  body('customer.email')
    .optional({ values: 'falsy' }) // Allow email to be blank/optional
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(), // Standardizes email format (e.g. lowercase, trims)
    
  body('customer.address')
    .notEmpty().withMessage('Shipping address is required')
    .trim()
    .escape(),
    
  // Validate items array
  body('items')
    .isArray({ min: 1 }).withMessage('Order items list must contain at least one item'),
    
  body('items.*.car')
    .notEmpty().withMessage('Car reference ID is required')
    .isMongoId().withMessage('Invalid Car ID format'),
    
  body('items.*.name')
    .notEmpty().withMessage('Item name is required')
    .trim()
    .escape(),
    
  body('items.*.price')
    .notEmpty().withMessage('Item price is required')
    .isNumeric().withMessage('Item price must be a number')
    .float({ min: 0 }).withMessage('Item price cannot be negative'),
    
  body('items.*.quantity')
    .notEmpty().withMessage('Item quantity is required')
    .isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    
  body('totalAmount')
    .notEmpty().withMessage('Total payment amount is required')
    .isNumeric().withMessage('Total amount must be a number')
    .float({ min: 0 }).withMessage('Total amount cannot be negative'),
    
  checkValidationErrors
];

/**
 * Validation rules for Admin Login
 */
const validateLogin = [
  body('email')
    .notEmpty().withMessage('Email address is required')
    .isEmail().withMessage('Please enter a valid email address')
    .normalizeEmail(),
    
  body('password')
    .notEmpty().withMessage('Password is required'),
    
  checkValidationErrors
];

// Export all the validate schemas so we can apply them on Express routes
module.exports = {
  validateCar,
  validateOrder,
  validateLogin
};
