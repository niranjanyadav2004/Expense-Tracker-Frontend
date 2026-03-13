import { useState } from 'react';
import { authApi } from '../api/authApi';
import './Settings.css';

interface SettingsProps {
  onLogout?: () => void;
}

export const Settings = ({ onLogout }: SettingsProps) => {
  const [activeTab, setActiveTab] = useState<'security' | 'preferences'>('security');
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      await authApi.updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setSuccess('Password updated successfully! Redirecting to login...');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      // Logout and redirect after 2 seconds
      setTimeout(() => {
        authApi.logout();
        if (onLogout) {
          onLogout();
        }
      }, 2000);
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message || 'Failed to update password';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-container">
        <div className="settings-header">
          <h2>⚙️ Settings</h2>
          <p>Manage your account and preferences</p>
        </div>

        <div className="settings-content">
          <div className="settings-tabs">
            <button
              className={`tab-btn ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              🔒 Security
            </button>
            <button
              className={`tab-btn ${activeTab === 'preferences' ? 'active' : ''}`}
              onClick={() => setActiveTab('preferences')}
            >
              ⚙️ Preferences
            </button>
          </div>

          <div className="settings-panel">
            {activeTab === 'security' && (
              <div className="settings-section">
                <h3>Change Password</h3>
                <p className="section-description">
                  Update your password regularly to keep your account secure.
                </p>

                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}

                <form onSubmit={handlePasswordSubmit} className="password-form">
                  <div className="form-group">
                    <label htmlFor="currentPassword">Current Password</label>
                    <input
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter your current password"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="newPassword">New Password</label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter your new password"
                      required
                      disabled={loading}
                    />
                    <small className="password-hint">
                      Must be at least 6 characters long
                    </small>
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="Confirm your new password"
                      required
                      disabled={loading}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-update"
                    disabled={loading}
                  >
                    {loading ? 'Updating...' : 'Update Password'}
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="settings-section">
                <h3>Preferences</h3>
                <p className="section-description">
                  Customize your experience on the Expense Tracker.
                </p>

                <div className="preference-item">
                  <div className="preference-info">
                    <h4>Email Notifications</h4>
                    <p>Receive email updates about your expenses</p>
                  </div>
                  <input
                    type="checkbox"
                    className="checkbox"
                    defaultChecked={true}
                    disabled
                  />
                </div>

                <div className="preference-item">
                  <div className="preference-info">
                    <h4>Monthly Reports</h4>
                    <p>Get monthly expense reports</p>
                  </div>
                  <input
                    type="checkbox"
                    className="checkbox"
                    defaultChecked={true}
                    disabled
                  />
                </div>

                <div className="preference-item">
                  <div className="preference-info">
                    <h4>Dark Mode</h4>
                    <p>Enable dark theme (Coming soon)</p>
                  </div>
                  <input
                    type="checkbox"
                    className="checkbox"
                    disabled
                  />
                </div>

                <div className="preference-info-box">
                  These features will be available soon. Check back later!
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
