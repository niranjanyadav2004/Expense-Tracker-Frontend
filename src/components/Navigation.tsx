import { useState } from 'react';
import './Navigation.css';
import { AuthUser } from '../types';
import { ThemeToggle } from './ThemeToggle';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  user?: AuthUser | null;
  onLogout?: () => void;
}

export const Navigation = ({ activeTab, onTabChange, user, onLogout }: NavigationProps) => {
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

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
          </div>
          {user && (
            <div className="nav-user-section">
              <ThemeToggle />
              <div className="user-dropdown">
                <button
                  className="user-name-btn"
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  title="Click to open menu"
                >
                  👤 {user.name}
                </button>
                {isUserDropdownOpen && (
                  <div className="dropdown-menu">
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        onTabChange('profile');
                        setIsUserDropdownOpen(false);
                      }}
                    >
                      Profile
                    </button>
                    <button
                      className="dropdown-item logout-item"
                      onClick={() => {
                        onLogout?.();
                        setIsUserDropdownOpen(false);
                      }}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};
