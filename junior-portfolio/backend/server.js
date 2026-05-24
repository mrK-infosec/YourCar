const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const carRoutes = require('./routes/carRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/cars', carRoutes);

// MongoDB Connection
const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/junior_portfolio';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log(`Connected to MongoDB: ${MONGO_URI}`);
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
    // In case mongo is offline, run anyway so the admin page can be tested
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} (MongoDB offline - expect API errors)`);
    });
  });
