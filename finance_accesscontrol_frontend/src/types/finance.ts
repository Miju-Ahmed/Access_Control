export interface Transaction {
  id: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
  date: string;
}

export interface DashboardMetrics {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  categoryBreakdown: { category: string; amount: number }[];
  monthlyTrends: { month: string; income: number; expenses: number }[];
  recentTransactions: Transaction[];
}
