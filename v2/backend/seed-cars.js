const http = require('http');

const BASE_URL = 'http://localhost:5000';

const cars = [
  {
    brand: 'Nissan',
    model: 'Patrol Y62 V8',
    year: 2023,
    price: 275000,
    mileage: 15000,
    location: 'Dubai',
    imageUrl: 'https://images.unsplash.com/photo-1550346387-9bb329b35bfa?auto=format&fit=crop&q=80&w=1000',
    conditionScore: 95,
    priceScore: 85,
    demandScore: 98,
    trustScore: 90,
  },
  {
    brand: 'Toyota',
    model: 'Land Cruiser LC300',
    year: 2024,
    price: 320000,
    mileage: 5000,
    location: 'Abu Dhabi',
    imageUrl: 'https://images.unsplash.com/photo-1582236287930-d30e5f49e4d6?auto=format&fit=crop&q=80&w=1000',
    conditionScore: 98,
    priceScore: 80,
    demandScore: 99,
    trustScore: 95,
  },
  {
    brand: 'Tesla',
    model: 'Model 3 Long Range',
    year: 2023,
    price: 155000,
    mileage: 12000,
    location: 'Dubai',
    imageUrl: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=1000',
    conditionScore: 92,
    priceScore: 90,
    demandScore: 88,
    trustScore: 85,
  },
  {
    brand: 'Mercedes-Benz',
    model: 'G63 AMG',
    year: 2022,
    price: 750000,
    mileage: 25000,
    location: 'Dubai',
    imageUrl: 'https://images.unsplash.com/photo-1520031441872-265e4ff70366?auto=format&fit=crop&q=80&w=1000',
    conditionScore: 90,
    priceScore: 70,
    demandScore: 95,
    trustScore: 98,
  },
  {
    brand: 'Hyundai',
    model: 'Tucson',
    year: 2021,
    price: 72000,
    mileage: 55000,
    location: 'Sharjah',
    imageUrl: 'https://images.unsplash.com/photo-1632733711679-529326f6db12?auto=format&fit=crop&q=80&w=1000',
    conditionScore: 80,
    priceScore: 88,
    demandScore: 75,
    trustScore: 80,
  },
  {
    brand: 'Porsche',
    model: '911 Carrera S',
    year: 2021,
    price: 420000,
    mileage: 22000,
    location: 'Dubai',
    imageUrl: 'https://images.unsplash.com/photo-1503376712344-c8c3603dcf3e?auto=format&fit=crop&q=80&w=1000',
    conditionScore: 94,
    priceScore: 75,
    demandScore: 85,
    trustScore: 90,
  }
];

function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = `${BASE_URL}${path}`;
    const options = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(url, options, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => {
        responseBody += chunk;
      });
      res.on('end', () => {
        try {
          resolve(JSON.parse(responseBody));
        } catch (e) {
          resolve(responseBody);
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function seedCars() {
  console.log('🌱 Seeding Product Intelligence Engine with Realistic UAE Cars...\n');
  
  for (const car of cars) {
    try {
      const res = await makeRequest('POST', '/api/cars', car);
      if (res && res.success) {
        console.log(`✅ Seeded: ${car.brand} ${car.model}`);
        console.log(`   - Price: AED ${car.price.toLocaleString()}`);
        console.log(`   - Computed Value Score: ${res.data.valueScore} / 100\n`);
      } else {
        console.error(`❌ Failed to seed ${car.brand}:`, res);
      }
    } catch (err) {
      console.error(`❌ Network error while seeding ${car.brand}:`, err.message);
    }
  }
  
  console.log('🎉 Seeding Complete! You can now query /api/cars');
}

seedCars();
