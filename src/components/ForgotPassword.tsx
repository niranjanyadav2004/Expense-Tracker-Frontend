import React, { useState } from 'react';
import { authApi } from '../api/authApi';
import './ForgotPassword.css';

interface ForgotPasswordProps {
  onBackToLogin?: () => void;
  onEmailSubmitSuccess?: () => void;
}

export const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBackToLogin, onEmailSubmitSuccess }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      await authApi.forgotPassword(email.trim());

      setSuccess(
        'If this email exists in our system, you will receive a password reset link shortly. Please check your inbox and spam folder.'
      );
      setEmail('');

      // Optional: Show success message for a while then redirect
      setTimeout(() => {
        if (onEmailSubmitSuccess) {
          onEmailSubmitSuccess();
        }
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'An error occurred while processing your request');
      console.error('Forgot password error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <div className="forgot-password-header">
          <h1>Reset Password</h1>
          <p>Enter your email address and we'll send you a link to reset your password</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError(null);
              }}
              disabled={loading}
              autoFocus
            />
            <small className="help-text">We'll send the reset link to this email</small>
          </div>

          {/* Error Message */}
          {error && <div className="alert alert-error">{error}</div>}

          {/* Success Message */}
          {success && <div className="alert alert-success">{success}</div>}

          {/* Submit Button */}
          <button type="submit" className="submit-btn" disabled={loading || success !== null}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        {/* Back to Login Link */}
        <div className="back-to-login">
          <p>
            Remember your password?{' '}
            <button type="button" className="link-btn" onClick={onBackToLogin} disabled={loading}>
              Back to Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
