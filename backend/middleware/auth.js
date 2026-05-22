/**
 * AUTHORIZATION MIDDLEWARE (JWT Protection)
 * This middleware function intercepts incoming API requests to protected routes.
 * It reads the "Authorization" header, extracts the JSON Web Token (JWT),
 * and verifies it. If valid, the user is allowed to proceed.
 * If missing or invalid, we stop the request and return a 401 Unauthorized status.
 */

// Import the jsonwebtoken library to verify digital signatures
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // 1. Get the Authorization header from the request headers
    const authHeader = req.headers.authorization;
    
    // 2. Check if the header is missing or doesn't start with "Bearer "
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No authentication token provided.'
      });
    }

    // 3. Extract the token value (split "Bearer <token>" and take the second part)
    const token = authHeader.split(' ')[1];

    // 4. Verify the token using our secret key defined in backend/.env
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // 5. Attach the decoded user data from the token directly to the request object
    // This allows subsequent controller functions to see who made the call
    req.admin = decodedToken;

    // 6. Call next() to allow the request to proceed to the controller!
    next();

  } catch (error) {
    // If jwt.verify fails (e.g. token expired, or key didn't match), it throws an error
    console.error('JWT Verification Error:', error.message);
    
    return res.status(401).json({
      success: false,
      message: 'Access denied. Invalid or expired token.'
    });
  }
};
