import { useState, useEffect } from 'react';
import { Stats, Expense, Income, BankAccount, Transfer } from '../types';
import { Analytics } from './Analytics';
import { ActivityCalendar } from './ActivityCalendar';
import { bankApi } from '../api/bankApi';
import { statsApi } from '../api/statsApi';
import { expenseApi } from '../api/expenseApi';
import { incomeApi } from '../api/incomeApi';
import { transferApi } from '../api/transferApi';
import './Dashboard.css';

interface DashboardProps {
  stats: Stats | null;
  isLoading: boolean;
  expenses: Expense[];
  incomes: Income[];
  banks?: BankAccount[];
  transfers?: Transfer[];
}

export const Dashboard = ({ stats, isLoading, expenses, incomes, banks: banksProp = [], transfers: transfersProp = [] }: DashboardProps) => {
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [banks, setBanks] = useState<BankAccount[]>(banksProp);
  const [transfers, setTransfers] = useState<Transfer[]>(transfersProp);
  const [selectedBank, setSelectedBank] = useState<string>('overall');
  const [bankStats, setBankStats] = useState<Stats | null>(null);
  const [banksLoading, setBanksLoading] = useState(false);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [filteredIncomes, setFilteredIncomes] = useState<Income[]>([]);
  const [filteredTransfers, setFilteredTransfers] = useState<Transfer[]>([]);
  const [transLoading, setTransLoading] = useState(false);

  // Update banks and transfers when props change
  useEffect(() => {
    setBanks(banksProp);
    setTransfers(transfersProp);
  }, [banksProp, transfersProp]);

  // Load bank-specific stats and transactions when bank selection changes
  useEffect(() => {
    const fetchBankData = async () => {
      if (selectedBank === 'overall') {
        setBankStats(stats);
        setFilteredExpenses(expenses);
        setFilteredIncomes(incomes);
        setFilteredTransfers(transfers);
        return;
      }

      try {
        setTransLoading(true);
        const [bankStatsData, bankExpensesData, bankIncomesData, bankTransfersData] = await Promise.all([
          statsApi.getBankStats(selectedBank),
          expenseApi.getByBank(selectedBank),
          incomeApi.getByBank(selectedBank),
          transferApi.getByBankName(selectedBank),
        ]);
        
        // Get actual bank account balance to reflect transfers
        const selectedBankAccount = banks.find(b => b.bankName === selectedBank);
        
        // Merge stats with actual bank balance
        const enhancedBankStats = {
          ...bankStatsData,
          balance: selectedBankAccount?.balance || bankStatsData.balance,
        };
        
        setBankStats(enhancedBankStats);
        setFilteredExpenses(Array.isArray(bankExpensesData) ? bankExpensesData : []);
        setFilteredIncomes(Array.isArray(bankIncomesData) ? bankIncomesData : []);
        setFilteredTransfers(Array.isArray(bankTransfersData) ? bankTransfersData : []);
      } catch (err) {
        console.error('Failed to fetch bank data:', err);
        setBankStats(null);
        setFilteredExpenses([]);
        setFilteredIncomes([]);
        setFilteredTransfers([]);
      } finally {
        setTransLoading(false);
      }
    };

    fetchBankData();
  }, [selectedBank, stats, expenses, incomes, banks, transfers]);

  if (isLoading || !stats || !bankStats) {
    return <div className="empty-state">Loading statistics...</div>;
  }

  // Calculate percentages for visualization
  const totalIncome = bankStats?.income || 0;
  const totalExpense = bankStats?.expense || 0;
  const balance = bankStats?.balance || 0;
  const totalTransfers = selectedBank === 'overall' 
    ? transfers.reduce((sum, t) => sum + t.amount, 0)
    : filteredTransfers.reduce((sum, t) => sum + t.amount, 0);
  const expensePercentage = totalIncome > 0 ? (totalExpense / totalIncome) * 100 : 0;
  const savingsPercentage = totalIncome > 0 ? (balance / totalIncome) * 100 : 0;

  return (
    <div className="dashboard">
      {/* Dashboard Header with Calendar */}
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        {!banksLoading && banks.length > 0 && (
          <div className="bank-filter">
            <label htmlFor="bank-select">View by Bank:</label>
            <select
              id="bank-select"
              value={selectedBank}
              onChange={(e) => setSelectedBank(e.target.value)}
              className="bank-select"
            >
              <option value="overall">Overall</option>
              {banks.map(bank => (
                <option key={bank.id} value={bank.bankName}>
                  {bank.bankName} - {bank.accountNumber}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Calendar positioned on the right via grid */}
      <ActivityCalendar expenses={filteredExpenses} incomes={filteredIncomes} transfers={filteredTransfers} />

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

        <div className="stat-card transfer">
          <h3>Total Transfers</h3>
          <p className="stat-value">₹{(totalTransfers || 0).toFixed(2)}</p>
          <p className="stat-change">{selectedBank === 'overall' ? transfers.length : filteredTransfers.length} transfers</p>
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
          {bankStats?.latestIncome && (
            <div className="latest-card">
              <h3>Latest Income</h3>
              <div className="latest-content">
                <p><strong>{bankStats.latestIncome.title}</strong></p>
                <p className="amount income-color">+₹{bankStats.latestIncome.amount.toFixed(2)}</p>
                <p className="meta">{bankStats.latestIncome.category} • {new Date(bankStats.latestIncome.date).toLocaleDateString()}</p>
                {bankStats.latestIncome.bankName && (
                  <p className="bank-info">📊 {bankStats.latestIncome.bankName}</p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="transactions-column">
          {bankStats?.lastestExpense && (
            <div className="latest-card">
              <h3>Latest Expense</h3>
              <div className="latest-content">
                <p><strong>{bankStats.lastestExpense.title}</strong></p>
                <p className="amount expense-color">-₹{bankStats.lastestExpense.amount.toFixed(2)}</p>
                <p className="meta">{bankStats.lastestExpense.category} • {new Date(bankStats.lastestExpense.date).toLocaleDateString()}</p>
                {bankStats.lastestExpense.bankName && (
                  <p className="bank-info">📊 {bankStats.lastestExpense.bankName}</p>
                )}
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
      {showAnalytics && <Analytics stats={bankStats || stats} onClose={() => setShowAnalytics(false)} />}
    </div>
  );
};
