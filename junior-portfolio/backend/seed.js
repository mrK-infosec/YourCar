const mongoose = require('mongoose');
const Car = require('./models/Car');

const MONGO_URI = 'mongodb://localhost:27017/junior_portfolio';

const cars = [
  {
    brand: 'Toyota',
    model: 'Camry',
    year: 2023,
    price: 25000,
    mileage: 5000,
    location: 'Dubai',
    condition: 'used',
    images: ['https://images.unsplash.com/photo-1621007947382-bb3c3994e3fd?auto=format&fit=crop&q=80&w=1000']
  },
  {
    brand: 'Nissan',
    model: 'Patrol',
    year: 2024,
    price: 75000,
    mileage: 0,
    location: 'Abu Dhabi',
    condition: 'new',
    images: ['https://images.unsplash.com/photo-1550346387-9bb329b35bfa?auto=format&fit=crop&q=80&w=1000']
  },
  {
    brand: 'Honda',
    model: 'Civic',
    year: 2022,
    price: 22000,
    mileage: 15000,
    location: 'Sharjah',
    condition: 'used',
    images: ['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1000']
  },
  {
    brand: 'Mercedes-Benz',
    model: 'G-Class',
    year: 2023,
    price: 150000,
    mileage: 2000,
    location: 'Dubai',
    condition: 'used',
    images: ['https://images.unsplash.com/photo-1520031441872-265e4ff70366?auto=format&fit=crop&q=80&w=1000']
  },
  {
    brand: 'Hyundai',
    model: 'Tucson',
    year: 2024,
    price: 28000,
    mileage: 0,
    location: 'Dubai',
    condition: 'new',
    images: ['https://images.unsplash.com/photo-1632733711679-529326f6db12?auto=format&fit=crop&q=80&w=1000']
  }
];

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB. Clearing existing data...');
    await Car.deleteMany({});
    
    console.log('Seeding cars...');
    await Car.insertMany(cars);
    
    console.log('Database successfully seeded!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error seeding database:', err);
    process.exit(1);
  });
