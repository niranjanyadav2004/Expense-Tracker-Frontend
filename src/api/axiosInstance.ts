/**
 * Centralized Axios Instance
 * All API modules should use this instance for consistency
 * This ensures all requests share the same configuration and interceptors
 * 
 * The baseURL is loaded at runtime from public/config.json
 */

import axios from 'axios';
import { getConfig } from '../config';

// Create axios instance with runtime configuration
export const apiClient = axios.create({
  baseURL: getConfig().api.baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

// Request Interceptor - Add JWT token
apiClient.interceptors.request.use(
  (config) => {
    // Update baseURL from runtime config (in case it changed)
    config.baseURL = getConfig().api.baseURL;

    const token = localStorage.getItem('jwtToken');
    if (token && typeof token === 'string' && token !== 'undefined' && token.length > 0) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Response Interceptor - Handle errors
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('[API Response Error]', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
);

export default apiClient;
