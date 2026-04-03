import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTransactions } from '../services/api/financeApi';
import { useAuthStore } from '../store/useAuthStore';
import { Role } from '../types/auth';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Button } from '../components/ui/button';
import { Plus } from 'lucide-react';

const RecordsList: React.FC = () => {
  const user = useAuthStore(state => state.user);
  const isAdmin = user?.role === Role.ADMIN;
  
  const { data: transactions, isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: getTransactions,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Financial Records</h1>
        {isAdmin && (
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Record
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
          <div className="flex items-center gap-4 pt-4">
            <Input placeholder="Search records..." className="max-w-sm" />
            {/* Filters would go here */}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Loading records...</div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    {isAdmin && <TableHead className="text-right">Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions?.length ? (
                    transactions.map((tx) => (
                      <TableRow key={tx.id}>
                        <TableCell>{new Date(tx.date).toLocaleDateString()}</TableCell>
                        <TableCell className="font-medium">{tx.category}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2 py-1 space-x-1 capitalize rounded-md text-xs font-medium ${tx.type === 'income' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                            {tx.type}
                          </span>
                        </TableCell>
                        <TableCell className="text-right whitespace-nowrap">
                          {tx.type === 'income' ? '+' : '-'}${tx.amount.toLocaleString()}
                        </TableCell>
                        {isAdmin && (
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">Edit</Button>
                          </TableCell>
                        )}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={isAdmin ? 5 : 4} className="h-24 text-center">
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RecordsList;
