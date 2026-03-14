import axios from 'axios';
import { RegisterRequest, LoginRequest, LoginResponse, RegisterResponse, RefreshTokenRequest, UpdatePasswordRequest, UpdateProfileRequest, AuthUser } from '../types';
import { apiClient } from './axiosInstance';
import { config } from '../config';

export const authApi = {
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    return apiClient.post('/auth/register', data);
  },

  login: async (data: LoginRequest): Promise<LoginResponse> => {
    return apiClient.post('/auth/login', data);
  },

  forgotPassword: async (email: string): Promise<any> => {
    // Don't use the interceptor for this endpoint since it's permitAll
    return axios.post(`${config.api.baseURL}/auth/forget-password`, { email }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },

  refreshToken: async (data: RefreshTokenRequest): Promise<LoginResponse> => {
    return apiClient.post('/auth/refresh', data);
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
    return apiClient.post('/auth/update-password', data);
  },

  resetPassword: async (accessToken: string, newPassword: string): Promise<any> => {
    // Don't use the interceptor for this endpoint since it's permitAll
    return axios.post(`${config.api.baseURL}/auth/reset-password?token=${accessToken}`, {
      password: newPassword,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },

  updateProfile: async (data: UpdateProfileRequest): Promise<any> => {
    return apiClient.put('/auth/update-profile', data);
  },

  updateUserData: (user: Partial<AuthUser>) => {
    const storedUser = authApi.getStoredUser();
    const updatedUser = { ...storedUser, ...user };
    localStorage.setItem('user', JSON.stringify(updatedUser));
  },
};
