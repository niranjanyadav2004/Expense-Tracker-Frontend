import { AuthUser } from '../types';
import './ProfileModal.css';

interface ProfileModalProps {
  user: AuthUser | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal = ({ user, isOpen, onClose }: ProfileModalProps) => {
  if (!isOpen || !user) return null;

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="profile-modal">
        <div className="modal-header">
          <h3>👤 Profile</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-content">
          <div className="profile-info">
            <div className="info-item">
              <label>Name</label>
              <p>{user.name}</p>
            </div>
            <div className="info-item">
              <label>Email</label>
              <p>{user.email || user.username}</p>
            </div>
            {user.about && (
              <div className="info-item">
                <label>About</label>
                <p>{user.about}</p>
              </div>
            )}
            <div className="info-item">
              <label>Username</label>
              <p>{user.username}</p>
            </div>
          </div>

          <div className="modal-footer">
            <button className="btn-close" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
