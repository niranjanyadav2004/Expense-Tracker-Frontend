import { Expense, ExpenseFormData } from '../types';
import { apiClient } from './axiosInstance';

// Expense APIs
export const expenseApi = {
  // Create a new expense entry
  create: (data: ExpenseFormData): Promise<Expense> =>
    apiClient.post('/expense', data),

  // Get all expense entries
  getAll: (): Promise<Expense[]> =>
    apiClient.get('/expense/all'),

  // Get expense by ID
  getById: (id: string | number): Promise<Expense> =>
    apiClient.get(`/expense/${id}`),

  // Get all expense entries for a specific bank
  getByBank: (bankName: string): Promise<Expense[]> =>
    apiClient.get(`/expense/all/${bankName}`),

  // Update expense entry
  update: (id: string | number, data: ExpenseFormData): Promise<Expense> =>
    apiClient.put(`/expense/${id}`, data),

  // Delete expense entry
  delete: (id: string | number): Promise<void> =>
    apiClient.delete(`/expense/${id}`),
};

export default apiClient;
