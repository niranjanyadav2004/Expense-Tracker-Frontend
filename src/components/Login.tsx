import { useState } from 'react';
import { authApi } from '../api/authApi';
import { LoginRequest } from '../types';
import { ThemeToggle } from './ThemeToggle';
import './Login.css';

interface LoginProps {
  onLoginSuccess: () => void;
  onSwitchToSignup: () => void;
  onLoginFailure?: () => void;
}

export const Login = ({ onLoginSuccess, onSwitchToSignup, onLoginFailure }: LoginProps) => {
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('[LOGIN] Attempting login with:', formData.email);
      const response = await authApi.login(formData);
      console.log('[LOGIN] Login successful, setting auth data');
      authApi.setAuthData(response);
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
      
      const errorMsg = err?.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(errorMsg);
      console.error('Login error:', err);
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
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              disabled={loading}
            />
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
