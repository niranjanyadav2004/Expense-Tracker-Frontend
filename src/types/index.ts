export interface Expense {
  id: number;
  title: string;
  description: string;
  category: string;
  date: string;
  amount: number;
}

export interface Income {
  id: number;
  title: string;
  amount: number;
  date: string;
  category: string;
  description: string;
}

export interface Stats {
  income: number;
  expense: number;
  latestIncome: Income;
  lastestExpense: Expense;
  balance: number;
  minIncome: number;
  maxIncome: number;
  minExpense: number;
  maxExpense: number;
}

export interface ExpenseFormData {
  title: string;
  description: string;
  category: string;
  date: string;
  amount: number | string;
}

export interface IncomeFormData {
  title: string;
  amount: number | string;
  date: string;
  category: string;
  description: string;
}

// Auth Types
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  about: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  jwtToken: string;
  refreshToken: string;
  username: string;
  name: string;
  role: string;
  email?: string;
  userID?: string;
}

export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateProfileRequest {
  name?: string;
  about?: string;
}

export interface RegisterResponse {
  userID: string;
  name: string;
  email: string;
  password: string;
  about: string;
  role: string;
  enabled: boolean;
  username: string;
  authorities: Array<{ authority: string }>;
  accountNonLocked: boolean;
  credentialsNonExpired: boolean;
  accountNonExpired: boolean;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface AuthUser {
  userID?: string;
  username: string;
  name: string;
  email?: string;
  role: string;
  about?: string;
  jwtToken: string;
  refreshToken: string;
}
