/**
 * ORDER SCHEMA & MODEL (Mongoose)
 * This file describes the database structure for client orders.
 * It contains customer details, items being bought (cars), total cost,
 * and a status tracker (pending, confirmed, delivered, etc.).
 * It also automatically generates a unique order number for tracking.
 */

// Import Mongoose library to interface with MongoDB
const mongoose = require('mongoose');

// Define the schema representing an Order
const orderSchema = new mongoose.Schema(
  {
    // A unique human-readable tracking number (e.g. "TM-16823940283")
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    // Customer Contact Details object
    customer: {
      fullName: {
        type: String,
        required: [true, 'Customer full name is required'],
        trim: true
      },
      phone: {
        type: String,
        required: [true, 'Customer phone number is required'],
        trim: true
      },
      email: {
        type: String,
        trim: true,
        lowercase: true, // Automatically converts input email to lowercase characters
        index: true
      },
      address: {
        type: String,
        required: [true, 'Customer shipping address is required'],
        trim: true
      }
    },
    // A list of items that the customer added to their cart
    items: [
      {
        // Links this item to a real Car document in our 'Car' collection using its ID
        car: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Car',
          required: [true, 'Reference to the car ID is required']
        },
        // Cache the car name and price at checkout time to prevent issues if a car is updated later
        name: {
          type: String,
          required: true
        },
        price: {
          type: Number,
          required: true,
          min: [0, 'Item price cannot be negative']
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, 'Quantity must be at least 1'],
          default: 1
        }
      }
    ],
    // The sum total cost calculated at purchase time - must be positive
    totalAmount: {
      type: Number,
      required: true,
      min: [0, 'Total amount cannot be negative']
    },
    // Payment method selected at checkout
    paymentMethod: {
      type: String,
      required: true,
      enum: {
        values: ['card', 'tabby', 'tamara', 'bank_cheque', 'cash'],
        message: '{VALUE} is not a valid payment method'
      },
      default: 'card'
    },
    // Installment details if tabby or tamara is used
    installments: {
      months: { type: Number },
      monthlyAmount: { type: Number }
    },
    // Current fulfillment phase of the order
    status: {
      type: String,
      required: true,
      enum: {
        values: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
        message: '{VALUE} is not a valid order status'
      },
      default: 'pending' // Orders start in 'pending' status
    }
  },
  {
    // Auto-generates 'createdAt' and 'updatedAt' dates
    timestamps: true
  }
);

// We export the Order model to be used by our controllers
module.exports = mongoose.model('Order', orderSchema);
