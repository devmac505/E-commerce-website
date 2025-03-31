const mongoose = require('mongoose');
const { connectDB, disconnectDB } = require('./config/db');
const User = require('./app/models/User');
const Product = require('./app/models/Product');
const Order = require('./app/models/Order');
const bcrypt = require('bcryptjs');
const config = require('./config');

// Sample data based on the SVG images and frontend code
const products = [
  {
    name: 'Running Shoe Model X1',
    sku: 'RN-X1-001',
    description: 'High-performance running shoes designed for comfort and speed. Features a lightweight mesh upper and responsive cushioning.',
    category: 'athletic',
    gender: 'unisex',
    images: ['images/products/product-athletic-1.svg'],
    price: 129.99,
    wholesalePrice: 89.99,
    bulkPricing: [
      { quantity: 10, price: 89.99 },
      { quantity: 50, price: 84.99 },
      { quantity: 100, price: 79.99 }
    ],
    availableSizes: [
      { size: '6', inventory: 150 },
      { size: '7', inventory: 200 },
      { size: '8', inventory: 250 },
      { size: '9', inventory: 300 },
      { size: '10', inventory: 250 },
      { size: '11', inventory: 200 },
      { size: '12', inventory: 150 }
    ],
    materials: ['Synthetic mesh', 'Rubber'],
    colors: ['Black', 'White', 'Blue', 'Red'],
    featured: true,
    active: true,
    minOrderQuantity: 10,
    leadTime: '2-3 weeks'
  },
  {
    name: 'Trail Running Shoe',
    sku: 'TRL-RN-001',
    description: 'Durable trail running shoes with excellent traction for off-road running and hiking. All-terrain outsole for grip on any surface.',
    category: 'athletic',
    gender: 'women',
    images: ['images/products/product-athletic-2.svg'],
    price: 139.99,
    wholesalePrice: 95.99,
    bulkPricing: [
      { quantity: 10, price: 95.99 },
      { quantity: 50, price: 90.99 },
      { quantity: 100, price: 85.99 }
    ],
    availableSizes: [
      { size: '5', inventory: 100 },
      { size: '6', inventory: 120 },
      { size: '7', inventory: 150 },
      { size: '8', inventory: 180 },
      { size: '9', inventory: 150 },
      { size: '10', inventory: 120 },
      { size: '11', inventory: 100 }
    ],
    materials: ['Leather', 'Rubber', 'Gore-Tex'],
    colors: ['Green', 'Black', 'Brown'],
    featured: false,
    active: true,
    minOrderQuantity: 10,
    leadTime: '2-3 weeks'
  },
  {
    name: 'Business Oxford Leather',
    sku: 'BZ-OX-001',
    description: 'Classic Oxford shoes made with premium leather. Perfect for business professional attire with timeless style.',
    category: 'formal',
    gender: 'men',
    images: ['images/products/product-formal-1.svg'],
    price: 179.99,
    wholesalePrice: 129.99,
    bulkPricing: [
      { quantity: 10, price: 129.99 },
      { quantity: 50, price: 119.99 },
      { quantity: 100, price: 109.99 }
    ],
    availableSizes: [
      { size: '7', inventory: 100 },
      { size: '8', inventory: 120 },
      { size: '9', inventory: 150 },
      { size: '10', inventory: 150 },
      { size: '11', inventory: 120 },
      { size: '12', inventory: 80 }
    ],
    materials: ['Genuine leather', 'Leather sole'],
    colors: ['Black', 'Brown', 'Tan'],
    featured: true,
    active: true,
    minOrderQuantity: 10,
    leadTime: '3-4 weeks'
  },
  {
    name: 'Classic Dress Shoe',
    sku: 'CL-DS-001',
    description: 'Timeless dress shoes for formal occasions. Made with premium leather and classic styling for a sophisticated look.',
    category: 'formal',
    gender: 'men',
    images: ['images/products/product-formal-2.svg'],
    price: 169.99,
    wholesalePrice: 119.99,
    bulkPricing: [
      { quantity: 10, price: 119.99 },
      { quantity: 50, price: 109.99 },
      { quantity: 100, price: 99.99 }
    ],
    availableSizes: [
      { size: '7', inventory: 90 },
      { size: '8', inventory: 110 },
      { size: '9', inventory: 140 },
      { size: '10', inventory: 140 },
      { size: '11', inventory: 110 },
      { size: '12', inventory: 70 }
    ],
    materials: ['Genuine leather', 'Leather sole'],
    colors: ['Black', 'Brown'],
    featured: false,
    active: true,
    minOrderQuantity: 10,
    leadTime: '3-4 weeks'
  },
  {
    name: 'Everyday Canvas Sneaker',
    sku: 'CV-SN-001',
    description: 'Versatile canvas sneakers for everyday wear. Comfortable, durable, and stylish with a variety of color options.',
    category: 'casual',
    gender: 'unisex',
    images: ['images/products/product-casual-1.svg'],
    price: 89.99,
    wholesalePrice: 65.99,
    bulkPricing: [
      { quantity: 10, price: 65.99 },
      { quantity: 50, price: 59.99 },
      { quantity: 100, price: 54.99 }
    ],
    availableSizes: [
      { size: '5', inventory: 100 },
      { size: '6', inventory: 150 },
      { size: '7', inventory: 200 },
      { size: '8', inventory: 250 },
      { size: '9', inventory: 250 },
      { size: '10', inventory: 200 },
      { size: '11', inventory: 150 },
      { size: '12', inventory: 100 }
    ],
    materials: ['Canvas', 'Rubber'],
    colors: ['Black', 'White', 'Navy', 'Red', 'Green'],
    featured: true,
    active: true,
    minOrderQuantity: 10,
    leadTime: '1-2 weeks'
  },
  {
    name: 'Premium Leather Boot',
    sku: 'BT-LT-001',
    description: 'High-quality leather boots with durable construction. Ideal for both style and function with water-resistant properties.',
    category: 'boots',
    gender: 'men',
    images: ['images/products/product-boots-1.svg'],
    price: 219.99,
    wholesalePrice: 159.99,
    bulkPricing: [
      { quantity: 10, price: 159.99 },
      { quantity: 50, price: 149.99 },
      { quantity: 100, price: 139.99 }
    ],
    availableSizes: [
      { size: '7', inventory: 80 },
      { size: '8', inventory: 100 },
      { size: '9', inventory: 120 },
      { size: '10', inventory: 120 },
      { size: '11', inventory: 100 },
      { size: '12', inventory: 80 },
      { size: '13', inventory: 60 }
    ],
    materials: ['Full-grain leather', 'Rubber sole'],
    colors: ['Black', 'Brown', 'Tan'],
    featured: true,
    active: true,
    minOrderQuantity: 10,
    leadTime: '3-4 weeks'
  }
];

// Admin user
const adminUser = {
  companyName: 'WholesaleFootwear Admin',
  email: 'admin@wholesalefootwear.com',
  password: 'admin123',
  role: 'admin',
  companyAddress: {
    street: '123 Business Ave, Suite 100',
    city: 'New York',
    state: 'NY',
    postalCode: '10001',
    country: 'USA'
  },
  businessRegistrationNumber: 'ADM-12345',
  contactPerson: {
    firstName: 'Admin',
    lastName: 'User',
    position: 'Administrator',
    phone: '(555) 123-4567'
  },
  approved: true
};

// Demo retailer user
const retailerUser = {
  companyName: 'Shoe Retailer Co.',
  email: 'buyer@retailer.com',
  password: 'buyer123',
  role: 'buyer',
  companyAddress: {
    street: '456 Shop Street',
    city: 'Chicago',
    state: 'IL',
    postalCode: '60601',
    country: 'USA'
  },
  businessRegistrationNumber: 'RET-67890',
  contactPerson: {
    firstName: 'Retailer',
    lastName: 'Buyer',
    position: 'Purchasing Manager',
    phone: '(555) 987-6543'
  },
  approved: true
};

// Sample order
const createSampleOrder = (userId, products) => {
  // Use two products for the sample order
  const productItems = products.slice(0, 2);
  
  return {
    user: userId,
    orderNumber: 'ORD-230901-0001', // Will be auto-generated but we provide for sample
    items: [
      {
        product: productItems[0]._id,
        size: '9',
        quantity: 20,
        price: productItems[0].wholesalePrice,
        totalPrice: productItems[0].wholesalePrice * 20
      },
      {
        product: productItems[1]._id,
        size: '8',
        quantity: 15,
        price: productItems[1].wholesalePrice,
        totalPrice: productItems[1].wholesalePrice * 15
      }
    ],
    billingAddress: {
      street: '456 Shop Street',
      city: 'Chicago',
      state: 'IL',
      postalCode: '60601',
      country: 'USA'
    },
    shippingAddress: {
      street: '456 Shop Street',
      city: 'Chicago',
      state: 'IL',
      postalCode: '60601',
      country: 'USA'
    },
    paymentMethod: 'purchase_order',
    paymentStatus: 'paid',
    shippingMethod: 'standard',
    status: 'delivered',
    notes: 'Sample order for testing',
    subtotal: (productItems[0].wholesalePrice * 20) + (productItems[1].wholesalePrice * 15),
    tax: ((productItems[0].wholesalePrice * 20) + (productItems[1].wholesalePrice * 15)) * 0.08,
    shippingCost: 25.00,
    discount: 0,
    total: ((productItems[0].wholesalePrice * 20) + (productItems[1].wholesalePrice * 15)) * 1.08 + 25.00,
    purchaseOrderNumber: 'PO-12345',
    trackingInfo: [
      {
        carrier: 'UPS',
        trackingNumber: '1Z999AA10123456784',
        link: 'https://www.ups.com/track?tracknum=1Z999AA10123456784'
      }
    ]
  };
};

// Seed data function
const seedData = async () => {
  try {
    // Connect to the database
    await connectDB();
    
    // Clear existing data - BE CAREFUL WITH THIS
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    
    // Create users
    console.log('Creating users...');
    const admin = new User({
      ...adminUser,
      password: await bcrypt.hash(adminUser.password, 10)
    });
    await admin.save();
    
    const retailer = new User({
      ...retailerUser,
      password: await bcrypt.hash(retailerUser.password, 10)
    });
    await retailer.save();
    
    // Create products
    console.log('Creating products...');
    const createdProducts = await Product.insertMany(products);
    
    // Create sample order
    console.log('Creating sample order...');
    const sampleOrder = createSampleOrder(retailer._id, createdProducts);
    await new Order(sampleOrder).save();
    
    console.log('Seed data created successfully!');
    console.log(`
      Admin User: ${adminUser.email} / ${adminUser.password}
      Retailer User: ${retailerUser.email} / ${retailerUser.password}
      Products Created: ${createdProducts.length}
      Sample Orders Created: 1
    `);
    
    // Disconnect from the database
    await disconnectDB();
    
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
};

// Run the seed function
seedData(); 