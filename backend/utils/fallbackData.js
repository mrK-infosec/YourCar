const generateFallbackCars = () => {
  const brands = ['Mercedes-Benz', 'Tesla', 'Nissan', 'Toyota', 'Porsche', 'Honda', 'BMW', 'Audi', 'Hyundai', 'Ford'];
  
  const modelsByBrand = {
    'Mercedes-Benz': [{ name: 'G63 AMG', cat: 'SUV' }, { name: 'S-Class', cat: 'Business Class' }, { name: 'C-Class', cat: 'Economy' }],
    'Tesla': [{ name: 'Model S Plaid', cat: 'First Class' }, { name: 'Model 3', cat: 'Economy' }, { name: 'Model X', cat: 'SUV' }],
    'Nissan': [{ name: 'Patrol Y62', cat: 'SUV' }, { name: 'Altima', cat: 'Economy' }, { name: 'GT-R', cat: 'First Class' }],
    'Toyota': [{ name: 'Land Cruiser', cat: 'SUV' }, { name: 'Camry', cat: 'Economy' }, { name: 'Corolla', cat: 'Economy' }],
    'Porsche': [{ name: '911 Turbo S', cat: 'First Class' }, { name: 'Cayenne', cat: 'SUV' }, { name: 'Panamera', cat: 'Business Class' }],
    'Honda': [{ name: 'Civic', cat: 'Economy' }, { name: 'Accord', cat: 'Economy' }, { name: 'CR-V', cat: 'SUV' }],
    'BMW': [{ name: 'M5 Competition', cat: 'First Class' }, { name: 'X5', cat: 'SUV' }, { name: '330i', cat: 'Business Class' }],
    'Audi': [{ name: 'RS e-tron GT', cat: 'First Class' }, { name: 'Q7', cat: 'SUV' }, { name: 'A4', cat: 'Business Class' }],
    'Hyundai': [{ name: 'Elantra', cat: 'Economy' }, { name: 'Tucson', cat: 'SUV' }, { name: 'Sonata', cat: 'Economy' }],
    'Ford': [{ name: 'Mustang', cat: 'First Class' }, { name: 'Explorer', cat: 'SUV' }, { name: 'Focus', cat: 'Economy' }]
  };

  const images = {
    'SUV': 'https://images.unsplash.com/photo-1520031441872-265e4ff70366?auto=format&fit=crop&q=80&w=1000',
    'First Class': 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=1000',
    'Business Class': 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&q=80&w=1000',
    'Economy': 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fd?auto=format&fit=crop&q=80&w=1000'
  };

  const cars = [];
  
  // Seed with predictable pseudo-randomness so the list doesn't shift every refresh
  for (let i = 1; i <= 250; i++) {
    // Basic pseudo-random using index
    const brandIndex = (i * 7) % brands.length;
    const brand = brands[brandIndex];
    
    const models = modelsByBrand[brand];
    const modelIndex = (i * 11) % models.length;
    const modelObj = models[modelIndex];
    const category = modelObj.cat;
    
    // Generate realistic price based on category
    let price = 50000;
    if (category === 'First Class') price = 300000 + ((i * 1000) % 200000);
    if (category === 'SUV') price = 150000 + ((i * 1500) % 150000);
    if (category === 'Business Class') price = 100000 + ((i * 500) % 100000);
    if (category === 'Economy') price = 40000 + ((i * 200) % 40000);

    cars.push({
      _id: `mock_car_${i}`,
      name: `${brand} ${modelObj.name}`,
      brand: brand,
      model: modelObj.name,
      year: 2020 + (i % 5),
      price: price,
      category: category,
      seats: category === 'SUV' ? 7 : 5,
      luggage: category === 'SUV' ? 5 : 2,
      inStock: (i % 10) !== 0, // 90% in stock
      imageUrl: images[category],
      description: `Premium ${category} vehicle from ${brand}, delivering superior reliability and comfort.`
    });
  }
  return cars;
};

module.exports = { generateFallbackCars };
