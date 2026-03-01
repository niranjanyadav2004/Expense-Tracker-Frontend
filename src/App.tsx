import { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseList } from './components/ExpenseList';
import { IncomeForm } from './components/IncomeForm';
import { IncomeList } from './components/IncomeList';
import { Dashboard } from './components/Dashboard';
import { expenseApi } from './api/expenseApi';
import { incomeApi, statsApi } from './api/incomeApi';
import { Expense, Income, Stats, ExpenseFormData, IncomeFormData } from './types';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);

  const fetchAllData = async () => {
    setLoading(true);
    setError('');
    try {
      const [expensesData, incomesData, statsData] = await Promise.all([
        expenseApi.getAll(),
        incomeApi.getAll(),
        statsApi.getStats(),
      ]);
      setExpenses(Array.isArray(expensesData) ? expensesData : []);
      setIncomes(Array.isArray(incomesData) ? incomesData : []);
      setStats((statsData as unknown as Stats) || null);
    } catch (err: any) {
      const errorMsg = err?.response?.status === 0 
        ? `🔗 Backend Connection Error: Cannot reach http://localhost:8080. Make sure your backend is running!`
        : `⚠️ API Error: ${err?.response?.status || err?.message}. Check browser console for details.`;
      setError(errorMsg);
      setExpenses([]);
      setIncomes([]);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleAddExpense = async (data: ExpenseFormData) => {
    setLoading(true);
    setError('');
    try {
      await expenseApi.create(data);
      await fetchAllData();
    } catch (err) {
      setError('Failed to add expense');
      setLoading(false);
    }
  };

  const handleUpdateExpense = async (data: ExpenseFormData) => {
    if (!editingExpense) return;
    setLoading(true);
    setError('');
    try {
      await expenseApi.update(editingExpense.id, data);
      setEditingExpense(null);
      await fetchAllData();
    } catch (err) {
      setError('Failed to update expense');
      setLoading(false);
    }
  };

  const handleDeleteExpense = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;
    setLoading(true);
    setError('');
    try {
      await expenseApi.delete(id);
      await fetchAllData();
    } catch (err) {
      setError('Failed to delete expense');
      setLoading(false);
    }
  };

  const handleAddIncome = async (data: IncomeFormData) => {
    setLoading(true);
    setError('');
    try {
      await incomeApi.create(data);
      await fetchAllData();
    } catch (err) {
      setError('Failed to add income');
      setLoading(false);
    }
  };

  const handleUpdateIncome = async (data: IncomeFormData) => {
    if (!editingIncome) return;
    setLoading(true);
    setError('');
    try {
      await incomeApi.update(editingIncome.id, data);
      setEditingIncome(null);
      await fetchAllData();
    } catch (err) {
      setError('Failed to update income');
      setLoading(false);
    }
  };

  const handleDeleteIncome = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this income record?')) return;
    setLoading(true);
    setError('');
    try {
      await incomeApi.delete(id);
      await fetchAllData();
    } catch (err) {
      setError('Failed to delete income');
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      {error && <div className="error-banner">{error}</div>}

      <div className="container">
        {loading && !expenses.length && !incomes.length && (
          <div className="loading-message">Loading data...</div>
        )}

        {activeTab === 'dashboard' && (
          <Dashboard stats={stats} isLoading={loading} expenses={expenses} incomes={incomes} />
        )}

        {activeTab === 'expenses' && (
          <div className="tab-content">
            <div className="form-list-wrapper">
              <div className="form-section">
                <h2>{editingExpense ? 'Edit Expense' : 'Add New Expense'}</h2>
                <ExpenseForm
                  onSubmit={editingExpense ? handleUpdateExpense : handleAddExpense}
                  initialData={editingExpense || undefined}
                  isLoading={loading}
                />
              </div>
              <div className="list-section">
                <h2>Your Expenses</h2>
                <ExpenseList
                  expenses={expenses}
                  onEdit={setEditingExpense}
                  onDelete={handleDeleteExpense}
                  isLoading={loading}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'income' && (
          <div className="tab-content">
            <div className="form-list-wrapper">
              <div className="form-section">
                <h2>{editingIncome ? 'Edit Income' : 'Add New Income'}</h2>
                <IncomeForm
                  onSubmit={editingIncome ? handleUpdateIncome : handleAddIncome}
                  initialData={editingIncome || undefined}
                  isLoading={loading}
                />
              </div>
              <div className="list-section">
                <h2>Your Income Records</h2>
                <IncomeList
                  incomes={incomes}
                  onEdit={setEditingIncome}
                  onDelete={handleDeleteIncome}
                  isLoading={loading}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
