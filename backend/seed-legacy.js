const mongoose = require('mongoose');
require('dotenv').config({ path: './.env.example' }); // using .example or hardcoding URI

// Hardcode URI just in case .env isn't loaded correctly
const MONGODB_URI = 'mongodb://127.0.0.1:27017/timgad-motors';

const Car = require('./models/Car');

const carsToSeed = [
  {
    name: 'G63 AMG V8 BiTurbo',
    brand: 'Mercedes-Benz',
    model: 'G-Class',
    year: 2024,
    price: 850000,
    marketPrice: 900000,
    marketTrend: 'up',
    location: 'Dubai, UAE',
    category: 'SUV',
    seats: 5,
    luggage: 4,
    inStock: true,
    imageUrl: 'https://images.unsplash.com/photo-1520031441872-265e4ff70366?auto=format&fit=crop&q=80&w=1000',
    description: 'The iconic G-Class AMG. Combining unbelievable luxury with off-road capability. Features a handcrafted AMG 4.0L V8 biturbo engine.'
  },
  {
    name: 'Model S Plaid',
    brand: 'Tesla',
    model: 'Model S',
    year: 2023,
    price: 450000,
    marketPrice: 470000,
    marketTrend: 'stable',
    location: 'Abu Dhabi, UAE',
    category: 'First Class',
    seats: 5,
    luggage: 3,
    inStock: true,
    imageUrl: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=1000',
    description: 'The fastest accelerating production car. Tri-motor all-wheel drive, carbon fiber spoilers, and an immersive cinematic display.'
  },
  {
    name: 'S-Class S500',
    brand: 'Mercedes-Benz',
    model: 'S-Class',
    year: 2024,
    price: 650000,
    marketPrice: 620000,
    marketTrend: 'down',
    location: 'Dubai, UAE',
    category: 'Business Class',
    seats: 4,
    luggage: 3,
    inStock: true,
    imageUrl: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&q=80&w=1000',
    description: 'The absolute pinnacle of business class sedans. Executive seating, active ambient lighting, and MBUX augmented reality.'
  },
  {
    name: 'Patrol Y62 V8 LE',
    brand: 'Nissan',
    model: 'Patrol',
    year: 2023,
    price: 280000,
    marketPrice: 280000,
    marketTrend: 'stable',
    location: 'Sharjah, UAE',
    category: 'SUV',
    seats: 8,
    luggage: 6,
    inStock: true,
    imageUrl: 'https://images.unsplash.com/photo-1550346387-9bb329b35bfa?auto=format&fit=crop&q=80&w=1000',
    description: 'The hero of the UAE. An unstoppable V8 SUV that provides incredible space, power, and commanding road presence.'
  },
  {
    name: 'Camry Hybrid XLE',
    brand: 'Toyota',
    model: 'Camry',
    year: 2024,
    price: 135000,
    marketPrice: 140000,
    marketTrend: 'up',
    location: 'Dubai, UAE',
    category: 'Economy',
    seats: 5,
    luggage: 2,
    inStock: true,
    imageUrl: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fd?auto=format&fit=crop&q=80&w=1000',
    description: 'The smartest daily driver. Extreme reliability, amazing fuel efficiency with the hybrid engine, and a surprisingly premium interior.'
  },
  {
    name: '911 Turbo S',
    brand: 'Porsche',
    model: '911',
    year: 2024,
    price: 950000,
    marketPrice: 980000,
    marketTrend: 'up',
    location: 'Dubai, UAE',
    category: 'First Class',
    seats: 2,
    luggage: 1,
    inStock: true,
    imageUrl: 'https://images.unsplash.com/photo-1503376712344-c8c3603dcf3e?auto=format&fit=crop&q=80&w=1000',
    description: 'The ultimate everyday supercar. Unmatched German engineering delivering brutal acceleration and perfect cornering dynamics.'
  }
];

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('🔗 Connected to MongoDB at', MONGODB_URI);
    
    // Clear existing cars
    console.log('🧹 Clearing existing inventory...');
    await Car.deleteMany({});
    
    // Seed new cars
    console.log('🌱 Seeding premium fleet...');
    await Car.insertMany(carsToSeed);
    
    console.log(`✅ Successfully seeded ${carsToSeed.length} vehicles!`);
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  });
