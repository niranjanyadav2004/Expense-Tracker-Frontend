import { Stats } from '../types';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import './Analytics.css';

interface AnalyticsProps {
  stats: Stats | null;
  onClose: () => void;
}

export const Analytics = ({ stats, onClose }: AnalyticsProps) => {
  if (!stats) {
    return null;
  }

  const totalIncome = stats?.income || 0;
  const totalExpense = stats?.expense || 0;
  const balance = stats?.balance || 0;
  const expensePercentage = totalIncome > 0 ? (totalExpense / totalIncome) * 100 : 0;
  const savingsPercentage = totalIncome > 0 ? (balance / totalIncome) * 100 : 0;

  // Data for bar chart
  const barChartData = [
    { name: 'Income', value: totalIncome, fill: '#10b981' },
    { name: 'Expense', value: totalExpense, fill: '#ef4444' },
    { name: 'Balance', value: balance, fill: '#646cff' },
  ];

  // Data for pie chart
  const pieChartData = [
    { name: 'Saved', value: balance, fill: '#10b981' },
    { name: 'Spent', value: totalExpense, fill: '#ef4444' },
  ];

  // Data for statistics trend
  const statsData = [
    { name: 'Income', value: totalIncome },
    { name: 'Expense', value: totalExpense },
    { name: 'Balance', value: balance },
  ];

  return (
    <div className="analytics-modal-overlay" onClick={onClose}>
      <div className="analytics-modal" onClick={(e) => e.stopPropagation()}>
        <div className="analytics-header">
          <h2>📊 Financial Analytics</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="analytics-content">
          {/* Income vs Expense Bar Chart */}
          <div className="chart-card">
            <h3>💰 Income vs Expense vs Balance</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `₹${value}`} />
                <Bar dataKey="value" fill="#8884d8" radius={[8, 8, 0, 0]}>
                  {barChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Spending Ratio Pie Chart */}
          <div className="chart-card">
            <h3>📈 Spending Ratio</h3>
            <div className="pie-chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value, percent }) => `${name}: ₹${value.toFixed(0)} (${(percent * 100).toFixed(1)}%)`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `₹${value}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="metrics-grid">
            <div className="metric-card">
              <h4>💵 Total Income</h4>
              <p className="metric-value income">₹{totalIncome.toFixed(2)}</p>
            </div>
            <div className="metric-card">
              <h4>💸 Total Expense</h4>
              <p className="metric-value expense">₹{totalExpense.toFixed(2)}</p>
            </div>
            <div className="metric-card">
              <h4>💰 Total Balance</h4>
              <p className="metric-value balance">₹{balance.toFixed(2)}</p>
            </div>
            <div className="metric-card">
              <h4>📊 Expense Ratio</h4>
              <p className="metric-value">{expensePercentage.toFixed(1)}%</p>
            </div>
            <div className="metric-card">
              <h4>✅ Savings Rate</h4>
              <p className="metric-value">{savingsPercentage.toFixed(1)}%</p>
            </div>
            <div className="metric-card">
              <h4>📅 Avg Monthly Expense</h4>
              <p className="metric-value">₹{(totalExpense / Math.max(1, 30)).toFixed(2)}</p>
            </div>
          </div>

          {/* Summary */}
          <div className="summary-box">
            <h3>📈 Financial Summary</h3>
            <ul className="summary-list">
              <li>💰 <strong>Total Lifetime Income:</strong> ₹{totalIncome.toFixed(2)}</li>
              <li>💸 <strong>Total Lifetime Expense:</strong> ₹{totalExpense.toFixed(2)}</li>
              <li>💵 <strong>Total Savings:</strong> ₹{balance.toFixed(2)} ({savingsPercentage.toFixed(1)}%)</li>
              <li>📊 <strong>Expense Percentage:</strong> {expensePercentage.toFixed(1)}% of income</li>
              <li>📅 <strong>Monthly Average Expense:</strong> ₹{(totalExpense / Math.max(1, 30)).toFixed(2)}</li>
              <li>✅ <strong>Savings Amount:</strong> ₹{balance.toFixed(2)}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
