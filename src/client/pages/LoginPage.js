import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthAPI } from '../services/api';
import { updateAuthState } from '../services/authState';
import { FaEye, FaEyeSlash } from '../components/mock-icons';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  // Check for remembered email on component mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset error
    setError('');

    // Validate form
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);
    console.log('Attempting login with email:', email);

    try {
      console.log('Calling login API...');
      const response = await AuthAPI.login({ email, password });
      console.log('Login API response:', response);

      if (response && response.success && response.token) {
        console.log('Login successful, storing user data');

        // If using remember me, store the email for future logins
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }

        // Set login timestamp for welcome message
        localStorage.setItem('loginTimestamp', Date.now().toString());

        // Update auth state (this will notify all components)
        updateAuthState({
          isLoggedIn: true,
          token: response.token,
          userName: response.data?.name || 'User',
          userRole: response.data?.role || 'user'
        });

        // Show success notification
        setSuccess('Login successful! Redirecting to home page...');

        // Redirect to home page after a short delay to show the success message
        console.log('Redirecting to home page');
        setTimeout(() => {
          navigate('/');
        }, 1000);
      } else {
        console.error('Login response invalid:', response);
        setError(response?.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-banner">
        <div className="container">
          <h1 className="page-title">Login</h1>
          <p className="banner-subtitle">Access your wholesale account</p>
        </div>
      </div>
      <div className="container">
        <div className="auth-container">
          <div className="auth-form-container">
            <h2>Welcome Back</h2>

            {error && (
              <div className="alert alert-danger">{error}</div>
            )}

            {success && (
              <div className="notification notification-success">{success}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="password-input-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                  <span className="password-toggle" onClick={togglePasswordVisibility}>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>

              <div className="form-group remember-forgot">
                <div className="remember-me">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label htmlFor="remember">Remember me</label>
                </div>
                <div className="forgot-password">
                  <Link to="/forgot-password">Forgot Password?</Link>
                </div>
              </div>

              <div className="form-group">
                <button
                  type="submit"
                  className="btn btn-primary btn-block"
                  disabled={loading}
                >
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </div>
            </form>

            <div className="auth-links">
              <p>
                Don't have an account? <Link to="/register">Register Now</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
