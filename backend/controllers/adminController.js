/**
 * ADMIN CONTROLLER
 * This file handles administrator authentication.
 * Since we only have a single administrator account (admin@revora.com),
 * we verify credentials directly and securely using bcryptjs and
 * issue a signed JSON Web Token (JWT) to authenticate future sessions.
 */

// Import bcryptjs for password validation and jsonwebtoken for token creation
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Admin credentials are now securely loaded from environment variables
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@revora.com';
const HASHED_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD_HASH;

/**
 * @desc    Authenticate Administrator & Get JWT Token
 * @route   POST /api/admin/login
 * @access  Public
 */
exports.adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Verify that the email matches our admin email from env
    if (email !== ADMIN_EMAIL) {
      res.status(401); // Unauthorized status code
      throw new Error('Invalid administrative email or password');
    }

    if (!HASHED_ADMIN_PASSWORD) {
      res.status(500);
      throw new Error('Server configuration error: Admin password hash is missing.');
    }

    // 2. Securely check if the input password matches our cryptographically hashed password
    const isPasswordMatch = await bcrypt.compare(password, HASHED_ADMIN_PASSWORD);
    
    // If password does not match, return 401 Unauthorized
    if (!isPasswordMatch) {
      res.status(401);
      throw new Error('Invalid administrative email or password');
    }

    // 3. Generate a secure, signed JSON Web Token (JWT)
    // The payload contains the admin's email and role
    const token = jwt.sign(
      { email: ADMIN_EMAIL, role: 'admin' }, // Data inside the token
      process.env.JWT_SECRET,                      // Secret key to sign the token
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' } // Token lifespan
    );

    // 4. Return success and the token to the client.
    // The client will save this token and send it in the header of future requests!
    res.status(200).json({
      success: true,
      message: 'Administrator authentication successful!',
      token: token,
      admin: {
        email: ADMIN_EMAIL,
        role: 'admin'
      }
    });

  } catch (error) {
    next(error);
  }
};
