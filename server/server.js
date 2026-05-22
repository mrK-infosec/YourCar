const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Log requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Seed data / Local Fallback Database
const carsSeed = [
  {
    id: 1,
    name: "Mercedes maybach s600",
    class: "FIRST CLASS",
    price: 500,
    seats: "4",
    luggage: "2",
    description: "Prestigious, exclusive, unique and handcrafted. The perfection of the S-Class, blended with the exclusivity of the Maybach, makes the Mercedes-Maybach S-Class the luxurious and technological spearhead of Mercedes-Benz.",
    image: "/static/media/image 3.png"
  },
  {
    id: 2,
    name: "Mercedes G - wagon",
    class: "BUSINESS CLASS",
    price: 400,
    seats: "5",
    luggage: "2",
    description: "The Mercedes-Benz G-Class, sometimes colloquially called the G-Wagen as an abbreviation of Geländewagen is a four-wheel drive automobile manufactured by Magna Steyr formerly Steyr-Daimler-Puch in Austria and sold by Mercedes-Benz.",
    image: "/static/media/image 3-1.png"
  },
  {
    id: 3,
    name: "Mercedes M class",
    class: "SUV",
    price: 250,
    seats: "4",
    luggage: "2",
    description: "The Mercedes-Benz GLE,sometimes colloquially called formerly Mercedes-Benz M-Class designated with the ML nomenclature is a mid-size luxury SUV produced by the German manufacturer Mercedes-Benz.",
    image: "/static/media/image 3-2.png"
  }
];

let dbConnected = false;
let Reservation = null;

// Connect to MongoDB if MONGODB_URI is provided
if (process.env.MONGODB_URI) {
  const mongoose = require('mongoose');
  mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB successfully!");
    dbConnected = true;
    
    // Schema definition
    const reservationSchema = new mongoose.Schema({
      reservationId: String,
      fullName: String,
      email: String,
      rentalDuration: Number,
      vehicles: Array,
      totalAmount: Number,
      createdAt: { type: Date, default: Date.now }
    });
    Reservation = mongoose.model('Reservation', reservationSchema);
  })
  .catch((err) => {
    console.warn("MongoDB connection failed, falling back to Local Memory Store.", err.message);
  });
} else {
  console.log("No MONGODB_URI found, using Local Memory Store.");
}

// Local In-Memory Reservation Database
const localReservations = [];

// API Endpoints
// 1. Get Car Inventory list
app.get('/api/cars', (req, res) => {
  res.json({
    success: true,
    data: carsSeed
  });
});

// 2. Complete Booking Checkout
app.post('/api/checkout', async (req, res) => {
  try {
    const { fullName, email, rentalDuration, cartItems, totalAmount } = req.body;
    
    if (!fullName || !email || !rentalDuration || !cartItems || cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Missing required booking details."
      });
    }

    const reservationId = "YC-" + Math.floor(100000 + Math.random() * 900000);
    const reservationData = {
      reservationId,
      fullName,
      email,
      rentalDuration,
      vehicles: cartItems.map(item => ({ id: item.id, name: item.name, quantity: item.quantity })),
      totalAmount,
      createdAt: new Date()
    };

    if (dbConnected && Reservation) {
      const newReservation = new Reservation(reservationData);
      await newReservation.save();
      console.log(`[DB] Reservation saved: ${reservationId}`);
    } else {
      localReservations.push(reservationData);
      console.log(`[Memory] Reservation saved: ${reservationId}`);
    }

    res.json({
      success: true,
      message: "Booking reservation completed successfully!",
      data: reservationData
    });
  } catch (error) {
    console.error("Checkout processing error:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error occurred during checkout."
    });
  }
});

// 3. Get Reservations (for admin/monitoring)
app.get('/api/reservations', async (req, res) => {
  if (dbConnected && Reservation) {
    const dbRes = await Reservation.find().sort({ createdAt: -1 });
    res.json(dbRes);
  } else {
    res.json(localReservations.slice().reverse());
  }
});

// Serve Frontend Production Assets (MERN Integration)
const buildPath = path.join(__dirname, '../build');
if (fs.existsSync(buildPath)) {
  app.use(express.static(buildPath));
  app.get('*splat', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send("YourCar Express API running. Run 'npm run build' inside client to serve react build assets.");
  });
}

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
