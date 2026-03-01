import './Navigation.css';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  return (
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
      </div>
    </nav>
  );
};
