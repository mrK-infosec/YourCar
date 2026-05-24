/**
 * MAIN SERVER INITIALIZATION FILE (Revora API Backend)
 * This is the central entrypoint of our backend application.
 * It boots up Express, establishes MongoDB connections, applies robust
 * middleware security layers (Helmet, CORS, rate limits, XSS/NoSQL mitigations),
 * registers our API routes, and serves the health checks.
 */

// 1. Core Node and External Libraries Imports
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const dotenv = require('dotenv');

// 2. Custom Route and Middleware Imports
const authRoutes = require('./routes/authRoutes');
const carRoutes = require('./routes/carRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const errorHandler = require('./middleware/errorHandler');

// 3. Environment variables configuration
// Loads variables from backend/.env into process.env so we can access JWT keys and DB URLs
dotenv.config();

// Initialize the Express Application
const app = express();

// Determine the active port (default to 5000 if not configured in .env)
const PORT = process.env.PORT || 5000;

// 4. DATABASE CONNECTION
const connectDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI is missing from the environment configuration!');
    }
    
    console.log('Attempting to connect to MongoDB...');
    // Connect to MongoDB database with connection pooling for performance
    await mongoose.connect(mongoUri, { maxPoolSize: 50 });
    console.log('MongoDB connection established successfully!');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    console.log('Warning: Server will continue booting, but database operations will fail.');
  }
};

// Execute database connection
connectDatabase();

// 5. SECURITY MIDDLEWARE LAYERS

// Layer A: Helmet Security Headers
// Helmet helps secure Express apps by setting various HTTP headers (shields against XSS, clickjacking, etc.)
app.use(helmet());

// Layer B: Cross-Origin Resource Sharing (CORS)
// Allows our React app (running on localhost:5173) to securely communicate with this API
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], // Allow request origins from our react dev server
    credentials: true, // Allow cookies to be sent across origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Layer C: Rate Limiting
// Prevents brute-force and Denial of Service (DDoS) requests by limiting API calls per IP address
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 100, // Limit each IP to 100 requests per 15 minutes window
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again after 15 minutes.'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false // Disable the `X-RateLimit-*` headers
});

// Apply the rate limiter to all API calls
app.use('/api/', apiLimiter);

// Layer D: Body Parsers & Cookie Parser
// Allows Express to read incoming JSON payloads (req.body)
app.use(express.json({ limit: '10kb' })); // Max payload size set to 10kb to avoid huge buffer overflow attacks
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
// Allows Express to parse cookie data (useful for storing authentication tokens in secure cookies)
app.use(cookieParser());

// Layer E: NoSQL Injection Sanitization
// Sanitizes incoming user bodies/queries to strip out MongoDB operators (like $gt, $ne)
// which malicious users try to send to bypass authentication or database limits!
app.use(mongoSanitize());

// 6. API ROUTE REGISTRATION

// A. Health check endpoint (easy verification of server uptime)
// URL: GET /api/health
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running!',
    timestamp: new Date(),
    databaseStatus: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// B. Mount Auth, Car, Order, and Admin routes
// This prefixes all internal routing mappings (e.g. GET /cars becomes GET /api/cars)
app.use('/api/auth', authRoutes);
app.use('/api', carRoutes);
app.use('/api', orderRoutes);
app.use('/api', adminRoutes);

// 7. GLOBAL EXCEPTION LOGGER & HANDLER
// If any route encounters an unhandled exception or throws an error, Express passes it here
app.use(errorHandler);

// 8. SERVER LAUNCH
app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(` Revora Express API is booting...`);
  console.log(` Running in [${process.env.NODE_ENV || 'development'}] mode`);
  console.log(` Listening on: http://localhost:${PORT}`);
  console.log(`=========================================`);
});
