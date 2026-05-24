/**
 * ORDER CONTROLLER
 * This file handles logic for customer purchases, status queries,
 * and admin dashboard tracking of all transactions in MongoDB.
 */

// Import Mongoose models for Order and Car database collections
const Order = require('../models/Order');
const Car = require('../models/Car');

/**
 * @desc    Create a new customer Order (Checkout)
 * @route   POST /api/orders
 * @access  Public
 */
exports.createOrder = async (req, res, next) => {
  try {
    const { customer, items, totalAmount, paymentMethod, installments } = req.body;

    // 1. Generate a unique order tracking number in the format "TM-XXXXXXXXX" (9 digits)
    let isUnique = false;
    let orderNumber = '';
    
    // Safety check loop to ensure we do not generate a duplicate order number
    while (!isUnique) {
      const randomDigits = Math.floor(100000000 + Math.random() * 900000000); // Generates 9 random numbers
      orderNumber = `TM-${randomDigits}`;
      
      // Look up if this order number is already in our MongoDB collection
      const existingOrder = await Order.findOne({ orderNumber });
      if (!existingOrder) {
        isUnique = true; // Break the loop if the order number is unique
      }
    }

    // 2. Double-check item availability and structure
    // We iterate through items to make sure their referenced cars exist
    for (const item of items) {
      const carExists = await Car.findById(item.car);
      if (!carExists) {
        res.status(404);
        throw new Error(`Car with ID ${item.car} does not exist in our catalog`);
      }
    }

    // 3. Create and save the new Order document in MongoDB
    const newOrder = await Order.create({
      orderNumber,
      customer,
      items,
      totalAmount,
      paymentMethod: paymentMethod || 'card',
      installments,
      status: 'pending' // Orders start in 'pending' phase
    });

    // 4. Return success and the newly created order details to the client
    res.status(201).json({
      success: true,
      message: 'Order created successfully!',
      data: newOrder
    });

  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get order details and status for tracking
 *          Looks up order by either Mongo ObjectId OR by custom orderNumber (e.g. "TM-123456789")
 *          And verifies the customer's phone number as a second security factor.
 * @route   GET /api/orders/:id
 * @access  Public
 */
exports.getOrderStatus = async (req, res, next) => {
  try {
    const searchParam = req.params.id; // Can be a Mongo ID or an orderNumber
    const clientPhone = req.query.phone; // Passed in query parameters (e.g. ?phone=1234567)

    // Build the MongoDB search query
    let query = {};
    if (searchParam.startsWith('TM-')) {
      query.orderNumber = searchParam;
    } else {
      // If it doesn't start with TM-, assume it is a 24-character Mongo ID
      query._id = searchParam;
    }

    // Find the order matching the ID or orderNumber
    const order = await Order.findOne(query);

    // If order not found, return 404
    if (!order) {
      res.status(404);
      throw new Error(`Order ${searchParam} not found`);
    }

    // SECURITY VERIFICATION:
    // If the tracking request specifies a phone number, we must ensure it matches
    // the phone number registered inside that order!
    if (clientPhone) {
      const cleanClientPhone = clientPhone.replace(/\s+/g, '');
      const cleanOrderPhone = order.customer.phone.replace(/\s+/g, '');
      
      if (cleanClientPhone !== cleanOrderPhone) {
        res.status(403); // Forbidden
        throw new Error('Verification failed. Phone number does not match the order record.');
      }
    }

    // Return the found order details
    res.status(200).json({
      success: true,
      data: order
    });

  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Retrieve all customer orders
 * @route   GET /api/orders
 * @access  Admin (Protected by JWT)
 */
exports.getAllOrders = async (req, res, next) => {
  try {
    // Fetch all orders sorted by newest first
    const orders = await Order.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update order status
 * @route   PUT /api/orders/:id/status
 * @access  Admin (Protected by JWT)
 */
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    // Validate if the input status is one of our schema options
    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      res.status(400);
      throw new Error(`Invalid status: "${status}". Must be one of: ${validStatuses.join(', ')}`);
    }

    // Find the order by ID
    const order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404);
      throw new Error(`Order with ID ${req.params.id} not found`);
    }

    // Apply status update
    order.status = status;
    await order.save();

    res.status(200).json({
      success: true,
      message: `Order status updated to "${status}" successfully!`,
      data: order
    });

  } catch (error) {
    next(error);
  }
};
