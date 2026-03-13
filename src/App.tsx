import { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { Landing } from './components/Landing';
import { Login } from './components/Login';
import { Signup } from './components/Signup';
import { ForgotPassword } from './components/ForgotPassword';
import { ResetPassword } from './components/ResetPassword';
import { Profile } from './components/Profile';
import { BankManagement } from './components/BankManagement';
import { ConfirmationModal } from './components/ConfirmationModal';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseList } from './components/ExpenseList';
import { IncomeForm } from './components/IncomeForm';
import { IncomeList } from './components/IncomeList';
import { TransferForm } from './components/TransferForm';
import { TransferList } from './components/TransferList';
import { Dashboard } from './components/Dashboard';
import { expenseApi } from './api/expenseApi';
import { incomeApi } from './api/incomeApi';
import { statsApi } from './api/statsApi';
import { transferApi } from './api/transferApi';
import { bankApi } from './api/bankApi';
import { authApi } from './api/authApi';
import { Expense, Income, Stats, ExpenseFormData, IncomeFormData, Transfer, TransferFormData, AuthUser } from './types';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [banks, setBanks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);
  const [editingTransfer, setEditingTransfer] = useState<Transfer | null>(null);
  
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [authPage, setAuthPage] = useState<'login' | 'signup' | 'forgotPassword' | 'resetPassword'>('login');
  const [tokenFromUrl, setTokenFromUrl] = useState<string | undefined>(undefined);
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
      const [expensesData, incomesData, statsData, transfersData, banksData] = await Promise.all([
        expenseApi.getAll(),
        incomeApi.getAll(),
        statsApi.getOverallStats(),
        transferApi.getAll(),
        bankApi.getUser(),
      ]);
      setExpenses(Array.isArray(expensesData) ? expensesData : []);
      setIncomes(Array.isArray(incomesData) ? incomesData : []);
      setTransfers(Array.isArray(transfersData) ? transfersData : []);
      setBanks(Array.isArray(banksData) ? banksData : []);
      setStats((statsData as unknown as Stats) || null);
    } catch (err: any) {
      const errorMsg = err?.response?.status === 0 
        ? `🔗 Backend Connection Error: Cannot reach http://localhost:8080. Make sure your backend is running!`
        : `⚠️ API Error: ${err?.response?.status || err?.message}. Check browser console for details.`;
      setError(errorMsg);
      setExpenses([]);
      setIncomes([]);
      setTransfers([]);
      setBanks([]);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if there's a reset token in the URL
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      setTokenFromUrl(token);
      setAuthPage('resetPassword');
    }

    // Check if user is already authenticated
    const isAuth = authApi.isAuthenticated();
    console.log('[APP] App initializing, isAuthenticated:', isAuth);
    if (isAuth) {
      const storedUser = authApi.getStoredUser();
      console.log('[APP] Stored user:', storedUser?.email || 'none');
      if (storedUser) {
        setAuthUser(storedUser);
        setIsAuthenticated(true);
        console.log('[APP] User auto-logged in');
      }
    } else {
      console.log('[APP] No valid authentication found');
    }
    setAppInitializing(false);
  }, []);

  // Fetch data only when authenticated AND not resetting password
  useEffect(() => {
    if (isAuthenticated && !tokenFromUrl) {
      fetchAllData();
    }
  }, [isAuthenticated, tokenFromUrl]);

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

  const handleAddTransfer = async (data: TransferFormData) => {
    setLoading(true);
    setError('');
    try {
      await transferApi.create(data);
      await fetchAllData();
    } catch (err) {
      setError('Failed to transfer money');
      setLoading(false);
    }
  };

  const handleUpdateTransfer = async (data: TransferFormData) => {
    if (!editingTransfer) return;
    setLoading(true);
    setError('');
    try {
      await transferApi.update(editingTransfer.id, data);
      setEditingTransfer(null);
      await fetchAllData();
    } catch (err) {
      setError('Failed to update transfer');
      setLoading(false);
    }
  };

  const handleDeleteTransfer = async (id: number) => {
    setPendingDeletion({ id, type: 'income' });
    setConfirmationModal({
      isOpen: true,
      title: 'Delete Transfer',
      message: 'Are you sure you want to delete this transfer record? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      isDangerous: true,
      onConfirm: async () => {
        setLoading(true);
        setError('');
        try {
          await transferApi.delete(id);
          await fetchAllData();
          setConfirmationModal(prev => ({ ...prev, isOpen: false }));
          setPendingDeletion(null);
        } catch (err) {
          setError('Failed to delete transfer');
          setLoading(false);
          setConfirmationModal(prev => ({ ...prev, isOpen: false }));
          setPendingDeletion(null);
        }
      },
    });
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

  const handleLoginFailure = () => {
    console.log('[APP] Login failed, clearing auth state');
    setIsAuthenticated(false);
    setAuthUser(null);
    setExpenses([]);
    setIncomes([]);
    setTransfers([]);
    setBanks([]);
    setStats(null);
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
        setTransfers([]);
        setBanks([]);
        setStats(null);
        setActiveTab('dashboard');
        setShowLanding(true);
        setConfirmationModal(prev => ({ ...prev, isOpen: false }));
      },
    });
  };

  return (
    <div className="app">
      {(() => {
        console.log('[APP RENDER] isAuthenticated:', isAuthenticated, 'appInitializing:', appInitializing, 'showLanding:', showLanding, 'authPage:', authPage, 'tokenFromUrl:', tokenFromUrl);
        return null;
      })()}

      {/* PRIORITY 1: If reset password token exists, show reset password page regardless of auth status */}
      {tokenFromUrl && authPage === 'resetPassword' ? (
        <ResetPassword
          onBackToLogin={() => {
            setAuthPage('login');
            setTokenFromUrl(undefined);
          }}
          tokenFromUrl={tokenFromUrl}
        />
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
              <Dashboard stats={stats} isLoading={loading} expenses={expenses} incomes={incomes} banks={banks} transfers={transfers} />
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

            {activeTab === 'transfers' && (
              <div className="tab-content">
                <div className="form-list-wrapper">
                  <div className="form-section">
                    <h2>{editingTransfer ? 'Edit Transfer' : 'Send Money'}</h2>
                    <TransferForm
                      onSubmit={editingTransfer ? handleUpdateTransfer : handleAddTransfer}
                      initialTransfer={editingTransfer || undefined}
                      isEditMode={!!editingTransfer}
                      onCancel={() => setEditingTransfer(null)}
                      isLoading={loading}
                    />
                  </div>
                  <div className="list-section">
                    <TransferList
                      transfers={transfers}
                      isLoading={loading}
                      onRefresh={fetchAllData}
                      onEdit={setEditingTransfer}
                      onDelete={handleDeleteTransfer}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'banks' && (
              <div className="tab-content">
                <BankManagement onBankDeleted={fetchAllData} />
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
              onForgotPassword={() => setAuthPage('forgotPassword')}
              onLoginFailure={handleLoginFailure}
            />
          ) : authPage === 'signup' ? (
            <Signup
              onSignupSuccess={handleSignupSuccess}
              onSwitchToLogin={() => setAuthPage('login')}
            />
          ) : authPage === 'forgotPassword' ? (
            <ForgotPassword
              onBackToLogin={() => setAuthPage('login')}
              onEmailSubmitSuccess={() => setAuthPage('login')}
            />
          ) : (
            <ResetPassword
              onBackToLogin={() => {
                // Logout and redirect to login
                setIsAuthenticated(false);
                setAuthUser(null);
                setExpenses([]);
                setIncomes([]);
                setTransfers([]);
                setBanks([]);
                setStats(null);
                setTokenFromUrl(undefined);
                setAuthPage('login');
              }}
              tokenFromUrl={tokenFromUrl}
            />
          )}
        </>
      )}
    </div>
  );
}

export default App;
