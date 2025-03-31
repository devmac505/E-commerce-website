const net = require('net');

function checkMongoDBConnection() {
  console.log('Checking if MongoDB is running on localhost:27017...');
  
  const client = new net.Socket();
  const timeout = 1000; // 1 second timeout
  
  client.setTimeout(timeout);
  
  client.on('connect', function() {
    console.log('MongoDB appears to be running!');
    client.end();
  });
  
  client.on('timeout', function() {
    console.log('Connection timeout. MongoDB may not be running.');
    client.destroy();
  });
  
  client.on('error', function(error) {
    console.log('Error: MongoDB is not running or not accessible.');
    console.log('Error details:', error.message);
    client.destroy();
  });
  
  client.on('close', function() {
    console.log('Connection check complete.');
    
    console.log('\nIf MongoDB is not running, you need to:');
    console.log('1. Install MongoDB from https://www.mongodb.com/try/download/community');
    console.log('2. Start the MongoDB service');
    console.log('   - On Windows: Start MongoDB Compass or run MongoDB as a service');
    console.log('   - On macOS/Linux: Run "mongod" in terminal');
    
    console.log('\nTo install the Node.js dependencies, you need to:');
    console.log('1. Open PowerShell as Administrator');
    console.log('2. Run: Set-ExecutionPolicy RemoteSigned -Scope CurrentUser');
    console.log('3. Back in your project directory, run: npm install');
  });
  
  // Attempt to connect to MongoDB's default port
  client.connect(27017, 'localhost');
}

checkMongoDBConnection(); 