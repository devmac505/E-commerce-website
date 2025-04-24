import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset error and success
    setError('');
    setSuccess('');

    // Validate form
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);

    try {
      // In a real app, you would call an API endpoint here
      // For now, we'll just simulate a successful request
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess('Password reset instructions have been sent to your email address.');
      setEmail('');
    } catch (err) {
      console.error('Password reset error:', err);
      setError('Failed to send password reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-banner">
        <div className="container">
          <h1 className="page-title">Forgot Password</h1>
          <p className="banner-subtitle">Reset your password</p>
        </div>
      </div>
      <div className="container">
        <div className="auth-container">
          <div className="auth-form-container">
            <h2>Reset Your Password</h2>
            <p>Enter your email address and we'll send you instructions to reset your password.</p>

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
                <button
                  type="submit"
                  className="btn btn-primary btn-block"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Reset Instructions'}
                </button>
              </div>
            </form>

            <div className="auth-links">
              <p>
                Remember your password? <Link to="/login">Back to Login</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
