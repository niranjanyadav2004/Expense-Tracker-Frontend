import { Stats } from '../types';
import { apiClient } from './axiosInstance';

// Stats API
export const statsApi = {
  // Get overall stats for all accounts
  getOverallStats: (): Promise<Stats> =>
    apiClient.get('/stats/overall'),

  // Get stats for a specific bank account
  getBankStats: (bankName: string): Promise<Stats> =>
    apiClient.get(`/stats/bank/${bankName}`),
};

export default apiClient;
