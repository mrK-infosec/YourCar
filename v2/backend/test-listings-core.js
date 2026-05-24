/**
 * Phase 2 Core Product Engine & Listing Core Integration Test Suite
 * Compares actual API responses against business logic requirements.
 */

const http = require('http');

const BASE_URL = 'http://localhost:5000';

function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = `${BASE_URL}${path}`;
    const options = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'X-Request-ID': `test-trace-${Math.random().toString(36).substring(7)}`,
      },
    };

    const req = http.request(url, options, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => {
        responseBody += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseBody);
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: parsed,
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: responseBody,
          });
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

async function runTests() {
  console.log('================================================================');
  console.log(' STARTING PHASE 2 INTEGRATION AND PRODUCT ENGINE GATED TESTS');
  console.log('================================================================\n');

  let testCount = 0;
  let successCount = 0;

  function assert(condition, message) {
    testCount++;
    if (condition) {
      console.log(`[PASS] ${message}`);
      successCount++;
    } else {
      console.error(`[FAIL] ${message}`);
    }
  }

  try {
    // ---------------------------------------------------------
    // TEST 1: Zod Input Validation Layer & Standard Error Format
    // ---------------------------------------------------------
    console.log('--- TEST 1: Input Validation & Standardized Errors ---');
    const invalidCarPayload = {
      brand: 'T', // less than 2 chars
      model: '', // empty
      year: 1800, // invalid year
      price: -500, // negative price
      mileage: -100, // negative mileage
      location: 'DXB',
      imageUrl: 'not-a-url',
      conditionScore: 150, // out of range
      priceScore: 80,
      demandScore: 80,
      trustScore: 85,
    };

    const valResponse = await makeRequest('POST', '/api/cars', invalidCarPayload);
    assert(valResponse.statusCode === 400, 'Reject creation of invalid car payload');
    assert(valResponse.body.success === false, 'Error response uses standard success: false format');
    assert(valResponse.body.error.code === 'VALIDATION_ERROR', 'Error envelope code is VALIDATION_ERROR');
    assert(valResponse.body.error.details && valResponse.body.error.details.length > 0, 'Details specify exact validation failures');
    console.log(`Validation details captured:`, valResponse.body.error.details);

    console.log('');

    // ---------------------------------------------------------
    // TEST 2: CRUD Creation & Product Intelligence valueScore
    // ---------------------------------------------------------
    console.log('--- TEST 2: Listing CRUD Creation & Value score calculations ---');
    
    // Average Car
    const toyotaPayload = {
      brand: 'Toyota',
      model: 'Camry',
      year: 2022,
      price: 75000,
      mileage: 40000, // 2 years old, expected is 40,000. mileageRatio = 1.0, efficiencyScore = 50.
      location: 'Dubai',
      imageUrl: 'https://images.com/camry.jpg',
      conditionScore: 80, // Condition weight = 0.15 => 12
      priceScore: 80, // Price weight = 0.35 => 28
      demandScore: 70, // Demand weight = 0.15 => 10.5
      trustScore: 85, // Trust weight = 0.25 => 21.25
      // Efficiency weight = 0.10 => 5
      // Calculated Score: 28 + 21.25 + 10.5 + 12 + 5 = 76.75 => Round to 77.
    };

    // High Value Car (low mileage, new, verified high scores)
    const teslaPayload = {
      brand: 'Tesla',
      model: 'Model 3',
      year: 2024,
      price: 135000,
      mileage: 8000, // 2 years old, expected 40k. Actual is 8k. mileageRatio = 5.0, efficiencyScore = 100.
      location: 'Abu Dhabi',
      imageUrl: 'https://images.com/tesla.jpg',
      conditionScore: 95, // 0.15 => 14.25
      priceScore: 90, // 0.35 => 31.5
      demandScore: 90, // 0.15 => 13.5
      trustScore: 95, // 0.25 => 23.75
      // Efficiency weight = 0.10 => 10
      // Calculated: 31.5 + 23.75 + 13.5 + 14.25 + 10 = 93.
    };

    // Low Value Car (over-priced, high mileage, older, unverified)
    const sunnyPayload = {
      brand: 'Nissan',
      model: 'Sunny',
      year: 2018,
      price: 45000,
      mileage: 180000, // 8 years old, expected 160k. Actual is 180k. mileageRatio = 0.88, efficiencyScore = 44.
      location: 'Sharjah',
      imageUrl: 'https://images.com/sunny.jpg',
      conditionScore: 40, // 0.15 => 6
      priceScore: 35, // 0.35 => 12.25
      demandScore: 30, // 0.15 => 4.5
      trustScore: 50, // 0.25 => 12.5
      // Efficiency weight = 0.10 => 4.4 => 4
      // Calculated: 12.25 + 12.5 + 4.5 + 6 + 4.4 = 39.65 => Round to 40.
    };

    const resToyota = await makeRequest('POST', '/api/cars', toyotaPayload);
    assert(resToyota.statusCode === 201, 'Successfully created Toyota Camry');
    assert(resToyota.body.success === true, 'Response payload has success: true');
    assert(resToyota.body.data.valueScore > 0, `Toyota Camry valueScore computed on pre-save hook: ${resToyota.body.data.valueScore}`);
    
    const resTesla = await makeRequest('POST', '/api/cars', teslaPayload);
    assert(resTesla.statusCode === 201, 'Successfully created Tesla Model 3');
    
    const resSunny = await makeRequest('POST', '/api/cars', sunnyPayload);
    assert(resSunny.statusCode === 201, 'Successfully created Nissan Sunny');

    const toyotaId = resToyota.body.data._id;
    const teslaId = resTesla.body.data._id;
    const sunnyId = resSunny.body.data._id;

    assert(resTesla.body.data.valueScore > resToyota.body.data.valueScore, 'High quality car receives a higher valueScore than average car');
    assert(resToyota.body.data.valueScore > resSunny.body.data.valueScore, 'Average car receives a higher valueScore than poor deal car');
    console.log(`Computed Scores: Tesla: ${resTesla.body.data.valueScore} | Toyota: ${resToyota.body.data.valueScore} | Nissan: ${resSunny.body.data.valueScore}`);
    console.log('');

    // ---------------------------------------------------------
    // TEST 3: Smart Sorting & Projections
    // ---------------------------------------------------------
    console.log('--- TEST 3: Smart Default Value Sorting & Projection Limits ---');
    const indexResponse = await makeRequest('GET', '/api/cars');
    assert(indexResponse.statusCode === 200, 'Successfully fetched fleet listings');
    assert(indexResponse.body.data.cars.length === 3, 'Index returned all three listed cars');
    
    const firstCar = indexResponse.body.data.cars[0];
    const secondCar = indexResponse.body.data.cars[1];
    const thirdCar = indexResponse.body.data.cars[2];

    assert(firstCar.brand === 'Tesla', 'Default order returns high-value score first (Tesla)');
    assert(secondCar.brand === 'Toyota', 'Default order returns average car second (Toyota)');
    assert(thirdCar.brand === 'Nissan', 'Default order returns low-value car last (Nissan)');
    assert(firstCar.__v === undefined && firstCar.createdAt === undefined, 'Enforces data projections to hide __v and timestamps from list endpoints');
    console.log('');

    // ---------------------------------------------------------
    // TEST 4: Advanced Filtering System (Indexed Query Performance checks)
    // ---------------------------------------------------------
    console.log('--- TEST 4: Advanced Filtering &Typo/Keyword Search ---');
    
    // Test Brand filter
    const brandFilter = await makeRequest('GET', '/api/cars?brand=Tesla');
    assert(brandFilter.body.data.cars.length === 1 && brandFilter.body.data.cars[0].brand === 'Tesla', 'Filters correctly by brand');

    // Test Location filter
    const locationFilter = await makeRequest('GET', '/api/cars?location=Dubai');
    assert(locationFilter.body.data.cars.length === 1 && locationFilter.body.data.cars[0].location === 'Dubai', 'Filters correctly by UAE location (Dubai)');

    // Test Price range filter
    const rangeFilter = await makeRequest('GET', '/api/cars?minPrice=50000&maxPrice=100000');
    assert(rangeFilter.body.data.cars.length === 1 && rangeFilter.body.data.cars[0].brand === 'Toyota', 'Filters correctly by minPrice and maxPrice ranges');

    // Test Typo-tolerant partial matching keyword search
    const keywordSearch = await makeRequest('GET', '/api/cars?search=Sun');
    assert(keywordSearch.body.data.cars.length === 1 && keywordSearch.body.data.cars[0].model === 'Sunny', 'Search supports partial string keyword matching (Sunny)');
    console.log('');

    // ---------------------------------------------------------
    // TEST 5: Pagination Safety (Max limit cap)
    // ---------------------------------------------------------
    console.log('--- TEST 5: Pagination Security Boundaries ---');
    const paginatedResponse = await makeRequest('GET', '/api/cars?limit=100&page=1');
    assert(paginatedResponse.body.data.limit === 50, 'Enforces pagination limit cap at 50 max to prevent unbound query overhead');
    console.log('');

    // ---------------------------------------------------------
    // TEST 6: Best Deals Cached Endpoint
    // ---------------------------------------------------------
    console.log('--- TEST 6: Best Deals Cached Cache-aside Endpoint ---');
    const startFetch1 = Date.now();
    const deals1 = await makeRequest('GET', '/api/cars/best-deals?limit=2');
    const timeFetch1 = Date.now() - startFetch1;

    assert(deals1.body.data.length === 2, 'Returns exactly requested limit (2)');
    assert(deals1.body.data[0].brand === 'Tesla', 'Best deals returns top-ranked items first');

    const startFetch2 = Date.now();
    const deals2 = await makeRequest('GET', '/api/cars/best-deals?limit=2');
    const timeFetch2 = Date.now() - startFetch2;

    console.log(`First Fetch (DB query/Cache Miss): ${timeFetch1}ms`);
    console.log(`Second Fetch (Cache Hit): ${timeFetch2}ms`);
    assert(timeFetch2 <= timeFetch1, 'Subsequent fetches are faster or instant due to Cache-aside hit');
    console.log('');

    // ---------------------------------------------------------
    // TEST 7: Detail view, Updates, Re-Ranking, and Deletions
    // ---------------------------------------------------------
    console.log('--- TEST 7: Detail View, Updates & Score Re-ranking ---');
    
    // Detail view
    const detailRes = await makeRequest('GET', `/api/cars/${toyotaId}`);
    assert(detailRes.statusCode === 200, 'Fetches single car details by ID successfully');
    assert(detailRes.body.data.brand === 'Toyota', 'Details payload matches requested car');

    // Update & Recalculate
    const oldScore = resToyota.body.data.valueScore;
    const updateRes = await makeRequest('PUT', `/api/cars/${toyotaId}`, {
      priceScore: 98, // Greatly improve price competitiveness score
      trustScore: 98, // Dealer trust increases
    });

    assert(updateRes.statusCode === 200, 'Listing updated successfully');
    assert(updateRes.body.data.valueScore > oldScore, `Automatic recalculation of valueScore on update works. Old: ${oldScore} | New: ${updateRes.body.data.valueScore}`);

    // Deletion
    const deleteRes = await makeRequest('DELETE', `/api/cars/${sunnyId}`);
    assert(deleteRes.statusCode === 200 && deleteRes.body.data.message.includes('removed'), 'Car deleted successfully');

    const checkDelete = await makeRequest('GET', `/api/cars/${sunnyId}`);
    assert(checkDelete.statusCode === 404, 'Querying deleted car returns 404 Not Found as expected');
    console.log('');

    console.log('================================================================');
    console.log(` TESTS COMPLETED: ${successCount} / ${testCount} PASSED SUCCESSFULLY`);
    console.log('================================================================');
    
    if (successCount === testCount) {
      console.log('\x1b[32m%s\x1b[0m', ' ALL CORE PRODUCT INTEGRATION TESTS PASSED WITHOUT ISSUES!');
      process.exit(0);
    } else {
      console.error('\x1b[31m%s\x1b[0m', ' SOME INTEGRATION TESTS ENCOUNTERED FAILURES.');
      process.exit(1);
    }

  } catch (err) {
    console.error('Fatal testing exception encountered:', err.message);
    process.exit(1);
  }
}

runTests();
