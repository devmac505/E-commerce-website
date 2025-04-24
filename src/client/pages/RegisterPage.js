import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthAPI } from '../services/api';
import { updateAuthState } from '../services/authState';
import { FaEye, FaEyeSlash } from '../components/mock-icons';

function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    // Check if required fields are filled
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return false;
    }

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    // Check password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    // Validate phone number (exactly 11 digits)
    if (formData.phone && formData.phone.trim() !== '') {
      const digitsOnly = formData.phone.replace(/\D/g, '');
      if (digitsOnly.length !== 11) {
        setError('number is not valid');
        return false;
      }
    }

    return true;
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Toggle confirm password visibility
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset error
    setError('');

    // Validate form
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Prepare data for API
      const userData = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
        companyName: formData.companyName,
        phone: formData.phone
      };

      console.log('Sending registration data:', { ...userData, password: '***' });

      // Log the API URL being used
      console.log('API URL:', `${process.env.REACT_APP_API_URL || '/api'}/users/register`);

      const response = await AuthAPI.register(userData);
      console.log('Registration response:', response);

      if (response.success && response.token) {
        // Set login timestamp for welcome message
        localStorage.setItem('loginTimestamp', Date.now().toString());

        // Update auth state (this will notify all components)
        updateAuthState({
          isLoggedIn: true,
          token: response.token,
          userName: response.data?.name || `${formData.firstName} ${formData.lastName}`,
          userRole: response.data?.role || 'user'
        });

        // Show success notification
        setSuccess('Registration successful! Redirecting to home page...');

        // Redirect to home page after a short delay to show the success message
        setTimeout(() => {
          navigate('/');
        }, 1000);
      } else {
        setError(response.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      if (err.message.includes('User already exists')) {
        setError('An account with this email already exists. Please use a different email or login.');
      } else {
        setError('Registration failed: ' + (err.message || 'Please try again later.'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-banner">
        <div className="container">
          <h1 className="page-title">Register</h1>
          <p className="banner-subtitle">Create your wholesale account</p>
        </div>
      </div>
      <div className="container">
        <div className="auth-container">
          <div className="auth-form-container">
            <h2>Create an Account</h2>

            {error && (
              <div className="alert alert-danger">{error}</div>
            )}

            {success && (
              <div className="notification notification-success">{success}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group half">
                  <label htmlFor="firstName">First Name *</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Enter your first name"
                    required
                  />
                </div>

                <div className="form-group half">
                  <label htmlFor="lastName">Last Name *</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Enter your last name"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password *</label>
                <div className="password-input-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    required
                  />
                  <span className="password-toggle" onClick={togglePasswordVisibility}>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                <span className="password-hint">
                  Password should be at least 6 characters long
                </span>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password *</label>
                <div className="password-input-container">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    required
                  />
                  <span className="password-toggle" onClick={toggleConfirmPasswordVisibility}>
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="companyName">Company Name</label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Enter your company name (optional)"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number (optional)"
                  pattern="[0-9]{11}"
                  maxLength="11"
                  className="full-width"
                />
              </div>

              <div className="form-group">
                <button
                  type="submit"
                  className="btn btn-primary btn-block"
                  disabled={loading}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </div>
            </form>

            <div className="auth-links">
              <p>
                Already have an account? <Link to="/login">Login</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
