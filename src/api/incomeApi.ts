import axios from 'axios';
import { Income, IncomeFormData } from '../types';

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
    console.log(`[INCOME API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('[INCOME API Request Error]', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`[INCOME API] Response received from ${response.config.url}`);
    return response.data;
  },
  (error) => {
    console.error('[INCOME API Error]', {
      message: error.message,
      response: error.response?.status,
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
);

// Income APIs
export const incomeApi = {
  // Create a new income entry
  create: (data: IncomeFormData): Promise<Income> =>
    api.post('/income', data),

  // Get all income entries
  getAll: (): Promise<Income[]> =>
    api.get('/income/all'),

  // Get income by ID
  getById: (id: string | number): Promise<Income> =>
    api.get(`/income/${id}`),

  // Get all income entries for a specific bank
  getByBank: (bankName: string): Promise<Income[]> =>
    api.get(`/income/all/${bankName}`),

  // Update income entry
  update: (id: string | number, data: IncomeFormData): Promise<Income> =>
    api.put(`/income/${id}`, data),

  // Delete income entry
  delete: (id: string | number): Promise<void> =>
    api.delete(`/income/${id}`),
};

export default api;
