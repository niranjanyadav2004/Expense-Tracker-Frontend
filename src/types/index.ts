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
