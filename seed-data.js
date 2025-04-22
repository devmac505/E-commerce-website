require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./src/models/Category');
const Product = require('./src/models/Product');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully!'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Sample categories
const categories = [
  {
    name: 'Athletic',
    description: 'Athletic footwear for sports and active lifestyles',
    slug: 'athletic',
    image: '/images/athletic.jpg',
    isActive: true
  },
  {
    name: 'Casual',
    description: 'Casual footwear for everyday wear',
    slug: 'casual',
    image: '/images/casual.jpg',
    isActive: true
  },
  {
    name: 'Formal',
    description: 'Formal footwear for business and special occasions',
    slug: 'formal',
    image: '/images/formal.jpg',
    isActive: true
  },
  {
    name: 'Boots',
    description: 'Boots for work, hiking, and fashion',
    slug: 'boots',
    image: '/images/boots.jpg',
    isActive: true
  }
];

// Function to seed categories
const seedCategories = async () => {
  try {
    // Clear existing categories
    await Category.deleteMany({});
    console.log('Deleted existing categories');

    // Insert new categories
    const createdCategories = await Category.insertMany(categories);
    console.log(`Added ${createdCategories.length} categories`);
    return createdCategories;
  } catch (error) {
    console.error('Error seeding categories:', error);
    throw error;
  }
};

// Function to create sample products based on categories
const seedProducts = async (categories) => {
  try {
    // Clear existing products
    await Product.deleteMany({});
    console.log('Deleted existing products');

    // Create sample products for each category
    const products = [];

    // Athletic shoes
    const athleticCategory = categories.find(c => c.name === 'Athletic');
    products.push({
      name: 'Pro Runner X1',
      sku: 'ATH-PR-001',
      description: 'Professional running shoes with advanced cushioning technology for maximum comfort and performance.',
      category: athleticCategory._id,
      brand: 'SportMax',
      basePrice: 89.99,
      priceTiers: [
        { minQuantity: 10, price: 79.99 },
        { minQuantity: 50, price: 69.99 },
        { minQuantity: 100, price: 59.99 }
      ],
      images: ['/images/products/placeholder.svg'],
      sizes: [
        { size: '7', inventory: 50 },
        { size: '8', inventory: 75 },
        { size: '9', inventory: 100 },
        { size: '10', inventory: 80 },
        { size: '11', inventory: 60 },
        { size: '12', inventory: 40 }
      ],
      specifications: {
        material: 'Synthetic mesh',
        color: 'Blue/White',
        style: 'Running',
        gender: 'unisex'
      },
      minOrderQuantity: 5,
      isActive: true
    });

    products.push({
      name: 'Court Master Elite',
      sku: 'ATH-CM-002',
      description: 'Premium basketball shoes designed for optimal court performance and ankle support.',
      category: athleticCategory._id,
      brand: 'JumpStar',
      basePrice: 109.99,
      priceTiers: [
        { minQuantity: 10, price: 99.99 },
        { minQuantity: 50, price: 89.99 },
        { minQuantity: 100, price: 79.99 }
      ],
      images: ['/images/products/placeholder.svg'],
      sizes: [
        { size: '8', inventory: 60 },
        { size: '9', inventory: 80 },
        { size: '10', inventory: 100 },
        { size: '11', inventory: 90 },
        { size: '12', inventory: 70 },
        { size: '13', inventory: 50 }
      ],
      specifications: {
        material: 'Leather/Synthetic',
        color: 'Black/Red',
        style: 'Basketball',
        gender: 'men'
      },
      minOrderQuantity: 5,
      isActive: true
    });

    // Casual shoes
    const casualCategory = categories.find(c => c.name === 'Casual');
    products.push({
      name: 'Urban Walker',
      sku: 'CAS-UW-001',
      description: 'Comfortable casual shoes perfect for everyday urban wear with memory foam insoles.',
      category: casualCategory._id,
      brand: 'ComfortStep',
      basePrice: 69.99,
      priceTiers: [
        { minQuantity: 10, price: 59.99 },
        { minQuantity: 50, price: 49.99 },
        { minQuantity: 100, price: 44.99 }
      ],
      images: ['/images/products/placeholder.svg'],
      sizes: [
        { size: '7', inventory: 60 },
        { size: '8', inventory: 80 },
        { size: '9', inventory: 100 },
        { size: '10', inventory: 90 },
        { size: '11', inventory: 70 },
        { size: '12', inventory: 50 }
      ],
      specifications: {
        material: 'Canvas/Rubber',
        color: 'Gray',
        style: 'Slip-on',
        gender: 'unisex'
      },
      minOrderQuantity: 10,
      isActive: true
    });

    products.push({
      name: 'Classic Canvas',
      sku: 'CAS-CC-002',
      description: 'Timeless canvas sneakers that go with any casual outfit. Durable construction and comfortable fit.',
      category: casualCategory._id,
      brand: 'StreetStyle',
      basePrice: 49.99,
      priceTiers: [
        { minQuantity: 10, price: 44.99 },
        { minQuantity: 50, price: 39.99 },
        { minQuantity: 100, price: 34.99 }
      ],
      images: ['/images/products/placeholder.svg'],
      sizes: [
        { size: '6', inventory: 40 },
        { size: '7', inventory: 60 },
        { size: '8', inventory: 80 },
        { size: '9', inventory: 100 },
        { size: '10', inventory: 80 },
        { size: '11', inventory: 60 }
      ],
      specifications: {
        material: 'Canvas/Rubber',
        color: 'White',
        style: 'Lace-up',
        gender: 'unisex'
      },
      minOrderQuantity: 12,
      isActive: true
    });

    // Formal shoes
    const formalCategory = categories.find(c => c.name === 'Formal');
    products.push({
      name: 'Executive Oxford',
      sku: 'FOR-EO-001',
      description: 'Premium leather oxford shoes for business professionals. Handcrafted with attention to detail.',
      category: formalCategory._id,
      brand: 'LuxeStep',
      basePrice: 129.99,
      priceTiers: [
        { minQuantity: 10, price: 119.99 },
        { minQuantity: 50, price: 109.99 },
        { minQuantity: 100, price: 99.99 }
      ],
      images: ['/images/products/placeholder.svg'],
      sizes: [
        { size: '7', inventory: 30 },
        { size: '8', inventory: 50 },
        { size: '9', inventory: 70 },
        { size: '10', inventory: 60 },
        { size: '11', inventory: 40 },
        { size: '12', inventory: 20 }
      ],
      specifications: {
        material: 'Genuine Leather',
        color: 'Black',
        style: 'Oxford',
        gender: 'men'
      },
      minOrderQuantity: 5,
      isActive: true
    });

    products.push({
      name: 'Elegant Heel',
      sku: 'FOR-EH-002',
      description: 'Sophisticated heels for professional women. Combines style with all-day comfort.',
      category: formalCategory._id,
      brand: 'GlamStep',
      basePrice: 99.99,
      priceTiers: [
        { minQuantity: 10, price: 89.99 },
        { minQuantity: 50, price: 79.99 },
        { minQuantity: 100, price: 69.99 }
      ],
      images: ['/images/products/placeholder.svg'],
      sizes: [
        { size: '5', inventory: 40 },
        { size: '6', inventory: 60 },
        { size: '7', inventory: 80 },
        { size: '8', inventory: 70 },
        { size: '9', inventory: 50 },
        { size: '10', inventory: 30 }
      ],
      specifications: {
        material: 'Leather',
        color: 'Black',
        style: 'Pump',
        gender: 'women'
      },
      minOrderQuantity: 6,
      isActive: true
    });

    // Boots
    const bootsCategory = categories.find(c => c.name === 'Boots');
    products.push({
      name: 'Wilderness Hiker',
      sku: 'BOO-WH-001',
      description: 'Rugged hiking boots with waterproof construction and excellent traction for outdoor adventures.',
      category: bootsCategory._id,
      brand: 'TrailMaster',
      basePrice: 149.99,
      priceTiers: [
        { minQuantity: 10, price: 139.99 },
        { minQuantity: 50, price: 129.99 },
        { minQuantity: 100, price: 119.99 }
      ],
      images: ['/images/products/placeholder.svg'],
      sizes: [
        { size: '7', inventory: 40 },
        { size: '8', inventory: 60 },
        { size: '9', inventory: 80 },
        { size: '10', inventory: 70 },
        { size: '11', inventory: 50 },
        { size: '12', inventory: 30 }
      ],
      specifications: {
        material: 'Leather/Gore-Tex',
        color: 'Brown',
        style: 'Hiking',
        gender: 'unisex'
      },
      minOrderQuantity: 4,
      isActive: true
    });

    products.push({
      name: 'Urban Combat',
      sku: 'BOO-UC-002',
      description: 'Stylish combat boots that blend fashion with functionality. Perfect for urban environments.',
      category: bootsCategory._id,
      brand: 'UrbanEdge',
      basePrice: 119.99,
      priceTiers: [
        { minQuantity: 10, price: 109.99 },
        { minQuantity: 50, price: 99.99 },
        { minQuantity: 100, price: 89.99 }
      ],
      images: ['/images/products/placeholder.svg'],
      sizes: [
        { size: '6', inventory: 30 },
        { size: '7', inventory: 50 },
        { size: '8', inventory: 70 },
        { size: '9', inventory: 60 },
        { size: '10', inventory: 40 },
        { size: '11', inventory: 20 }
      ],
      specifications: {
        material: 'Leather',
        color: 'Black',
        style: 'Combat',
        gender: 'unisex'
      },
      minOrderQuantity: 6,
      isActive: true
    });

    // Insert products
    const createdProducts = await Product.insertMany(products);
    console.log(`Added ${createdProducts.length} products`);
    return createdProducts;
  } catch (error) {
    console.error('Error seeding products:', error);
    throw error;
  }
};

// Run the seeding process
const seedDatabase = async () => {
  try {
    const categories = await seedCategories();
    const products = await seedProducts(categories);
    
    console.log('Database seeding completed successfully!');
    mongoose.disconnect();
    console.log('MongoDB disconnected');
  } catch (error) {
    console.error('Database seeding failed:', error);
    mongoose.disconnect();
    process.exit(1);
  }
};

seedDatabase();
