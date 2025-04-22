require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./src/models/Product');
const Category = require('./src/models/Category');

async function checkDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    console.log('MONGODB_URI:', process.env.MONGODB_URI);
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully!');
    
    // Check for products
    const productCount = await Product.countDocuments();
    console.log(`Total products in database: ${productCount}`);
    
    if (productCount > 0) {
      const products = await Product.find().populate('category');
      console.log('Sample product:');
      console.log(JSON.stringify(products[0], null, 2));
    }
    
    // Check for categories
    const categoryCount = await Category.countDocuments();
    console.log(`Total categories in database: ${categoryCount}`);
    
    if (categoryCount > 0) {
      const categories = await Category.find();
      console.log('Categories:');
      console.log(JSON.stringify(categories, null, 2));
    }
    
    mongoose.disconnect();
    console.log('MongoDB disconnected');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkDatabase();
