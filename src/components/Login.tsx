import { useState } from 'react';
import { authApi } from '../api/authApi';
import { LoginRequest } from '../types';
import { ThemeToggle } from './ThemeToggle';
import './Login.css';

interface LoginProps {
  onLoginSuccess: () => void;
  onSwitchToSignup: () => void;
  onForgotPassword?: () => void;
  onLoginFailure?: () => void;
}

export const Login = ({ onLoginSuccess, onSwitchToSignup, onForgotPassword, onLoginFailure }: LoginProps) => {
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const showError = (errorMsg: string) => {
    setError(errorMsg);
    // Auto-dismiss error after 2.5 seconds
    setTimeout(() => {
      setError('');
    }, 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('[LOGIN] Attempting login with:', formData.email);
      const response = await authApi.login(formData);
      console.log('[LOGIN] Response received:', response);
      
      // Try to set auth data and check if it was successful
      const authDataSet = authApi.setAuthData(response);
      
      if (!authDataSet) {
        console.error('[LOGIN] Failed to set auth data - invalid token from backend');
        authApi.logout();
        if (onLoginFailure) {
          onLoginFailure();
        }
        setFormData({
          email: '',
          password: '',
        });
        const errorMsg = 'Login failed: email or password invalid';
        showError(errorMsg);
        return;
      }
      
      console.log('[LOGIN] Login successful, auth data set properly');
      onLoginSuccess();
    } catch (err: any) {
      console.log('[LOGIN] Login failed, clearing credentials and notifying app');
      // Clear any stale credentials from localStorage on login failure
      authApi.logout();
      
      // Notify app that login failed so it can clear its auth state
      if (onLoginFailure) {
        onLoginFailure();
      }
      
      // Reset form data
      setFormData({
        email: '',
        password: '',
      });
      
      // Provide specific error messages based on the error
      let errorMsg = 'Login failed: email or password invalid';
      
      showError(errorMsg);
      console.error('[LOGIN] Login error:', {
        status: err?.response?.status,
        message: err?.response?.data?.message,
        error: err?.message,
      });
      console.log('[LOGIN] Error state set to:', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <ThemeToggle />
      <div className="auth-card">
        <h2>Login</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                disabled={loading}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {onForgotPassword && (
              <button
                type="button"
                className="forgot-password-link"
                onClick={onForgotPassword}
                disabled={loading}
              >
                Forgot Password?
              </button>
            )}
          </div>

          <button
            type="submit"
            className="btn-submit"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <button
              type="button"
              className="switch-link"
              onClick={onSwitchToSignup}
              disabled={loading}
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
