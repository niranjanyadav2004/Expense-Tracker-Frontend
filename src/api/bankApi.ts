import axios from 'axios';
import { BankAccount, BankFormData } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`[BANK API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('[BANK API Request Error]', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`[BANK API] Response received from ${response.config.url}`);
    return response.data;
  },
  (error) => {
    console.error('[BANK API Error]', {
      message: error.message,
      response: error.response?.status,
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
);

// Bank APIs
export const bankApi = {
  // Create a new bank account
  create: (data: BankFormData): Promise<BankAccount> =>
    api.post('/bank/create', data),

  // Get all bank accounts for the current user
  getAll: (): Promise<BankAccount[]> =>
    api.get('/bank/getAll'),

  // Get bank accounts by bank name
  getByBankName: (bankName: string): Promise<BankAccount[]> =>
    api.get(`/bank/get/name/${bankName}`),

  // Get bank account by account number
  getByAccountNumber: (accountNumber: string): Promise<BankAccount> =>
    api.get(`/bank/get/accountNumber/${accountNumber}`),

  // Get all user's bank accounts
  getUser: (): Promise<BankAccount[]> =>
    api.get('/bank/get/user'),

  // Update a bank account
  update: (id: string, data: BankFormData): Promise<BankAccount> =>
    api.put(`/bank/update/${id}`, data),

  // Delete a bank account
  delete: (accountNumber: string): Promise<void> =>
    api.delete(`/bank/delete/${accountNumber}`),
};

export default api;
