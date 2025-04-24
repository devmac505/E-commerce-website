/**
 * Script to update product images in the database
 * Run with: node scripts/update-product-images.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../src/models/Product');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
    
    // Update Pro Runner X1
    await Product.findOneAndUpdate(
      { name: 'Pro Runner X1' },
      { images: ['/images/products/pro-runner-x1.jpg'] }
    );
    console.log('Updated Pro Runner X1 image');
    
    // Update Court Master Elite
    await Product.findOneAndUpdate(
      { name: 'Court Master Elite' },
      { images: ['/images/products/court-master-elite.jpg'] }
    );
    console.log('Updated Court Master Elite image');
    
    // Update Urban Walker
    await Product.findOneAndUpdate(
      { name: 'Urban Walker' },
      { images: ['/images/products/urban-walker.jpg'] }
    );
    console.log('Updated Urban Walker image');
    
    // Update Classic Canvas
    await Product.findOneAndUpdate(
      { name: 'Classic Canvas' },
      { images: ['/images/products/classic-canvas.jpg'] }
    );
    console.log('Updated Classic Canvas image');
    
    console.log('All product images updated successfully');
    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

connectDB();
