import { Income, IncomeFormData } from '../types';
import { apiClient } from './axiosInstance';

// Income APIs
export const incomeApi = {
  // Create a new income entry
  create: (data: IncomeFormData): Promise<Income> =>
    apiClient.post('/income', data),

  // Get all income entries
  getAll: (): Promise<Income[]> =>
    apiClient.get('/income/all'),

  // Get income by ID
  getById: (id: string | number): Promise<Income> =>
    apiClient.get(`/income/${id}`),

  // Get all income entries for a specific bank
  getByBank: (bankName: string): Promise<Income[]> =>
    apiClient.get(`/income/all/${bankName}`),

  // Update income entry
  update: (id: string | number, data: IncomeFormData): Promise<Income> =>
    apiClient.put(`/income/${id}`, data),

  // Delete income entry
  delete: (id: string | number): Promise<void> =>
    apiClient.delete(`/income/${id}`),
};

export default apiClient;
