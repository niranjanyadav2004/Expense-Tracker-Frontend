import { useState } from 'react';
import './Navigation.css';
import { AuthUser } from '../types';
import { ProfileModal } from './ProfileModal';
import { ThemeToggle } from './ThemeToggle';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  user?: AuthUser | null;
  onLogout?: () => void;
}

export const Navigation = ({ activeTab, onTabChange, user, onLogout }: NavigationProps) => {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          <h1 className="nav-brand">💰 Expense Tracker</h1>
          <div className="nav-links">
            <button
              className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => onTabChange('dashboard')}
            >
              Dashboard
            </button>
            <button
              className={`nav-link ${activeTab === 'expenses' ? 'active' : ''}`}
              onClick={() => onTabChange('expenses')}
            >
              Expenses
            </button>
            <button
              className={`nav-link ${activeTab === 'income' ? 'active' : ''}`}
              onClick={() => onTabChange('income')}
            >
              Income
            </button>
            {user && (
              <>
                <button
                  className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
                  onClick={() => onTabChange('profile')}
                >
                  Profile
                </button>
              </>
            )}
          </div>
          {user && (
            <div className="nav-user-section">
              <ThemeToggle />
              <button
                className="user-name-btn"
                onClick={() => setIsProfileModalOpen(true)}
                title="Click to view profile"
              >
                👤 {user.name}
              </button>
              <button className="nav-logout-btn" onClick={onLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      {user && (
        <ProfileModal
          user={user}
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          onViewProfile={() => onTabChange('profile')}
        />
      )}
    </>
  );
};
