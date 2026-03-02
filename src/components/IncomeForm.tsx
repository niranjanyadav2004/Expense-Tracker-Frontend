import { useState, useEffect } from 'react';
import { Income, IncomeFormData, BankAccount } from '../types';
import { bankApi } from '../api/bankApi';
import './IncomeForm.css';

interface IncomeFormProps {
  onSubmit: (data: IncomeFormData) => Promise<void>;
  initialData?: Income;
  isLoading?: boolean;
}

export const IncomeForm = ({ onSubmit, initialData, isLoading = false }: IncomeFormProps) => {
  const [formData, setFormData] = useState<IncomeFormData>({
    title: '',
    amount: '',
    date: '',
    category: '',
    description: '',
    bankName: '',
  });

  const [banks, setBanks] = useState<BankAccount[]>([]);
  const [banksLoading, setBanksLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch available banks on mount
  useEffect(() => {
    const fetchBanks = async () => {
      try {
        setBanksLoading(true);
        const bankList = await bankApi.getUser();
        setBanks(bankList);
        if (bankList.length > 0 && !formData.bankName) {
          setFormData(prev => ({
            ...prev,
            bankName: bankList[0].bankName,
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

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        amount: initialData.amount,
        date: initialData.date,
        category: initialData.category,
        description: initialData.description,
        bankName: initialData.bankName || '',
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? (value === '' ? '' : parseFloat(value)) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.bankName) {
      setError('Please select a bank account');
      return;
    }
    await onSubmit(formData);
    if (!initialData) {
      setFormData({
        title: '',
        amount: '',
        date: '',
        category: '',
        description: '',
        bankName: banks.length > 0 ? banks[0].bankName : '',
      });
    }
  };

  if (banksLoading) {
    return <div className="income-form loading">Loading bank accounts...</div>;
  }

  if (banks.length === 0) {
    return (
      <div className="income-form error-message">
        <p>No bank accounts available. Please create a bank account first.</p>
      </div>
    );
  }

  return (
    <form className="income-form" onSubmit={handleSubmit}>
      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label htmlFor="bankName">Bank Account</label>
        <select
          id="bankName"
          name="bankName"
          value={formData.bankName}
          onChange={handleChange}
          required
          disabled={isLoading || banksLoading}
        >
          <option value="">Select a bank account</option>
          {banks.map(bank => (
            <option key={bank.id} value={bank.bankName}>
              {bank.bankName} - {bank.accountNumber} (Balance: ₹{bank.balance.toFixed(2)})
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          disabled={isLoading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="amount">Amount</label>
        <input
          type="number"
          id="amount"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          required
          step="0.01"
          placeholder="0.00"
          disabled={isLoading}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            placeholder="e.g., Salary"
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          disabled={isLoading}
        />
      </div>

      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Saving...' : (initialData ? 'Update Income' : 'Add Income')}
      </button>
    </form>
  );
};
