/**
 * Script to check all products in the database
 * Run with: node scripts/check-all-products.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../src/models/Product');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
    
    // Count products
    const count = await Product.countDocuments();
    console.log(`Total products in database: ${count}`);
    
    if (count === 0) {
      console.log('No products found in the database');
      process.exit(0);
    }
    
    // Get all products
    const products = await Product.find();
    
    console.log('\nAll products:');
    products.forEach((product, index) => {
      console.log(`\n--- Product ${index + 1} ---`);
      console.log(`Name: ${product.name}`);
      console.log(`SKU: ${product.sku}`);
      console.log(`Base Price: $${product.basePrice}`);
      console.log(`Featured: ${product.featured ? 'Yes' : 'No'}`);
      console.log(`Images: ${product.images.join(', ')}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

connectDB();
