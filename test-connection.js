const { connectDB, disconnectDB } = require('./config/db');

const testConnection = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    const conn = await connectDB();
    
    console.log('Connection successful!');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database Name: ${conn.connection.name}`);
    
    // List collections
    const collections = await conn.connection.db.listCollections().toArray();
    console.log('Available collections:');
    if (collections.length === 0) {
      console.log('No collections found (empty database)');
    } else {
      collections.forEach(collection => {
        console.log(`- ${collection.name}`);
      });
    }
    
    await disconnectDB();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error testing MongoDB connection:', error);
  }
};

testConnection(); 