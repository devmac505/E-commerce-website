const { connectDB, disconnectDB } = require('./config/db');
const Product = require('./app/models/Product');
const User = require('./app/models/User');
const Order = require('./app/models/Order');

// Function to test database connection and query data
const testDatabase = async () => {
  try {
    // Connect to the database
    await connectDB();
    console.log('Connected to the database successfully!');
    
    // Count documents in collections
    const productCount = await Product.countDocuments();
    const userCount = await User.countDocuments();
    const orderCount = await Order.countDocuments();
    
    console.log(`
      Database Statistics:
      -------------------
      Products: ${productCount}
      Users: ${userCount}
      Orders: ${orderCount}
    `);
    
    // Display some sample data if available
    if (productCount > 0) {
      const products = await Product.find().limit(3).select('name sku category wholesalePrice');
      console.log('\nSample Products:');
      console.log(JSON.stringify(products, null, 2));
    }
    
    if (userCount > 0) {
      const users = await User.find().limit(2).select('companyName email role -_id');
      console.log('\nSample Users:');
      console.log(JSON.stringify(users, null, 2));
    }
    
    if (orderCount > 0) {
      const orders = await Order.find().limit(1).select('orderNumber status total -_id');
      console.log('\nSample Orders:');
      console.log(JSON.stringify(orders, null, 2));
    }
    
    // Disconnect from the database
    await disconnectDB();
    console.log('\nDisconnected from the database successfully!');
    
  } catch (error) {
    console.error('Error testing database:', error);
    process.exit(1);
  }
};

// Run the test function
testDatabase(); 