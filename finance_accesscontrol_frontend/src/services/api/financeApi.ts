import { type Transaction, type DashboardMetrics } from '../../types/finance';

// Mock Data State
let mockTransactions: Transaction[] = [
  { id: '1', amount: 5000, category: 'Salary', type: 'income', date: '2023-10-01' },
  { id: '2', amount: 200, category: 'Groceries', type: 'expense', date: '2023-10-02' },
  { id: '3', amount: 50, category: 'Utilities', type: 'expense', date: '2023-10-05' },
  { id: '4', amount: 1200, category: 'Freelance', type: 'income', date: '2023-10-10' },
  { id: '5', amount: 150, category: 'Dining', type: 'expense', date: '2023-10-12' },
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getTransactions = async (): Promise<Transaction[]> => {
  await delay(600);
  return [...mockTransactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const createTransaction = async (transaction: Omit<Transaction, 'id'>): Promise<Transaction> => {
  await delay(800);
  const newTx = { ...transaction, id: Math.random().toString(36).substring(7) };
  mockTransactions = [newTx, ...mockTransactions];
  return newTx;
};

export const updateTransaction = async (data: { id: string } & Partial<Transaction>): Promise<Transaction> => {
  await delay(800);
  let updatedTx: Transaction | undefined;
  mockTransactions = mockTransactions.map(tx => {
    if (tx.id === data.id) {
      updatedTx = { ...tx, ...data };
      return updatedTx;
    }
    return tx;
  });
  if (!updatedTx) throw new Error('Transaction not found');
  return updatedTx;
};

export const deleteTransaction = async (id: string): Promise<void> => {
  await delay(600);
  mockTransactions = mockTransactions.filter(tx => tx.id !== id);
};

export const getDashboardMetrics = async (): Promise<DashboardMetrics> => {
  await delay(800);
  
  const totalIncome = mockTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpenses = mockTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const categoryMap: Record<string, number> = {};
  mockTransactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
    });

  const categoryBreakdown = Object.entries(categoryMap).map(([category, amount]) => ({
    category,
    amount
  }));

  // Simple static monthly trends for now, could be dynamic later
  const monthlyTrends = [
    { month: 'Jan', income: 4000, expenses: 2400 },
    { month: 'Feb', income: 3000, expenses: 1398 },
    { month: 'Mar', income: 2000, expenses: 9800 },
    { month: 'Oct', income: totalIncome, expenses: totalExpenses },
  ];

  return {
    totalIncome,
    totalExpenses,
    netBalance: totalIncome - totalExpenses,
    categoryBreakdown,
    monthlyTrends,
    recentTransactions: mockTransactions.slice(0, 5)
  };
};
