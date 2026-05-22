/**
 * ORDER ROUTING MAP
 * This file maps incoming URLs (e.g. POST /api/orders) to specific functions
 * inside the "orderController". It handles public checkouts and tracking,
 * and secures administrative order history inquiries.
 */

// Import Express Router and controller methods
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Import JWT authentication middleware
const protect = require('../middleware/auth');

// Import express-validator checking rules
const { validateOrder } = require('../utils/validation');

/**
 * -------------------------------------------------------------
 * Public Pathways (Access: Open to anyone)
 * -------------------------------------------------------------
 */

// URL: POST /api/orders -> Process a new customer purchase checkout
// Runs input validation before calling the controller!
router.post('/orders', validateOrder, orderController.createOrder);

// URL: GET /api/orders/:id -> Fetch tracking details of a single order
router.get('/orders/:id', orderController.getOrderStatus);

/**
 * -------------------------------------------------------------
 * Administrative Pathways (Access: Requires valid Admin JWT Token)
 * -------------------------------------------------------------
 */

// URL: GET /api/admin/orders -> Fetch all customer orders (newest first)
router.get('/admin/orders', protect, orderController.getAllOrders);

// URL: PUT /api/admin/orders/:id/status -> Update order delivery phase
router.put('/admin/orders/:id/status', protect, orderController.updateOrderStatus);

// Export the router so it can be mounted in server.js
module.exports = router;
