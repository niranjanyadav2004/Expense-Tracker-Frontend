import { useState } from 'react';
import { Stats, Expense, Income } from '../types';
import { Analytics } from './Analytics';
import { ActivityCalendar } from './ActivityCalendar';
import './Dashboard.css';

interface DashboardProps {
  stats: Stats | null;
  isLoading: boolean;
  expenses: Expense[];
  incomes: Income[];
}

export const Dashboard = ({ stats, isLoading, expenses, incomes }: DashboardProps) => {
  const [showAnalytics, setShowAnalytics] = useState(false);

  if (isLoading || !stats) {
    return <div className="empty-state">Loading statistics...</div>;
  }

  // Calculate percentages for visualization
  const totalIncome = stats?.income || 0;
  const totalExpense = stats?.expense || 0;
  const balance = stats?.balance || 0;
  const expensePercentage = totalIncome > 0 ? (totalExpense / totalIncome) * 100 : 0;
  const savingsPercentage = totalIncome > 0 ? (balance / totalIncome) * 100 : 0;

  return (
    <div className="dashboard">
      {/* Dashboard Header with Calendar */}
      <div className="dashboard-header">
        <h1>Dashboard</h1>
      </div>

      {/* Calendar positioned on the right via grid */}
      <ActivityCalendar expenses={expenses} incomes={incomes} />

      {/* Main Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card income">
          <h3>Total Income</h3>
          <p className="stat-value">₹{(totalIncome || 0).toFixed(2)}</p>
          <p className="stat-change">Lifetime income</p>
        </div>

        <div className="stat-card expense">
          <h3>Total Expense</h3>
          <p className="stat-value">₹{(totalExpense || 0).toFixed(2)}</p>
          <p className="stat-change">{expensePercentage.toFixed(1)}% of income</p>
        </div>

        <div className="stat-card balance">
          <h3>Balance</h3>
          <p className="stat-value">₹{(balance || 0).toFixed(2)}</p>
          <p className="stat-change">{savingsPercentage.toFixed(1)}% saved</p>
        </div>
      </div>

      {/* Analytics Button */}
      <div className="analytics-button-container">
        <button className="analytics-btn" onClick={() => setShowAnalytics(true)}>
          📊 View Detailed Analytics
        </button>
      </div>

      {/* Latest Transactions Summary */}
      <div className="latest-transactions">
        <div className="transactions-column">
          {stats?.latestIncome && (
            <div className="latest-card">
              <h3>Latest Income</h3>
              <div className="latest-content">
                <p><strong>{stats.latestIncome.title}</strong></p>
                <p className="amount income-color">+₹{stats.latestIncome.amount.toFixed(2)}</p>
                <p className="meta">{stats.latestIncome.category} • {new Date(stats.latestIncome.date).toLocaleDateString()}</p>
              </div>
            </div>
          )}
        </div>

        <div className="transactions-column">
          {stats?.lastestExpense && (
            <div className="latest-card">
              <h3>Latest Expense</h3>
              <div className="latest-content">
                <p><strong>{stats.lastestExpense.title}</strong></p>
                <p className="amount expense-color">-₹{stats.lastestExpense.amount.toFixed(2)}</p>
                <p className="meta">{stats.lastestExpense.category} • {new Date(stats.lastestExpense.date).toLocaleDateString()}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats Overview */}
      <div className="quick-stats">
        <div className="quick-stat">
          <h4>Savings Rate</h4>
          <p>{savingsPercentage.toFixed(1)}%</p>
        </div>
        <div className="quick-stat">
          <h4>Spending Ratio</h4>
          <p>{expensePercentage.toFixed(1)}%</p>
        </div>
        <div className="quick-stat">
          <h4>Monthly Avg Expense</h4>
          <p>₹{(totalExpense / Math.max(1, 30)).toFixed(2)}</p>
        </div>
      </div>

      {/* Analytics Modal */}
      {showAnalytics && <Analytics stats={stats} onClose={() => setShowAnalytics(false)} />}
    </div>
  );
};
