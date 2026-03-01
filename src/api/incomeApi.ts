import axios from 'axios';
import { Income, IncomeFormData, Stats } from '../types';

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

// Income APIs
export const incomeApi = {
  create: (data: IncomeFormData) =>
    api.post('/income', data),
  
  getAll: () =>
    api.get('/income/all'),
  
  getById: (id: string | number) =>
    api.get(`/income/${id}`),
  
  update: (id: string | number, data: IncomeFormData) =>
    api.put(`/income/${id}`, data),
  
  delete: (id: string | number) =>
    api.delete(`/income/${id}`),
};

// Stats API
export const statsApi = {
  getStats: () =>
    api.get('/stats'),
};

export default api;
