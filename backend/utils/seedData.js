/**
 * DATABASE SEEDER SCRIPT
 * This script seeds (populates) our MongoDB database with initial sample car data.
 * When you first install the app, running 'npm run seed' will run this file.
 * This guarantees you have 6 high-quality cars to test immediately!
 */

// Import database libraries and dotenv to read .env configurations
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Car = require('../models/Car');

// Load environment variables from our .env file (so we get MONGODB_URI)
dotenv.config();

// The 6 premium demo cars we want to insert as specified in requirements
const demoCars = [
  {
    name: 'Mercedes-Benz 450D',
    brand: 'Mercedes-Benz',
    price: 85000,
    imageUrl: 'https://picsum.photos/id/111/400/300',
    description: 'Experience pure luxury and dynamic diesel performance. The Mercedes-Benz S-Class 450D represents the pinnacle of executive saloon comfort and state-of-the-art safety technology.',
    seats: 4,
    luggage: 3,
    category: 'First Class',
    inStock: true
  },
  {
    name: 'Mercedes E-Class',
    brand: 'Mercedes-Benz',
    price: 72000,
    imageUrl: 'https://picsum.photos/id/112/400/300',
    description: 'The luxury business standard. Blending modern interior aesthetics with incredibly spacious seating and a refined hybrid engine perfect for premium passenger transit.',
    seats: 6,
    luggage: 4,
    category: 'Business Class',
    inStock: true
  },
  {
    name: 'Mercedes GLS',
    brand: 'Mercedes-Benz',
    price: 95000,
    imageUrl: 'https://picsum.photos/id/113/400/300',
    description: 'The S-Class of SUVs. Exceptional size, incredible commanding presence, and a high-fidelity suspension capable of seating passengers in absolute luxury across any terrain.',
    seats: 4,
    luggage: 5,
    category: 'SUV',
    inStock: true
  },
  {
    name: 'BMW X5',
    brand: 'BMW',
    price: 78000,
    imageUrl: 'https://picsum.photos/id/114/400/300',
    description: 'Sports Activity Vehicle excellence. Agile performance, athletic design, and a luxury cockpit that provides intuitive driving support alongside ample travel space.',
    seats: 5,
    luggage: 4,
    category: 'SUV',
    inStock: true
  },
  {
    name: 'Audi A8',
    brand: 'Audi',
    price: 89000,
    imageUrl: 'https://picsum.photos/id/115/400/300',
    description: 'Sophisticated technological elegance. Featuring predictive active suspension, handcrafted luxury upholstery, and quattro permanent all-wheel drive for a supreme ride.',
    seats: 4,
    luggage: 3,
    category: 'First Class',
    inStock: true
  },
  {
    name: 'Tesla Model 3',
    brand: 'Tesla',
    price: 65000,
    imageUrl: 'https://picsum.photos/id/116/400/300',
    description: 'The future of modern electric transit. Incredible instant torque, minimalist aesthetic interior, autopilot navigation assists, and standard-setting active energy efficiency.',
    seats: 4,
    luggage: 2,
    category: 'Economy',
    inStock: true
  }
];

// Async function to run the seed actions
const seedDatabase = async () => {
  try {
    // 1. Check if the database URI is provided
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in the backend/.env file!');
    }

    console.log('Connecting to MongoDB database...');
    // 2. Open connection to our MongoDB database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Database connected successfully!');

    // 3. Clear any existing cars from the collection to avoid duplicate copies
    console.log('Clearing existing cars from database...');
    await Car.deleteMany({});
    console.log('Cleared existing car collections successfully.');

    // 4. Insert the new 6 premium demo cars into the database
    console.log('Inserting 6 premium demo cars into the database...');
    const insertedCars = await Car.insertMany(demoCars);
    console.log(`Successfully seeded ${insertedCars.length} cars into MongoDB!`);
    
    // Print the inserted cars so we can see their generated Mongo ObjectIDs
    insertedCars.forEach(car => {
      console.log(`- [${car.category}] ${car.name} (ID: ${car._id})`);
    });

    // 5. Safely close database connection and exit script
    console.log('Database seeding complete. Closing connection...');
    await mongoose.connection.close();
    console.log('Connection closed. Exiting process safely.');
    process.exit(0);

  } catch (error) {
    // Catch and print any connection or seeding errors
    console.error('Error during database seeding process:', error.message);
    process.exit(1);
  }
};

// Execute the database seeder trigger
seedDatabase();
