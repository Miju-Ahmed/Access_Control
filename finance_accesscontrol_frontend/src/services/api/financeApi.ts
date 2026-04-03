import { axiosClient } from './axiosClient';
import { Transaction, DashboardMetrics } from '../../types/finance';

// Mock Data
let mockTransactions: Transaction[] = [
  { id: '1', amount: 5000, category: 'Salary', type: 'income', date: '2023-10-01' },
  { id: '2', amount: 200, category: 'Groceries', type: 'expense', date: '2023-10-02' },
  { id: '3', amount: 50, category: 'Utilities', type: 'expense', date: '2023-10-05' },
];

export const getTransactions = async (): Promise<Transaction[]> => {
  // const { data } = await axiosClient.get<Transaction[]>('/finance/transactions');
  // return data;
  return new Promise((resolve) => setTimeout(() => resolve([...mockTransactions]), 500));
};

export const getDashboardMetrics = async (): Promise<DashboardMetrics> => {
  // const { data } = await axiosClient.get<DashboardMetrics>('/finance/metrics');
  // return data;
  return new Promise((resolve) => setTimeout(() => {
    resolve({
      totalIncome: 5000,
      totalExpenses: 250,
      netBalance: 4750,
      categoryBreakdown: [
        { category: 'Groceries', amount: 200 },
        { category: 'Utilities', amount: 50 },
      ],
      monthlyTrends: [
        { month: 'Jan', income: 4000, expenses: 2400 },
        { month: 'Feb', income: 3000, expenses: 1398 },
        { month: 'Mar', income: 2000, expenses: 9800 },
        { month: 'Apr', income: 2780, expenses: 3908 },
        { month: 'May', income: 1890, expenses: 4800 },
        { month: 'Jun', income: 2390, expenses: 3800 },
        { month: 'Jul', income: 3490, expenses: 4300 },
      ],
      recentTransactions: mockTransactions.slice(0, 5)
    });
  }, 500));
};

export const createTransaction = async (transaction: Omit<Transaction, 'id'>): Promise<Transaction> => {
  return new Promise((resolve) => setTimeout(() => {
    const newTx = { ...transaction, id: Math.random().toString(36).substring(7) };
    mockTransactions.push(newTx);
    resolve(newTx);
  }, 500));
};
