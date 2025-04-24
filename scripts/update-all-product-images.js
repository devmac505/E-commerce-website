/**
 * Script to update all product images in the database to use consistent naming
 * Run with: node scripts/update-all-product-images.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../src/models/Product');

// Function to convert product name to image path
const getProductImagePath = (productName) => {
  if (!productName) return '/images/products/product-placeholder.svg';
  
  // Convert to lowercase, replace spaces with hyphens, and add jpg extension
  const formattedName = productName.toLowerCase().replace(/\s+/g, '-');
  return `/images/products/${formattedName}.jpg`;
};

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
    
    // Get all products
    const products = await Product.find();
    console.log(`Found ${products.length} products in the database`);
    
    // Update each product's images
    let updatedCount = 0;
    
    for (const product of products) {
      const imagePath = getProductImagePath(product.name);
      
      // Update the product's images array
      product.images = [imagePath];
      await product.save();
      
      console.log(`Updated ${product.name} with image: ${imagePath}`);
      updatedCount++;
    }
    
    console.log(`Successfully updated ${updatedCount} products with consistent image paths`);
    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

connectDB();
