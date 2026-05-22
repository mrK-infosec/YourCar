/**
 * ADMIN AUTHENTICATION ROUTING MAP
 * This file maps administrative authentication requests (e.g. POST /api/admin/login)
 * to the "adminController" for verification and token generation.
 */

// Import Express Router and controller methods
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Import express-validator login check rules
const { validateLogin } = require('../utils/validation');

// URL: POST /api/admin/login -> Verify admin credentials and get a JWT token
// Runs validation rules first to protect from common SQL/NoSQL injections!
router.post('/admin/login', validateLogin, adminController.adminLogin);

// Export the router so it can be mounted in server.js
module.exports = router;
