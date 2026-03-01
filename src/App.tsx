import { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { Landing } from './components/Landing';
import { Login } from './components/Login';
import { Signup } from './components/Signup';
import { Profile } from './components/Profile';
import { ConfirmationModal } from './components/ConfirmationModal';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseList } from './components/ExpenseList';
import { IncomeForm } from './components/IncomeForm';
import { IncomeList } from './components/IncomeList';
import { Dashboard } from './components/Dashboard';
import { expenseApi } from './api/expenseApi';
import { incomeApi, statsApi } from './api/incomeApi';
import { authApi } from './api/authApi';
import { Expense, Income, Stats, ExpenseFormData, IncomeFormData, AuthUser } from './types';
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
  
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [authPage, setAuthPage] = useState<'login' | 'signup'>('login');
  const [appInitializing, setAppInitializing] = useState(true);
  const [showLanding, setShowLanding] = useState(true);

  // Confirmation modal state
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    isDangerous: false,
    onConfirm: (() => {}) as () => void,
  });

  // Pending deletion state
  const [pendingDeletion, setPendingDeletion] = useState<{
    id: number;
    type: 'expense' | 'income';
  } | null>(null);

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
    // Check if user is already authenticated
    const isAuth = authApi.isAuthenticated();
    if (isAuth) {
      const storedUser = authApi.getStoredUser();
      if (storedUser) {
        setAuthUser(storedUser);
        setIsAuthenticated(true);
      }
    }
    setAppInitializing(false);
  }, []);

  // Fetch data only when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchAllData();
    }
  }, [isAuthenticated]);

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
    setPendingDeletion({ id, type: 'expense' });
    setConfirmationModal({
      isOpen: true,
      title: 'Delete Expense',
      message: 'Are you sure you want to delete this expense? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      isDangerous: true,
      onConfirm: async () => {
        setLoading(true);
        setError('');
        try {
          await expenseApi.delete(id);
          await fetchAllData();
          setConfirmationModal(prev => ({ ...prev, isOpen: false }));
          setPendingDeletion(null);
        } catch (err) {
          setError('Failed to delete expense');
          setLoading(false);
          setConfirmationModal(prev => ({ ...prev, isOpen: false }));
          setPendingDeletion(null);
        }
      },
    });
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
    setPendingDeletion({ id, type: 'income' });
    setConfirmationModal({
      isOpen: true,
      title: 'Delete Income',
      message: 'Are you sure you want to delete this income record? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      isDangerous: true,
      onConfirm: async () => {
        setLoading(true);
        setError('');
        try {
          await incomeApi.delete(id);
          await fetchAllData();
          setConfirmationModal(prev => ({ ...prev, isOpen: false }));
          setPendingDeletion(null);
        } catch (err) {
          setError('Failed to delete income');
          setLoading(false);
          setConfirmationModal(prev => ({ ...prev, isOpen: false }));
          setPendingDeletion(null);
        }
      },
    });
  };

  const handleLoginSuccess = () => {
    const storedUser = authApi.getStoredUser();
    if (storedUser) {
      setAuthUser(storedUser);
      setIsAuthenticated(true);
      setActiveTab('dashboard');
    }
  };

  const handleSignupSuccess = () => {
    setAuthPage('login');
  };

  const handleLogout = () => {
    setConfirmationModal({
      isOpen: true,
      title: 'Logout',
      message: 'Are you sure you want to logout? You will need to login again to access your expenses and income.',
      confirmText: 'Logout',
      cancelText: 'Stay',
      isDangerous: true,
      onConfirm: () => {
        authApi.logout();
        setIsAuthenticated(false);
        setAuthUser(null);
        setExpenses([]);
        setIncomes([]);
        setStats(null);
        setActiveTab('dashboard');
        setShowLanding(true);
        setConfirmationModal(prev => ({ ...prev, isOpen: false }));
      },
    });
  };

  return (
    <div className="app">
      {appInitializing ? (
        <div className="loading-message">Initializing...</div>
      ) : isAuthenticated ? (
        <>
          <Navigation
            activeTab={activeTab}
            onTabChange={setActiveTab}
            user={authUser}
            onLogout={handleLogout}
          />
          
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

            {activeTab === 'profile' && (
              <Profile user={authUser} onUpdateUser={setAuthUser} />
            )}
          </div>

          <ConfirmationModal
            isOpen={confirmationModal.isOpen}
            title={confirmationModal.title}
            message={confirmationModal.message}
            confirmText={confirmationModal.confirmText}
            cancelText={confirmationModal.cancelText}
            isDangerous={confirmationModal.isDangerous}
            onConfirm={confirmationModal.onConfirm}
            onCancel={() => setConfirmationModal(prev => ({ ...prev, isOpen: false }))}
          />
        </>
      ) : showLanding ? (
        <Landing onGetStarted={() => setShowLanding(false)} />
      ) : (
        <>
          {authPage === 'login' ? (
            <Login
              onLoginSuccess={handleLoginSuccess}
              onSwitchToSignup={() => setAuthPage('signup')}
            />
          ) : (
            <Signup
              onSignupSuccess={handleSignupSuccess}
              onSwitchToLogin={() => setAuthPage('login')}
            />
          )}
        </>
      )}
    </div>
  );
}

export default App;
