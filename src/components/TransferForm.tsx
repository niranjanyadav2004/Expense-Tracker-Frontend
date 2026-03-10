import { useState, useEffect } from 'react';
import { TransferFormData, BankAccount, Transfer } from '../types';
import { bankApi } from '../api/bankApi';
import './TransferForm.css';

interface TransferFormProps {
  onSubmit: (data: TransferFormData) => Promise<void>;
  isLoading?: boolean;
  initialTransfer?: Transfer;
  isEditMode?: boolean;
  onCancel?: () => void;
}

export const TransferForm = ({ onSubmit, isLoading = false, initialTransfer, isEditMode = false, onCancel }: TransferFormProps) => {
  const [formData, setFormData] = useState<TransferFormData>({
    fromBankName: initialTransfer?.fromBankName || '',
    toBankName: initialTransfer?.toBankName || '',
    amount: initialTransfer?.amount.toString() || '',
    date: initialTransfer?.date || new Date().toISOString().split('T')[0],
    description: initialTransfer?.description || '',
  });

  const [banks, setBanks] = useState<BankAccount[]>([]);
  const [banksLoading, setBanksLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch available banks on mount
  useEffect(() => {
    const fetchBanks = async () => {
      try {
        setBanksLoading(true);
        const bankList = await bankApi.getUser();
        setBanks(bankList);
        if (bankList.length > 0 && !formData.fromBankName) {
          setFormData(prev => ({
            ...prev,
            fromBankName: bankList[0].bankName,
          }));
        }
      } catch (err) {
        console.error('Failed to fetch banks:', err);
        setError('Failed to load bank accounts. Please try again.');
      } finally {
        setBanksLoading(false);
      }
    };

    fetchBanks();
  }, []);

  // Update form data when initialTransfer changes (for edit mode)
  useEffect(() => {
    if (initialTransfer) {
      setFormData({
        fromBankName: initialTransfer.fromBankName,
        toBankName: initialTransfer.toBankName,
        amount: initialTransfer.amount.toString(),
        date: initialTransfer.date,
        description: initialTransfer.description,
      });
    }
  }, [initialTransfer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? (value === '' ? '' : parseFloat(value)) : value,
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation
    if (!formData.fromBankName) {
      setError('Please select a source bank account');
      return;
    }
    if (!formData.toBankName) {
      setError('Please select a destination bank account');
      return;
    }
    if (formData.fromBankName === formData.toBankName) {
      setError('Source and destination banks cannot be the same');
      return;
    }
    if (!formData.amount || Number(formData.amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    if (!formData.date) {
      setError('Please select a date');
      return;
    }
    if (!formData.description.trim()) {
      setError('Please enter a description');
      return;
    }

    try {
      await onSubmit(formData);
      const actionText = isEditMode ? 'updated' : 'transferred';
      setSuccess(`✓ Successfully ${actionText} ₹${Number(formData.amount).toLocaleString()}`);
      
      // Only reset form if not in edit mode
      if (!isEditMode) {
        setFormData({
          fromBankName: formData.fromBankName,
          toBankName: '',
          amount: '',
          date: new Date().toISOString().split('T')[0],
          description: '',
        });
      }
      setTimeout(() => setSuccess(null), 4000);
    } catch (err) {
      console.error('Transfer submission error:', err);
    }
  };

  const fromBank = banks.find(b => b.bankName === formData.fromBankName);
  const toBank = banks.find(b => b.bankName === formData.toBankName);

  return (
    <div className="transfer-form-container">
      <form className="transfer-form-google-pay" onSubmit={handleSubmit}>
        {error && <div className="transfer-alert error-alert">{error}</div>}
        {success && <div className="transfer-alert success-alert">{success}</div>}

        {/* From Bank */}
        <div className="transfer-section">
          <label className="transfer-label">From</label>
          <select
            name="fromBankName"
            value={formData.fromBankName}
            onChange={handleChange}
            disabled={banksLoading || isLoading}
            className="transfer-select"
            required
          >
            <option value="">Select your bank</option>
            {banks.map((bank) => (
              <option key={bank.id} value={bank.bankName}>
                {bank.bankName}
              </option>
            ))}
          </select>
          {fromBank && (
            <div className="bank-details">
              <span className="account-number">{fromBank.accountNumber}</span>
              <span className="balance">Balance: ₹{fromBank.balance.toLocaleString()}</span>
            </div>
          )}
        </div>

        {/* To Bank */}
        <div className="transfer-section">
          <label className="transfer-label">To</label>
          <select
            name="toBankName"
            value={formData.toBankName}
            onChange={handleChange}
            disabled={banksLoading || isLoading}
            className="transfer-select"
            required
          >
            <option value="">Select recipient bank</option>
            {banks.map((bank) => (
              <option key={bank.id} value={bank.bankName}>
                {bank.bankName}
              </option>
            ))}
          </select>
          {toBank && (
            <div className="bank-details">
              <span className="account-number">{toBank.accountNumber}</span>
            </div>
          )}
        </div>

        {/* Amount */}
        <div className="transfer-section">
          <label className="transfer-label">Amount</label>
          <div className="amount-input-wrapper">
            <span className="currency-symbol">₹</span>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0"
              className="amount-input"
              step="0.01"
              min="0"
              disabled={isLoading}
              required
            />
          </div>
        </div>

        {/* Date */}
        <div className="transfer-section">
          <label className="transfer-label">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="transfer-input"
            disabled={isLoading}
            required
          />
        </div>

        {/* Description */}
        <div className="transfer-section">
          <label className="transfer-label">Add a note</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="What's this for? (e.g., EMI payment, Monthly savings)"
            className="transfer-textarea"
            disabled={isLoading}
            required
          />
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          className="transfer-btn-submit"
          disabled={isLoading || banksLoading}
        >
          {isLoading ? '⏳ Processing...' : isEditMode ? '✓ Update Transfer' : '→ Send Money'}
        </button>

        {isEditMode && onCancel && (
          <button 
            type="button" 
            className="transfer-btn-cancel"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </button>
        )}
      </form>
    </div>
  );
};
