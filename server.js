// Check for required modules
try {
  require('express');
  require('mongoose');
  require('morgan');
  require('cors');
  console.log('All dependencies are installed and available.');
} catch (error) {
  console.error('ERROR: Missing dependencies. Please run: npm install');
  console.error('If you have PowerShell restrictions, try: powershell -ExecutionPolicy Bypass -Command "npm install"');
  console.error('Original error:', error.message);
  process.exit(1);
}

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const config = require('./config');
const { connectDB } = require('./config/db');

// Initialize express app
const app = express();

// Connect to MongoDB using our new connection module
connectDB().catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan(config.logLevel));
app.use(cors());

// Serve static files from the public directory in all environments
app.use(express.static('public'));

// API Routes
app.use('/api/auth', require('./app/routes/auth'));
app.use('/api/products', require('./app/routes/products'));
app.use('/api/orders', require('./app/routes/orders'));

// Serve index.html for any route not matching API routes or static files
// This should work in all environments
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Server Error'
  });
});

// Export the app instead of starting the server directly
// This allows index.js to handle server startup
module.exports = app;

// Handle unhandled promise rejections - moved to index.js
// process.on('unhandledRejection', (err) => {
//   console.error('Unhandled Promise Rejection:', err);
//   // Close server & exit process
//   // server.close(() => process.exit(1));
// }); 