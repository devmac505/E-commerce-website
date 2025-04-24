const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const validateEnv = require('./utils/validateEnv');
const rateLimitMiddleware = require('./middleware/rateLimit');
const { cacheMiddleware } = require('./middleware/cache');
const helmet = require('helmet');
const compression = require('compression');
require('dotenv').config();

// Validate environment variables
validateEnv();

// Routes
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

// Connect to database
connectDB();

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Request headers:', req.headers);
  next();
});

// Add response logging middleware
app.use((req, res, next) => {
  const originalSend = res.send;
  res.send = function(body) {
    console.log(`Response for ${req.method} ${req.url} - Status: ${res.statusCode}`);
    return originalSend.call(this, body);
  };
  next();
});

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: ["'self'", "http://localhost:4000", "http://localhost:3001", "https://e-commerce-backend-iahp.onrender.com"],
        imgSrc: ["'self'", "data:", "blob:"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
      },
    },
  })
); // Set security headers with custom CSP
app.use(cors({
  origin: ['http://localhost:3001', 'http://localhost:4000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Apply rate limiting to all API routes
app.use('/api', rateLimitMiddleware(100, 60 * 1000)); // 100 requests per minute

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Compression middleware
app.use(compression()); // Compress all responses

// Serve static files from the public directory
app.use(express.static('public'));

// Test routes
app.get('/api/test', (req, res) => {
  res.json({ success: true, message: 'API is working' });
});

// Direct test route for user registration
app.post('/api/test-register', (req, res) => {
  console.log('Test register route hit');
  console.log('Request body:', req.body);
  res.json({
    success: true,
    message: 'Registration test endpoint working',
    receivedData: req.body
  });
});

// Mount routes
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

// Serve static files from the dist directory with higher priority
app.use('/dist', express.static(path.join(__dirname, '../public/dist'), {
  maxAge: '30d' // Cache static assets for 30 days
}));

// Serve React app if available
if (process.env.NODE_ENV === 'production') {
  // Serve React build files
  app.use(express.static(path.join(__dirname, '../public/dist'), {
    maxAge: '30d' // Cache static assets for 30 days
  }));
}

// Serve React app for all routes that don't match an API route or static file
app.use((req, res, next) => {
  // Skip API routes
  if (req.path.startsWith('/api')) {
    return next();
  }

  console.log(`Serving React app for path: ${req.path}`);
  // Serve the React app for client-side routing
  if (req.method === 'GET') {
    res.set('Content-Type', 'text/html');
    res.sendFile(path.resolve(__dirname, '../public/index.html'));
  } else {
    next();
  }
});

// Add request ID middleware for tracking requests
app.use((req, res, next) => {
  req.id = Date.now().toString(36) + Math.random().toString(36).substring(2);
  res.set('X-Request-ID', req.id);
  next();
});

// Global cache control headers for API responses
app.use('/api', (req, res, next) => {
  // Skip for non-GET requests
  if (req.method !== 'GET') {
    return next();
  }

  // Set cache control headers if not already set
  if (!res.getHeader('Cache-Control')) {
    res.set('Cache-Control', 'no-cache');
  }

  next();
});

// Error handling middleware (should be last)
app.use(errorHandler);

// Export the app for use in server.js
module.exports = app;