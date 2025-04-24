// Base API URL - use environment variable in production, relative path in development
// Check if we're running in production by looking for the API URL environment variable
// This is more reliable than checking NODE_ENV which might not be correctly passed to the client

// Use relative URL for API requests to avoid CORS and CSP issues
const API_BASE_URL = '/api';

// Only log in development
if (process.env.NODE_ENV !== 'production') {
  console.log(`Using API base URL: ${API_BASE_URL}`);
}

/**
 * Securely retrieves the authentication token
 * In a production environment, consider using HttpOnly cookies instead
 * or implementing additional security measures
 */
const getAuthToken = () => {
  // For now, we're still using localStorage but with a wrapper function
  // that can be updated later to use more secure storage methods
  return localStorage.getItem('token');
};


// Helper function to handle API responses
const handleResponse = async (response) => {
  // Only log in development
  if (process.env.NODE_ENV !== 'production') {
    console.log('API Response Status:', response.status);
  }

  if (!response.ok) {
    // Try to get error message from response
    try {
      const errorData = await response.json();
      // Only log error details in development
      if (process.env.NODE_ENV !== 'production') {
        console.error('API Error Data:', errorData);
      }

      // Handle validation errors
      if (errorData.details) {
        const errorMessages = Object.values(errorData.details).join(', ');
        throw new Error(errorMessages || errorData.message || `API error: ${response.status}`);
      }

      throw new Error(errorData.message || `API error: ${response.status}`);
    } catch (e) {
      if (e.message && e.message !== `API error: ${response.status}`) {
        throw e; // Rethrow the error with the message we created
      }

      if (process.env.NODE_ENV !== 'production') {
        console.error('Error parsing API error response:', e);
      }
      throw new Error(`API error: ${response.status}`);
    }
  }

  try {
    // Check if response is HTML instead of JSON
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('text/html')) {
      const text = await response.text();
      console.error('Received HTML instead of JSON:', text.substring(0, 150) + '...');
      throw new Error('Server returned HTML instead of JSON. The API endpoint may not be configured correctly.');
    }

    const data = await response.json();
    // Only log in development and avoid logging sensitive data
    if (process.env.NODE_ENV !== 'production') {
      console.log('API Response received successfully');
    }
    return data;
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error parsing API response JSON:', e);
    }
    if (e.message.includes('Unexpected token')) {
      throw new Error('Invalid response from server. Please check the API configuration.');
    }
    throw e;
  }
};

// Auth API calls
export const AuthAPI = {
  // Register a new user
  register: async (userData) => {
    try {
      console.log('API_BASE_URL:', API_BASE_URL);
      console.log('Full URL:', `${API_BASE_URL}/users/register`);

      const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      console.log('Raw response status:', response.status);
      console.log('Raw response headers:', [...response.headers.entries()]);

      return handleResponse(response);
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      console.log('Login API called with:', { email: credentials.email, password: '***' });
      console.log('API_BASE_URL:', API_BASE_URL);
      console.log('Full URL:', `${API_BASE_URL}/users/login`);

      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials)
      });

      console.log('Raw login response status:', response.status);
      console.log('Raw login response headers:', [...response.headers.entries()]);

      return handleResponse(response);
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },

  // Get user profile
  getProfile: async () => {
    try {
      // Get token from secure storage
      const token = getAuthToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return handleResponse(response);
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Error fetching profile:', error);
      }
      throw error;
    }
  }
};

// Product API calls
export const ProductAPI = {
  // Get all products with filters
  getProducts: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    if (process.env.NODE_ENV !== 'production') {
      console.log(`Fetching products with query params: ${queryString}`);
    }
    try {
      const response = await fetch(`${API_BASE_URL}/products?${queryString}`);
      if (process.env.NODE_ENV !== 'production') {
        console.log('Fetch response received:', response.status);
      }
      return handleResponse(response);
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Network error fetching products:', error);
      }
      throw error;
    }
  },

  // Get single product
  getProductById: async (productId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${productId}`);
      return handleResponse(response);
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Error fetching product:', error);
      }
      throw error;
    }
  },

  // Get product categories
  getCategories: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`);
      return handleResponse(response);
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Error fetching categories:', error);
      }
      throw error;
    }
  },

  // Get related products
  getRelatedProducts: async (productId, limit = 4) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/related/${productId}?limit=${limit}`);
      return handleResponse(response);
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Error fetching related products:', error);
      }
      throw error;
    }
  },

  // Get product reviews
  getProductReviews: async (productId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${productId}/reviews`);
      return handleResponse(response);
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Error fetching product reviews:', error);
      }
      throw error;
    }
  }
};

// Order API calls
export const OrderAPI = {
  // Create a new order
  createOrder: async (orderData) => {
    try {
      // Get token from secure storage
      const token = getAuthToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });
      return handleResponse(response);
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Error creating order:', error);
      }
      throw error;
    }
  },

  // Get user orders
  getUserOrders: async () => {
    try {
      // Get token from secure storage
      const token = getAuthToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${API_BASE_URL}/orders/user`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return handleResponse(response);
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Error fetching orders:', error);
      }
      throw error;
    }
  }
};
