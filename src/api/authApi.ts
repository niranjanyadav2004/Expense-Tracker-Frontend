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
    // Only add Authorization header if we have a valid token
    if (token && typeof token === 'string' && token !== 'undefined' && token.length > 0) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(`[AUTH API] Adding Authorization header for ${config.method?.toUpperCase()} ${config.url}`);
    } else {
      console.log(`[AUTH API] NO TOKEN - ${config.method?.toUpperCase()} ${config.url}`);
    }
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
    sessionStorage.removeItem('jwtToken');
    sessionStorage.removeItem('refreshToken');
    sessionStorage.removeItem('user');
    console.log('[AUTH API] User logged out and all credentials cleared');
  },

  getStoredUser: () => {
    try {
      const user = localStorage.getItem('user');
      if (user) {
        const parsedUser = JSON.parse(user);
        // Only return user if it has a valid token
        if (parsedUser.jwtToken && typeof parsedUser.jwtToken === 'string' && parsedUser.jwtToken.length > 0) {
          return parsedUser;
        }
      }
    } catch (err) {
      console.error('[AUTH API] Error parsing stored user:', err);
    }
    return null;
  },

  setAuthData: (loginResponse: LoginResponse): boolean => {
    // Validate that we have a valid token before storing
    if (!loginResponse.jwtToken || typeof loginResponse.jwtToken !== 'string' || loginResponse.jwtToken.length === 0) {
      console.error('[AUTH API] Invalid jwtToken received:', loginResponse.jwtToken);
      return false;
    }
    
    localStorage.setItem('jwtToken', loginResponse.jwtToken);
    localStorage.setItem('refreshToken', loginResponse.refreshToken || '');
    const user: AuthUser = {
      username: loginResponse.username,
      name: loginResponse.name,
      role: loginResponse.role,
      email: loginResponse.email || loginResponse.username,
      userID: loginResponse.userID,
      jwtToken: loginResponse.jwtToken,
      refreshToken: loginResponse.refreshToken || '',
      about: loginResponse.about || '',
    };
    localStorage.setItem('user', JSON.stringify(user));
    console.log('[AUTH API] Auth data set for user:', loginResponse.email);
    return true;
  },

  isAuthenticated: () => {
    const token = localStorage.getItem('jwtToken');
    // Check that token is a valid non-empty string
    return !!token && typeof token === 'string' && token !== 'undefined' && token.length > 0;
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
