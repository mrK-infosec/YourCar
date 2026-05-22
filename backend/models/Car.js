/**
 * CAR SCHEMA & MODEL (Mongoose)
 * This file defines the database structure for our "Car" collection in MongoDB.
 * Using Mongoose, we enforce data types, defaults, and validation rules
 * before any car is saved into the database.
 */

// Import Mongoose library to interface with MongoDB
const mongoose = require('mongoose');

// Define the blueprint (Schema) of a Car document
const carSchema = new mongoose.Schema(
  {
    // The name of the car model (e.g. "Mercedes-Benz 450D") - must be text, required
    name: {
      type: String,
      required: [true, 'Car name is required'],
      trim: true // Automatically removes extra spaces from both ends
    },
    // The manufacturer or brand (e.g. "Mercedes") - must be text, required
    brand: {
      type: String,
      required: [true, 'Car brand is required'],
      trim: true
    },
    // The retail or daily rental price of the vehicle - must be a number, minimum is 0
    price: {
      type: Number,
      required: [true, 'Car price is required'],
      min: [0, 'Price cannot be negative']
    },
    // The direct link/URL of the vehicle photo - must be text, required
    imageUrl: {
      type: String,
      required: [true, 'Car image URL is required'],
      trim: true,
      // Regular expression to check if the text matches a standard URL format
      match: [/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/, 'Please provide a valid image URL']
    },
    // Brief marketing details - must be text, max 500 characters
    description: {
      type: String,
      required: [true, 'Car description is required'],
      maxlength: [500, 'Description cannot exceed 500 characters'],
      trim: true
    },
    // Total passenger seats available - must be an integer between 1 and 9
    seats: {
      type: Number,
      required: [true, 'Number of seats is required'],
      min: [1, 'Seats must be at least 1'],
      max: [9, 'Seats cannot exceed 9']
    },
    // Total luggage capacity (number of suitcases) - must be a positive integer
    luggage: {
      type: Number,
      required: [true, 'Luggage capacity is required'],
      min: [0, 'Luggage cannot be negative'],
      default: 0
    },
    // The specific rental class or pricing segment - restricts values to a pre-defined set (enum)
    category: {
      type: String,
      required: [true, 'Car category is required'],
      enum: {
        values: ['First Class', 'Business Class', 'SUV', 'Economy'],
        message: '{VALUE} is not a valid category'
      }
    },
    // Indicates if the car is currently available to buy/rent - defaults to true
    inStock: {
      type: Boolean,
      default: true
    }
  },
  {
    // Automatically creates 'createdAt' and 'updatedAt' date columns inside our document
    timestamps: true
  }
);

// Compile the schema into a Mongoose Model named 'Car' and export it.
// This allows other files to query, insert, update, or delete cars.
module.exports = mongoose.model('Car', carSchema);
