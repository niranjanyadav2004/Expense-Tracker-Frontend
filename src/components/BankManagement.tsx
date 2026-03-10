import { useState, useEffect } from 'react';
import { BankAccount, BankFormData } from '../types';
import { bankApi } from '../api/bankApi';
import { ConfirmationModal } from './ConfirmationModal';
import './BankManagement.css';

interface BankManagementProps {
  onBankDeleted?: () => void;
}

export const BankManagement = ({ onBankDeleted }: BankManagementProps) => {
  const [banks, setBanks] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [successClosing, setSuccessClosing] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBank, setEditingBank] = useState<BankAccount | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<BankAccount | null>(null);

  const [formData, setFormData] = useState<BankFormData>({
    bankName: '',
    accountNumber: '',
  });

  const [formLoading, setFormLoading] = useState(false);

  // Fetch banks on mount
  useEffect(() => {
    fetchBanks();
  }, []);

  // Auto-clear success message after 2.5 seconds with fade-out
  useEffect(() => {
    if (success) {
      const fadeTimer = setTimeout(() => {
        setSuccessClosing(true);
      }, 2300); // Start fade-out 200ms before final clear
      
      const clearTimer = setTimeout(() => {
        setSuccess(null);
        setSuccessClosing(false);
      }, 2500);
      
      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(clearTimer);
      };
    }
  }, [success]);

  const fetchBanks = async () => {
    try {
      setLoading(true);
      setError(null);
      const bankList = await bankApi.getUser();
      setBanks(bankList);
    } catch (err) {
      console.error('Failed to fetch banks:', err);
      setError('Failed to load bank accounts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenForm = (bank?: BankAccount) => {
    if (bank) {
      setEditingBank(bank);
      setFormData({
        bankName: bank.bankName,
        accountNumber: bank.accountNumber,
      });
    } else {
      setEditingBank(null);
      setFormData({
        bankName: '',
        accountNumber: '',
      });
    }
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingBank(null);
    setFormData({
      bankName: '',
      accountNumber: '',
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setError(null);

    try {
      if (editingBank) {
        // Update existing bank - include current balance so it doesn't change
        const updateData: BankFormData = {
          bankName: formData.bankName,
          accountNumber: formData.accountNumber,
          balance: editingBank.balance, // Send current balance to backend
        };
        await bankApi.update(editingBank.id, updateData);
        setSuccess('Bank account updated successfully');
      } else {
        // Create new bank
        await bankApi.create(formData);
        setSuccess('Bank account created successfully');
      }
      handleCloseForm();
      await fetchBanks();
    } catch (err) {
      console.error('Failed to save bank:', err);
      setError('Failed to save bank account. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (bank: BankAccount) => {
    setDeleteConfirm(bank);
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;

    setFormLoading(true);
    setError(null);

    try {
      await bankApi.delete(deleteConfirm.accountNumber);
      setSuccess('Bank account deleted successfully');
      setDeleteConfirm(null);
      await fetchBanks();
      
      // Trigger parent to refresh transaction data
      if (onBankDeleted) {
        onBankDeleted();
      }
    } catch (err) {
      console.error('Failed to delete bank:', err);
      setError('Failed to delete bank account. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) {
    return <div className="bank-management loading">Loading bank accounts...</div>;
  }

  return (
    <div className="bank-management">
      <div className="bank-header">
        <h2>Bank Accounts</h2>
        <button className="btn-primary" onClick={() => handleOpenForm()}>
          Add Bank Account
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className={`success-message ${successClosing ? 'closing' : ''}`}>{success}</div>}

      {isFormOpen && (
        <div className="bank-form-container">
          <div className="bank-form-card">
            <h3>{editingBank ? 'Edit Bank Account' : 'Add New Bank Account'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="bankName">Bank Name</label>
                <input
                  type="text"
                  id="bankName"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                  required
                  disabled={formLoading}
                  placeholder="e.g., HDFC, ICICI"
                />
              </div>

              <div className="form-group">
                <label htmlFor="accountNumber">Account Number</label>
                <input
                  type="text"
                  id="accountNumber"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  required
                  disabled={formLoading}
                  placeholder="e.g., HDFC123456"
                />
              </div>

              <div className="form-actions">
                <button type="submit" disabled={formLoading} className="btn-primary">
                  {formLoading ? 'Saving...' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={handleCloseForm}
                  disabled={formLoading}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {banks.length === 0 ? (
        <div className="no-banks">
          <p>No bank accounts yet. Create your first bank account to get started.</p>
        </div>
      ) : (
        <div className="banks-list">
          {banks.map(bank => (
            <div key={bank.id} className="bank-card">
              <div className="bank-info">
                <h3>{bank.bankName}</h3>
                <p className="account-number">{bank.accountNumber}</p>
                <p className="account-holder">Account Holder: {bank.accountHolder}</p>
              </div>

              <div className="bank-balance">
                <p className="balance-label">Balance</p>
                <p className="balance-amount">₹{bank.balance.toFixed(2)}</p>
              </div>

              <div className="bank-actions">
                <button
                  className="btn-edit"
                  onClick={() => handleOpenForm(bank)}
                  disabled={formLoading}
                >
                  Edit
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(bank)}
                  disabled={formLoading}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmationModal
        isOpen={!!deleteConfirm}
        title="Delete Bank Account"
        message={`Are you sure you want to delete ${deleteConfirm?.bankName} (${deleteConfirm?.accountNumber})? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirm(null)}
        isLoading={formLoading}
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous={true}
      />
    </div>
  );
};
