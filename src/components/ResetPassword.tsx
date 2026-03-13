import React, { useState, useEffect } from 'react';
import { authApi } from '../api/authApi';
import './ResetPassword.css';

interface ResetPasswordFormData {
  newPassword: string;
  confirmPassword: string;
}

interface ResetPasswordProps {
  onBackToLogin?: () => void;
  tokenFromUrl?: string;
}

export const ResetPassword: React.FC<ResetPasswordProps> = ({ onBackToLogin, tokenFromUrl }) => {
  const [formData, setFormData] = useState<ResetPasswordFormData>({
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [token] = useState<string | undefined>(tokenFromUrl);

  // Check if token is available, if not show error
  useEffect(() => {
    if (!token) {
      setError('Invalid or missing reset token. Please use the link from your email.');
    }
  }, [token]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const validateForm = (): boolean => {
    if (!token) {
      setError('Reset token is missing. Please use the link from your email.');
      return false;
    }
    if (!formData.newPassword) {
      setError('Password is required');
      return false;
    }
    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!validateForm() || !token) {
      return;
    }

    setLoading(true);
    try {
      await authApi.resetPassword(token, formData.newPassword);

      setSuccess('Password reset successfully! Redirecting to login...');
      setFormData({
        newPassword: '',
        confirmPassword: '',
      });

      // Logout user and redirect to login after 2 seconds
      setTimeout(() => {
        authApi.logout(); // Clear all auth data including JWT
        if (onBackToLogin) {
          onBackToLogin();
        }
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'An error occurred while resetting password');
      console.error('Reset password error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-card">
        <div className="reset-password-header">
          <h1>Reset Password</h1>
          <p>Enter your new password below</p>
        </div>

        {token ? (
          <form onSubmit={handleSubmit}>
            {/* New Password Field */}
            <div className="form-group">
              <label htmlFor="newPassword">New Password *</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="newPassword"
                  name="newPassword"
                  placeholder="Enter your new password"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              <small className="help-text">Minimum 6 characters required</small>
            </div>

            {/* Confirm Password Field */}
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password *</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm your new password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && <div className="alert alert-error">{error}</div>}

            {/* Success Message */}
            {success && <div className="alert alert-success">{success}</div>}

            {/* Submit Button */}
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Updating Password...' : 'Update Password'}
            </button>
          </form>
        ) : (
          <div style={{ padding: '30px', textAlign: 'center' }}>
            {error && <div className="alert alert-error">{error}</div>}
            <button
              type="button"
              className="submit-btn"
              onClick={onBackToLogin}
              style={{ marginTop: '20px' }}
            >
              Back to Login
            </button>
          </div>
        )}

        {/* Back to Login Link */}
        {token && (
          <div className="back-to-login">
            <p>
              Remember your password?{' '}
              <button
                type="button"
                className="link-btn"
                onClick={onBackToLogin}
                disabled={loading}
              >
                Back to Login
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
