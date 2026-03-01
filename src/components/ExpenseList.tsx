import { Expense } from '../types';
import './ExpenseList.css';

interface ExpenseListProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: number) => void;
  isLoading?: boolean;
}

export const ExpenseList = ({ expenses, onEdit, onDelete, isLoading = false }: ExpenseListProps) => {
  const expenseList = Array.isArray(expenses) ? expenses : [];
  
  if (expenseList.length === 0) {
    return <div className="empty-state">No expenses found. Add one to get started!</div>;
  }

  const totalExpense = expenseList.reduce((sum, expense) => sum + (expense?.amount || 0), 0);

  return (
    <div className="expense-list-container">
      <div className="expense-summary">
        <h3>Total Expenses: ₹{totalExpense.toFixed(2)}</h3>
      </div>
      <div className="expense-list">
        {expenseList.map(expense => (
          <div key={expense.id} className="expense-item">
            <div className="expense-header">
              <h4>{expense.title}</h4>
              <span className="expense-amount">₹{expense.amount.toFixed(2)}</span>
            </div>
            <p className="expense-description">{expense.description}</p>
            <div className="expense-meta">
              <span className="badge">{expense.category}</span>
              <span className="date">{new Date(expense.date).toLocaleDateString()}</span>
            </div>
            <div className="expense-actions">
              <button 
                className="btn-edit" 
                onClick={() => onEdit(expense)}
                disabled={isLoading}
              >
                Edit
              </button>
              <button 
                className="btn-delete" 
                onClick={() => onDelete(expense.id)}
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
