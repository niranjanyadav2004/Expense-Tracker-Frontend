import { BankAccount, BankFormData } from '../types';
import { apiClient } from './axiosInstance';

// Bank APIs
export const bankApi = {
  // Create a new bank account
  create: (data: BankFormData): Promise<BankAccount> =>
    apiClient.post('/bank/create', data),

  // Get all bank accounts for the current user
  getAll: (): Promise<BankAccount[]> =>
    apiClient.get('/bank/getAll'),

  // Get bank accounts by bank name
  getByBankName: (bankName: string): Promise<BankAccount[]> =>
    apiClient.get(`/bank/get/name/${bankName}`),

  // Get bank account by account number
  getByAccountNumber: (accountNumber: string): Promise<BankAccount> =>
    apiClient.get(`/bank/get/accountNumber/${accountNumber}`),

  // Get all user's bank accounts
  getUser: (): Promise<BankAccount[]> =>
    apiClient.get('/bank/get/user'),

  // Update a bank account
  update: (id: string, data: BankFormData): Promise<BankAccount> =>
    apiClient.put(`/bank/update/${id}`, data),

  // Delete a bank account
  delete: (accountNumber: string): Promise<void> =>
    apiClient.delete(`/bank/delete/${accountNumber}`),
};

export default apiClient;
