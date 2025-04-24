/**
 * Script to mark some products as featured
 * Run with: node scripts/mark-featured-products.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../src/models/Product');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
    
    // Find some products to mark as featured
    const products = await Product.find().limit(4);
    
    if (products.length === 0) {
      console.log('No products found in the database');
      process.exit(0);
    }
    
    console.log(`Found ${products.length} products to mark as featured`);
    
    // Mark each product as featured
    for (const product of products) {
      product.featured = true;
      await product.save();
      console.log(`Marked product "${product.name}" as featured`);
    }
    
    console.log('Successfully marked products as featured');
    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

connectDB();
