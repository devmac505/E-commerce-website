/**
 * Main application entry point
 * This file starts the server and handles process signals for clean shutdown
 */

// Import dependencies
const http = require('http');
const app = require('./server');
const config = require('./config');
const { disconnectDB } = require('./config/db');

// Create HTTP server
const server = http.createServer(app);

// Store connections to close them gracefully on shutdown
const connections = [];
server.on('connection', connection => {
  connections.push(connection);
  connection.on('close', () => {
    connections.splice(connections.indexOf(connection), 1);
  });
});

// Start the server
server.listen(config.port, () => {
  console.log(`Server running in ${config.env} mode on port ${config.port}`);
});

// Graceful shutdown function
const gracefulShutdown = () => {
  console.log('Starting graceful shutdown...');
  
  // Close the server first to stop accepting new connections
  server.close(() => {
    console.log('Server closed');
    
    // Close database connection using our disconnectDB module
    disconnectDB().then(() => {
      process.exit(0);
    }).catch(() => {
      console.error('Error during database disconnection, forcing shutdown');
      process.exit(1);
    });
    
    // If database doesn't close in time, force close
    setTimeout(() => {
      console.error('Database disconnection timed out, forcing shutdown');
      process.exit(1);
    }, 5000);
  });
  
  // Close existing connections
  connections.forEach(conn => conn.end());
  setTimeout(() => {
    connections.forEach(conn => conn.destroy());
  }, 5000);
};

// Handle various signals for graceful shutdown
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
process.on('SIGUSR2', gracefulShutdown); // For nodemon restarts

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  // Don't exit immediately, allow for graceful shutdown
  gracefulShutdown();
});

module.exports = server;
