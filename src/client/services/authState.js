/**
 * Simple auth state management utility
 * This provides a centralized way to manage authentication state
 */

// List of callbacks to notify when auth state changes
const authStateListeners = [];

// Current auth state
let currentAuthState = {
  isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
  userName: localStorage.getItem('userName') || '',
  userRole: localStorage.getItem('userRole') || '',
  token: localStorage.getItem('token') || ''
};

/**
 * Subscribe to auth state changes
 * @param {Function} callback Function to call when auth state changes
 * @returns {Function} Unsubscribe function
 */
export const subscribeToAuthState = (callback) => {
  authStateListeners.push(callback);
  
  // Immediately call with current state
  callback(currentAuthState);
  
  // Return unsubscribe function
  return () => {
    const index = authStateListeners.indexOf(callback);
    if (index > -1) {
      authStateListeners.splice(index, 1);
    }
  };
};

/**
 * Update auth state and notify listeners
 * @param {Object} authData Auth data to store
 */
export const updateAuthState = (authData) => {
  console.log('Updating auth state:', authData);
  
  // Update storage
  if (authData.token) {
    localStorage.setItem('token', authData.token);
  }
  
  localStorage.setItem('isLoggedIn', authData.isLoggedIn ? 'true' : 'false');
  
  if (authData.userName) {
    localStorage.setItem('userName', authData.userName);
  }
  
  if (authData.userRole) {
    localStorage.setItem('userRole', authData.userRole);
  }
  
  // Update current state
  currentAuthState = {
    ...currentAuthState,
    ...authData
  };
  
  // Notify listeners
  authStateListeners.forEach(listener => {
    listener(currentAuthState);
  });
  
  // Also dispatch storage event for backward compatibility
  window.dispatchEvent(new Event('storage'));
};

/**
 * Log out the current user
 */
export const logout = () => {
  // Clear auth data from storage
  localStorage.removeItem('token');
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('userName');
  localStorage.removeItem('userRole');
  
  // Update current state
  currentAuthState = {
    isLoggedIn: false,
    userName: '',
    userRole: '',
    token: ''
  };
  
  // Notify listeners
  authStateListeners.forEach(listener => {
    listener(currentAuthState);
  });
  
  // Also dispatch storage event for backward compatibility
  window.dispatchEvent(new Event('storage'));
};

/**
 * Get current auth state
 * @returns {Object} Current auth state
 */
export const getAuthState = () => {
  return { ...currentAuthState };
};
