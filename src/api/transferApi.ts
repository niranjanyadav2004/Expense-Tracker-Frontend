import axios from 'axios';
import { Transfer, TransferFormData } from '../types';

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
    console.log(`[TRANSFER API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('[TRANSFER API Request Error]', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`[TRANSFER API] Response received from ${response.config.url}`);
    return response.data;
  },
  (error) => {
    console.error('[TRANSFER API Error]', {
      message: error.message,
      response: error.response?.status,
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
);

// Transfer APIs
export const transferApi = {
  // Create a new transfer
  create: (data: TransferFormData): Promise<string> =>
    api.post('/transfer', data),

  // Get transfers for a specific bank
  getByBankName: (bankName: string): Promise<Transfer[]> =>
    api.get(`/transfer/${bankName}`),

  // Get all transfers
  getAll: (): Promise<Transfer[]> =>
    api.get('/transfer/all'),

  // Update an existing transfer
  update: (id: number, data: TransferFormData): Promise<Transfer> =>
    api.put(`/transfer/${id}`, data),

  // Delete a transfer
  delete: (id: number): Promise<string> =>
    api.delete(`/transfer/${id}`),
};
