import { Income } from '../types';
import './IncomeList.css';

interface IncomeListProps {
  incomes: Income[];
  onEdit: (income: Income) => void;
  onDelete: (id: number) => void;
  isLoading?: boolean;
}

export const IncomeList = ({ incomes, onEdit, onDelete, isLoading = false }: IncomeListProps) => {
  const incomeList = Array.isArray(incomes) ? incomes : [];
  
  if (incomeList.length === 0) {
    return <div className="empty-state">No income records found. Add one to get started!</div>;
  }

  const totalIncome = incomeList.reduce((sum, income) => sum + (income?.amount || 0), 0);

  return (
    <div className="income-list-container">
      <div className="income-summary">
        <h3>Total Income: ₹{totalIncome.toFixed(2)}</h3>
      </div>
      <div className="income-list">
        {incomeList.map(income => (
          <div key={income.id} className="income-item">
            <div className="income-header">
              <h4>{income.title}</h4>
              <span className="income-amount">₹{income.amount.toFixed(2)}</span>
            </div>
            <p className="income-description">{income.description}</p>
            <div className="income-meta">
              <span className="badge">{income.category}</span>
              <span className="date">{new Date(income.date).toLocaleDateString()}</span>
            </div>
            <div className="income-actions">
              <button 
                className="btn-edit" 
                onClick={() => onEdit(income)}
                disabled={isLoading}
              >
                Edit
              </button>
              <button 
                className="btn-delete" 
                onClick={() => onDelete(income.id)}
                disabled={isLoading}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
