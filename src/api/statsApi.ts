import axios from 'axios';
import { Stats } from '../types';

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
    console.log(`[STATS API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('[STATS API Request Error]', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`[STATS API] Response received from ${response.config.url}`);
    return response.data;
  },
  (error) => {
    console.error('[STATS API Error]', {
      message: error.message,
      response: error.response?.status,
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
);

// Stats API
export const statsApi = {
  // Get overall stats for all accounts
  getOverallStats: (): Promise<Stats> =>
    api.get('/stats/overall'),

  // Get stats for a specific bank account
  getBankStats: (bankName: string): Promise<Stats> =>
    api.get(`/stats/bank/${bankName}`),
};

export default api;
