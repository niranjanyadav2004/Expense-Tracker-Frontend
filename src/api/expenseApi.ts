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
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`[API] Response received from ${response.config.url}`);
    return response.data;
  },
  (error) => {
    console.error('[API Error]', {
      message: error.message,
      response: error.response?.status,
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
);

// Expense APIs
export const expenseApi = {
  create: (data: ExpenseFormData) =>
    api.post('/expense', data),
  
  getAll: () =>
    api.get('/expense/all'),
  
  getById: (id: string | number) =>
    api.get(`/expense/${id}`),
  
  update: (id: string | number, data: ExpenseFormData) =>
    api.put(`/expense/${id}`, data),
  
  delete: (id: string | number) =>
    api.delete(`/expense/${id}`),
};

export default api;
