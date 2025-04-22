require('dotenv').config();
const http = require('http');

// Function to make a GET request to the API
function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: process.env.PORT || 4000,
      path: path,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    console.log(`Making request to: http://${options.hostname}:${options.port}${options.path}`);

    const req = http.request(options, (res) => {
      console.log(`STATUS: ${res.statusCode}`);
      console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
      
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log('Response received');
        try {
          const parsedData = JSON.parse(data);
          resolve(parsedData);
        } catch (e) {
          console.error('Error parsing JSON:', e);
          console.log('Raw response:', data);
          reject(e);
        }
      });
    });
    
    req.on('error', (e) => {
      console.error(`Request error: ${e.message}`);
      reject(e);
    });
    
    req.end();
  });
}

// Test the products API
async function testProductsAPI() {
  try {
    console.log('Testing /api/products endpoint...');
    const productsResponse = await makeRequest('/api/products');
    console.log('Products API Response:');
    console.log(JSON.stringify(productsResponse, null, 2));
    
    if (productsResponse.success) {
      console.log(`Found ${productsResponse.data.length} products`);
    } else {
      console.log('API returned success: false');
    }
  } catch (error) {
    console.error('Error testing products API:', error);
  }
}

// Test the categories API
async function testCategoriesAPI() {
  try {
    console.log('\nTesting /api/categories endpoint...');
    const categoriesResponse = await makeRequest('/api/categories');
    console.log('Categories API Response:');
    console.log(JSON.stringify(categoriesResponse, null, 2));
    
    if (categoriesResponse.success) {
      console.log(`Found ${categoriesResponse.data.length} categories`);
    } else {
      console.log('API returned success: false');
    }
  } catch (error) {
    console.error('Error testing categories API:', error);
  }
}

// Run the tests
async function runTests() {
  await testProductsAPI();
  await testCategoriesAPI();
  console.log('\nAPI tests completed');
}

runTests();
