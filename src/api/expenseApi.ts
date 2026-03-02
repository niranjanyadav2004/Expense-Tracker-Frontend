import axios from 'axios';
import { Expense, ExpenseFormData } from '../types';

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
    console.log(`[EXPENSE API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('[EXPENSE API Request Error]', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`[EXPENSE API] Response received from ${response.config.url}`);
    return response.data;
  },
  (error) => {
    console.error('[EXPENSE API Error]', {
      message: error.message,
      response: error.response?.status,
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
);

// Expense APIs
export const expenseApi = {
  // Create a new expense entry
  create: (data: ExpenseFormData): Promise<Expense> =>
    api.post('/expense', data),

  // Get all expense entries
  getAll: (): Promise<Expense[]> =>
    api.get('/expense/all'),

  // Get expense by ID
  getById: (id: string | number): Promise<Expense> =>
    api.get(`/expense/${id}`),

  // Get all expense entries for a specific bank
  getByBank: (bankName: string): Promise<Expense[]> =>
    api.get(`/expense/all/${bankName}`),

  // Update expense entry
  update: (id: string | number, data: ExpenseFormData): Promise<Expense> =>
    api.put(`/expense/${id}`, data),

  // Delete expense entry
  delete: (id: string | number): Promise<void> =>
    api.delete(`/expense/${id}`),
};

export default api;
