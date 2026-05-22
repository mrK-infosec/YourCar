/**
 * GLOBAL ERROR HANDLING MIDDLEWARE
 * In Express, when an error is thrown inside a route (or passed to next(error)),
 * it ends up here. Instead of crashing the server or displaying raw stack traces
 * to visitors, this captures it and responds with a neat JSON error message.
 */

module.exports = (err, req, res, next) => {
  // Log the detailed error stack in our console for development debugging
  console.error('Unhandled Server Error:', err.stack || err.message || err);

  // Set the HTTP response status code (default to 500 Internal Server Error)
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode || 500;

  // Send a secure JSON response back to the client
  res.status(statusCode).json({
    success: false,
    message: err.message || 'An unexpected server error occurred',
    // Only include stack trace detail in development mode (safety first!)
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};
