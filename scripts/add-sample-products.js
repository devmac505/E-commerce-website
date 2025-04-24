/**
 * Script to add sample products to the database
 * Run with: node scripts/add-sample-products.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../src/models/Product');
const Category = require('../src/models/Category');

// Sample products data
const sampleProducts = [
  {
    name: 'Urban Combat',
    sku: 'BOOT-001',
    description: 'Durable combat boots for urban environments. Perfect for work or casual wear.',
    brand: 'TrailMaster',
    basePrice: 119.99,
    images: ['/images/products/urban-combat.jpg'],
    minOrderQuantity: 5,
    specifications: {
      material: 'Leather',
      color: 'Black',
      style: 'Combat',
      gender: 'unisex'
    },
    priceTiers: [
      { minQuantity: 5, price: 119.99 },
      { minQuantity: 10, price: 109.99 },
      { minQuantity: 20, price: 99.99 }
    ],
    sizes: [
      { size: '7', inventory: 50 },
      { size: '8', inventory: 75 },
      { size: '9', inventory: 100 },
      { size: '10', inventory: 100 },
      { size: '11', inventory: 75 },
      { size: '12', inventory: 50 }
    ],
    featured: true,
    isActive: true
  },
  {
    name: 'Wilderness Hiker',
    sku: 'ATH-001',
    description: 'Comfortable hiking shoes with excellent grip for all terrains.',
    brand: 'TrailMaster',
    basePrice: 149.99,
    images: ['/images/products/wilderness-hiker.jpg'],
    minOrderQuantity: 5,
    specifications: {
      material: 'Synthetic',
      color: 'Blue/Gray',
      style: 'Athletic',
      gender: 'men'
    },
    priceTiers: [
      { minQuantity: 5, price: 149.99 },
      { minQuantity: 10, price: 139.99 },
      { minQuantity: 20, price: 129.99 }
    ],
    sizes: [
      { size: '7', inventory: 40 },
      { size: '8', inventory: 60 },
      { size: '9', inventory: 80 },
      { size: '10', inventory: 80 },
      { size: '11', inventory: 60 },
      { size: '12', inventory: 40 }
    ],
    featured: true,
    isActive: true
  },
  {
    name: 'Elegant Heel',
    sku: 'FORM-001',
    description: 'Elegant heels for formal occasions. Comfortable and stylish.',
    brand: 'LuxeStep',
    basePrice: 89.99,
    images: ['/images/products/elegant-heel.jpg'],
    minOrderQuantity: 5,
    specifications: {
      material: 'Leather',
      color: 'Black',
      style: 'Formal',
      gender: 'women'
    },
    priceTiers: [
      { minQuantity: 5, price: 89.99 },
      { minQuantity: 10, price: 79.99 },
      { minQuantity: 20, price: 69.99 }
    ],
    sizes: [
      { size: '5', inventory: 30 },
      { size: '6', inventory: 50 },
      { size: '7', inventory: 70 },
      { size: '8', inventory: 70 },
      { size: '9', inventory: 50 },
      { size: '10', inventory: 30 }
    ],
    featured: true,
    isActive: true
  },
  {
    name: 'Executive Oxford',
    sku: 'FORM-002',
    description: 'Classic oxford shoes for business and formal occasions.',
    brand: 'LuxeStep',
    basePrice: 129.99,
    images: ['/images/products/executive-oxford.jpg'],
    minOrderQuantity: 5,
    specifications: {
      material: 'Leather',
      color: 'Brown',
      style: 'Formal',
      gender: 'men'
    },
    priceTiers: [
      { minQuantity: 5, price: 129.99 },
      { minQuantity: 10, price: 119.99 },
      { minQuantity: 20, price: 109.99 }
    ],
    sizes: [
      { size: '7', inventory: 40 },
      { size: '8', inventory: 60 },
      { size: '9', inventory: 80 },
      { size: '10', inventory: 80 },
      { size: '11', inventory: 60 },
      { size: '12', inventory: 40 }
    ],
    featured: true,
    isActive: true
  }
];

// Sample categories
const sampleCategories = [
  { name: 'Athletic', image: '/images/categories/athletic.svg' },
  { name: 'Casual', image: '/images/categories/casual.svg' },
  { name: 'Formal', image: '/images/categories/formal.svg' },
  { name: 'Boots', image: '/images/categories/boots.svg' }
];

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
    
    // Check if categories exist
    const categoryCount = await Category.countDocuments();
    
    let categories = [];
    
    if (categoryCount === 0) {
      console.log('Adding sample categories...');
      categories = await Category.insertMany(sampleCategories);
      console.log(`${categories.length} categories added`);
    } else {
      console.log('Categories already exist, fetching them...');
      categories = await Category.find();
    }
    
    // Create a map of category names to IDs
    const categoryMap = {};
    categories.forEach(category => {
      categoryMap[category.name] = category._id;
    });
    
    // Check if products exist
    const productCount = await Product.countDocuments();
    
    if (productCount === 0) {
      console.log('Adding sample products...');
      
      // Assign category IDs to products
      const productsWithCategories = sampleProducts.map(product => {
        let categoryName;
        
        if (product.specifications.style === 'Combat') {
          categoryName = 'Boots';
        } else if (product.specifications.style === 'Athletic') {
          categoryName = 'Athletic';
        } else if (product.specifications.style === 'Formal') {
          categoryName = 'Formal';
        } else {
          categoryName = 'Casual';
        }
        
        return {
          ...product,
          category: categoryMap[categoryName]
        };
      });
      
      await Product.insertMany(productsWithCategories);
      console.log(`${productsWithCategories.length} products added`);
    } else {
      console.log(`${productCount} products already exist in the database`);
    }
    
    console.log('Database setup complete');
    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

connectDB();
