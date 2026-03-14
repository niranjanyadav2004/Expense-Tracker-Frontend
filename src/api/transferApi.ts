import { Transfer, TransferFormData } from '../types';
import { apiClient } from './axiosInstance';

// Transfer APIs
export const transferApi = {
  // Create a new transfer
  create: (data: TransferFormData): Promise<string> =>
    apiClient.post('/transfer', data),

  // Get transfers for a specific bank
  getByBankName: (bankName: string): Promise<Transfer[]> =>
    apiClient.get(`/transfer/${bankName}`),

  // Get all transfers
  getAll: (): Promise<Transfer[]> =>
    apiClient.get('/transfer/all'),

  // Update an existing transfer
  update: (id: number, data: TransferFormData): Promise<Transfer> =>
    apiClient.put(`/transfer/${id}`, data),

  // Delete a transfer
  delete: (id: number): Promise<string> =>
    apiClient.delete(`/transfer/${id}`),
};
