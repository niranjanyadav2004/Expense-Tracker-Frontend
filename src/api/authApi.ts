import axios from 'axios';
import { RegisterRequest, LoginRequest, LoginResponse, RegisterResponse, RefreshTokenRequest, UpdatePasswordRequest, UpdateProfileRequest, AuthUser } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`[AUTH API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('[AUTH API Request Error]', error);
    return Promise.reject(error);
  }
);

// Add response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`[AUTH API] Response received from ${response.config.url}`);
    return response.data;
  },
  (error) => {
    console.error('[AUTH API Error]', {
      message: error.message,
      response: error.response?.status,
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
);

export const authApi = {
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    return api.post('/auth/register', data);
  },

  login: async (data: LoginRequest): Promise<LoginResponse> => {
    return api.post('/auth/login', data);
  },

  refreshToken: async (data: RefreshTokenRequest): Promise<LoginResponse> => {
    return api.post('/auth/refresh', data);
  },

  logout: () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  getStoredUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  setAuthData: (loginResponse: LoginResponse) => {
    localStorage.setItem('jwtToken', loginResponse.jwtToken);
    localStorage.setItem('refreshToken', loginResponse.refreshToken);
    const user: AuthUser = {
      username: loginResponse.username,
      name: loginResponse.name,
      role: loginResponse.role,
      email: loginResponse.email || loginResponse.username,
      userID: loginResponse.userID,
      jwtToken: loginResponse.jwtToken,
      refreshToken: loginResponse.refreshToken,
    };
    localStorage.setItem('user', JSON.stringify(user));
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('jwtToken');
  },

  updatePassword: async (data: UpdatePasswordRequest): Promise<any> => {
    return api.post('/auth/update-password', data);
  },

  updateProfile: async (data: UpdateProfileRequest): Promise<any> => {
    return api.put('/auth/update-profile', data);
  },

  updateUserData: (user: Partial<AuthUser>) => {
    const storedUser = authApi.getStoredUser();
    const updatedUser = { ...storedUser, ...user };
    localStorage.setItem('user', JSON.stringify(updatedUser));
  },
};
