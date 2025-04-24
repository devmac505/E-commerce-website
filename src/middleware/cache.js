/**
 * Simple in-memory cache middleware
 * For production, consider using Redis or another distributed cache
 */

// Simple in-memory cache
const cache = new Map();

/**
 * Cache middleware factory
 * @param {number} duration - Cache duration in seconds
 * @returns {Function} Express middleware
 */
const cacheMiddleware = (duration = 300) => {
  return (req, res, next) => {
    // Skip caching for non-GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Create a cache key from the URL and any query parameters
    const cacheKey = `${req.originalUrl || req.url}`;
    
    // Check if we have a cached response
    const cachedResponse = cache.get(cacheKey);
    
    if (cachedResponse) {
      // Set cache header
      res.set('X-Cache', 'HIT');
      
      // Return cached response
      return res.status(200).json(cachedResponse);
    }

    // If no cache hit, continue with request but capture the response
    res.set('X-Cache', 'MISS');
    
    // Store the original json method
    const originalJson = res.json;
    
    // Override the json method to cache the response
    res.json = function(body) {
      // Only cache successful responses
      if (res.statusCode >= 200 && res.statusCode < 300) {
        cache.set(cacheKey, body);
        
        // Set cache expiration
        setTimeout(() => {
          cache.delete(cacheKey);
        }, duration * 1000);
      }
      
      // Call the original json method
      return originalJson.call(this, body);
    };
    
    next();
  };
};

/**
 * Clear cache for a specific key pattern
 * @param {string} keyPattern - Pattern to match cache keys
 */
const clearCache = (keyPattern) => {
  // If no pattern provided, do nothing
  if (!keyPattern) return;
  
  // Convert simple patterns with * to regex
  let pattern;
  if (keyPattern.includes('*')) {
    pattern = new RegExp(keyPattern.replace(/\*/g, '.*'));
  }
  
  // Iterate through cache and delete matching keys
  for (const key of cache.keys()) {
    if (
      key === keyPattern || 
      (pattern && pattern.test(key))
    ) {
      cache.delete(key);
    }
  }
};

module.exports = {
  cache,
  cacheMiddleware,
  clearCache
};
