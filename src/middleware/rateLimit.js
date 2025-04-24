/**
 * Rate limiting middleware to prevent API abuse
 * For production, consider using Redis or another distributed store
 */

// Simple in-memory store for rate limiting
const requestCounts = new Map();

/**
 * Rate limiting middleware factory
 * @param {number} maxRequests - Maximum number of requests allowed in the window
 * @param {number} windowMs - Time window in milliseconds
 * @returns {Function} Express middleware
 */
const rateLimitMiddleware = (maxRequests = 100, windowMs = 60 * 1000) => {
  return (req, res, next) => {
    // Get client IP
    const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    
    // Create a key that includes the IP and the route
    const key = `${ip}:${req.originalUrl || req.url}`;
    
    // Get current timestamp
    const now = Date.now();
    
    // Initialize or get existing record
    if (!requestCounts.has(key)) {
      requestCounts.set(key, {
        count: 0,
        resetTime: now + windowMs
      });
    }
    
    const record = requestCounts.get(key);
    
    // If the reset time has passed, reset the counter
    if (now > record.resetTime) {
      record.count = 0;
      record.resetTime = now + windowMs;
    }
    
    // Increment request count
    record.count += 1;
    
    // Set rate limit headers
    res.set('X-RateLimit-Limit', maxRequests);
    res.set('X-RateLimit-Remaining', Math.max(0, maxRequests - record.count));
    res.set('X-RateLimit-Reset', Math.ceil(record.resetTime / 1000));
    
    // If over limit, return 429 Too Many Requests
    if (record.count > maxRequests) {
      return res.status(429).json({
        success: false,
        error: 'Too many requests, please try again later.'
      });
    }
    
    next();
  };
};

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of requestCounts.entries()) {
    if (now > record.resetTime) {
      requestCounts.delete(key);
    }
  }
}, 10 * 60 * 1000); // Clean up every 10 minutes

module.exports = rateLimitMiddleware;
