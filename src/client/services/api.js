// Base API URL - use environment variable in production, relative path in development
const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? `${process.env.REACT_APP_API_URL || 'https://e-commerce-backend-iahp.onrender.com'}/api`
  : '/api';

// Helper function to handle API responses
const handleResponse = async (response) => {
  console.log('API Response Status:', response.status);

  if (!response.ok) {
    // Try to get error message from response
    try {
      const errorData = await response.json();
      console.error('API Error Data:', errorData);
      throw new Error(errorData.message || `API error: ${response.status}`);
    } catch (e) {
      console.error('Error parsing API error response:', e);
      throw new Error(`API error: ${response.status}`);
    }
  }

  try {
    const data = await response.json();
    console.log('API Response Data:', data);
    return data;
  } catch (e) {
    console.error('Error parsing API response JSON:', e);
    throw new Error('Invalid JSON response from API');
  }
};

// Auth API calls
export const AuthAPI = {
  // Register a new user
  register: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials)
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },

  // Get user profile
  getProfile: async () => {
    try {
      const token = localStorage.getItem('token');
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
      console.error('Error fetching profile:', error);
      throw error;
    }
  }
};

// Product API calls
export const ProductAPI = {
  // Get all products with filters
  getProducts: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    console.log(`Fetching products with URL: ${API_BASE_URL}/products?${queryString}`);
    try {
      const response = await fetch(`${API_BASE_URL}/products?${queryString}`);
      console.log('Fetch response received:', response.status);
      return handleResponse(response);
    } catch (error) {
      console.error('Network error fetching products:', error);
      throw error;
    }
  },

  // Get single product
  getProductById: async (productId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${productId}`);
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },

  // Get product categories
  getCategories: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`);
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  // Get related products
  getRelatedProducts: async (productId, limit = 4) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/related/${productId}?limit=${limit}`);
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching related products:', error);
      throw error;
    }
  },

  // Get product reviews
  getProductReviews: async (productId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${productId}/reviews`);
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching product reviews:', error);
      throw error;
    }
  }
};

// Order API calls
export const OrderAPI = {
  // Create a new order
  createOrder: async (orderData) => {
    try {
      const token = localStorage.getItem('token');
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
      console.error('Error creating order:', error);
      throw error;
    }
  },

  // Get user orders
  getUserOrders: async () => {
    try {
      const token = localStorage.getItem('token');
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
      console.error('Error fetching orders:', error);
      throw error;
    }
  }
};
