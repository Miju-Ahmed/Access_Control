import React, { useState, useEffect } from 'react';
import { useTransactionsQuery, useCreateTransactionMutation, useUpdateTransactionMutation, useDeleteTransactionMutation } from '../hooks/useFinanceHooks';
import { useAuthStore } from '../store/useAuthStore';
import { Role } from '../types/auth';
import { type Transaction } from '../types/finance';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Button } from '../components/ui/button';
import { Plus, Search, Filter, Loader2, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const transactionSchema = z.object({
  amount: z.coerce.number().min(0.01, "Amount must be greater than 0"),
  category: z.string().min(2, "Category must be at least 2 characters"),
  type: z.enum(['income', 'expense']),
  date: z.string().min(1, "Date is required"),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

const RecordsList: React.FC = () => {
  const user = useAuthStore(state => state.user);
  const isAdmin = user?.role === Role.ADMIN || user?.role === Role.ANALYST;
  
  const { data: transactions, isLoading } = useTransactionsQuery();
  const createTx = useCreateTransactionMutation();
  const updateTx = useUpdateTransactionMutation();
  const deleteTx = useDeleteTransactionMutation();

  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const filteredTransactions = transactions?.filter(tx => 
    tx.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.amount.toString().includes(searchTerm)
  );

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema) as any,
    defaultValues: {
      amount: 0,
      category: "",
      type: 'expense',
      date: new Date().toISOString().split('T')[0],
    },
  });

  useEffect(() => {
    if (selectedTx) {
      form.reset({
        amount: selectedTx.amount,
        category: selectedTx.category,
        type: selectedTx.type,
        date: selectedTx.date,
      });
    } else {
      form.reset({
        amount: 0,
        category: "",
        type: 'expense',
        date: new Date().toISOString().split('T')[0],
      });
    }
  }, [selectedTx, form]);

  const onSubmit = async (values: TransactionFormValues) => {
    try {
      if (selectedTx) {
        await updateTx.mutateAsync({ id: selectedTx.id, ...values });
      } else {
        await createTx.mutateAsync(values);
      }
      setIsDialogOpen(false);
      setSelectedTx(null);
    } catch (error) {
      console.error("Failed to save transaction:", error);
    }
  };

  const handleEdit = (tx: Transaction) => {
    setSelectedTx(tx);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedTx(null);
    setIsDialogOpen(true);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-8"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Financial Records</h1>
          <p className="text-slate-500 mt-1">Manage and view all transaction history securely.</p>
        </div>
        {isAdmin && (
          <Button 
            onClick={handleAdd}
            className="bg-gradient-primary border-none shadow-lg shadow-blue-500/20 hover:scale-105 transition-transform" 
            size="lg"
          >
            <Plus className="mr-2 h-5 w-5" /> Add New Record
          </Button>
        )}
      </div>

      <Card className="glass border-none shadow-xl shadow-slate-200/40 dark:shadow-none overflow-hidden">
        <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-border/40 pb-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <CardTitle className="text-lg">Transactions List</CardTitle>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                  placeholder="Search records..." 
                  className="pl-9 bg-white dark:bg-slate-800 border-none shadow-sm" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon" className="bg-white dark:bg-slate-800 border-none shadow-sm">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
             <div className="flex flex-col items-center justify-center p-12 space-y-4">
               <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
               <p className="text-slate-500 animate-pulse">Loading transactions...</p>
             </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50/80 dark:bg-slate-900/80">
                  <TableRow className="border-none hover:bg-transparent">
                    <TableHead className="py-4 pl-6 font-semibold text-slate-500">Date</TableHead>
                    <TableHead className="py-4 font-semibold text-slate-500">Category</TableHead>
                    <TableHead className="py-4 font-semibold text-slate-500">Type</TableHead>
                    <TableHead className="py-4 text-right font-semibold text-slate-500">Amount</TableHead>
                    {isAdmin && <TableHead className="py-4 pr-6 text-right font-semibold text-slate-500">Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions?.length ? (
                    filteredTransactions.map((tx, index) => (
                      <motion.tr 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        key={tx.id}
                        className="group border-b border-border/40 hover:bg-blue-50/50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <TableCell className="pl-6 text-slate-500 font-medium">
                          {new Date(tx.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </TableCell>
                        <TableCell className="font-semibold text-slate-700 dark:text-slate-200">
                          {tx.category}
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2.5 py-1 space-x-1 capitalize rounded-lg text-xs font-bold border ${tx.type === 'income' ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20' : 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-500/10 dark:border-rose-500/20'}`}>
                            {tx.type}
                          </span>
                        </TableCell>
                        <TableCell className={`text-right whitespace-nowrap font-bold ${tx.type === 'income' ? 'text-emerald-500' : 'text-slate-800 dark:text-slate-200'}`}>
                          {tx.type === 'income' ? '+' : '-'}${tx.amount.toLocaleString()}
                        </TableCell>
                        {isAdmin && (
                          <TableCell className="pr-6 text-right">
                             <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleEdit(tx)}
                                className="hover:bg-slate-200 dark:hover:bg-slate-700"
                              >
                                Edit
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => deleteTx.mutate(tx.id)}
                                disabled={deleteTx.isPending}
                                className="text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10"
                              >
                                {deleteTx.isPending && deleteTx.variables === tx.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </TableCell>
                        )}
                      </motion.tr>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={isAdmin ? 5 : 4} className="h-32 text-center text-slate-500">
                        No transactions found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] glass">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gradient">
              {selectedTx ? 'Edit Record' : 'Add New Record'}
            </DialogTitle>
            <DialogDescription>
              Record your financial transactions accurately below.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-4 pt-4">
              <FormField
                control={form.control as any}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount ($)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01" 
                        placeholder="0.00" 
                        {...field} 
                        onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                        className="bg-white/50 dark:bg-black/50" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control as any}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input placeholder="Rent, Salary, Groceries..." {...field} className="bg-white/50 dark:bg-black/50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control as any}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transaction Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value as string}>
                      <FormControl>
                        <SelectTrigger className="bg-white/50 dark:bg-black/50">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="glass">
                        <SelectItem value="income">Income (+)</SelectItem>
                        <SelectItem value="expense">Expense (-)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control as any}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transaction Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} className="bg-white/50 dark:bg-black/50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="pt-6">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-gradient-primary border-none shadow-lg shadow-blue-500/20"
                  disabled={createTx.isPending || updateTx.isPending}
                >
                  {(createTx.isPending || updateTx.isPending) && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {selectedTx ? 'Save Changes' : 'Add Record'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default RecordsList;

