import { AuthUser } from '../types';
import './Profile.css';

interface ProfileProps {
  user: AuthUser | null;
  onUpdateUser: (user: AuthUser) => void;
}

export const Profile = ({ user }: ProfileProps) => {
  if (!user) {
    return <div className="profile-container">Loading...</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <h2>👤 My Profile</h2>
        </div>

        <div className="profile-content">
          <div className="profile-section">
            <div className="section-title">Account Information</div>
            
            <div className="info-grid">
              <div className="info-card">
                <label>Full Name</label>
                <p>{user.name}</p>
              </div>
              <div className="info-card">
                <label>Email</label>
                <p>{user.email || user.username}</p>
              </div>
              <div className="info-card">
                <label>Username</label>
                <p>{user.username}</p>
              </div>
            </div>

            <div className="about-container">
              <label className="about-label">About</label>
              <div className="about-section">
                {user.about ? (
                  <p className="about-text">{user.about}</p>
                ) : (
                  <p className="about-text empty-about">No about information added yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
