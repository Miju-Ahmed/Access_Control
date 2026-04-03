import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Button } from '../components/ui/button';
import { Plus, UserCog, UserCheck, UserX, Loader2, Search } from 'lucide-react';
import { Role, type User } from '../types/auth';
import { motion } from 'framer-motion';
import { 
  useUsersQuery, 
  useCreateUserMutation, 
  useUpdateUserMutation, 
  useToggleUserStatusMutation 
} from '../hooks/useUsersHooks';
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
import { Input } from "../components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  role: z.nativeEnum(Role),
});

type UserFormValues = z.infer<typeof userSchema>;

const UsersList: React.FC = () => {
  const { data: users, isLoading } = useUsersQuery();
  const createUser = useCreateUserMutation();
  const updateUser = useUpdateUserMutation();
  const toggleStatus = useToggleUserStatusMutation();

  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const filteredUsers = users?.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema) as any,
    defaultValues: {
      name: "",
      email: "",
      role: Role.VIEWER,
    },
  });

  useEffect(() => {
    if (selectedUser) {
      form.reset({
        name: selectedUser.name,
        email: selectedUser.email,
        role: selectedUser.role,
      });
    } else {
      form.reset({
        name: "",
        email: "",
        role: Role.VIEWER,
      });
    }
  }, [selectedUser, form]);

  const onSubmit = async (values: UserFormValues) => {
    try {
      if (selectedUser) {
        await updateUser.mutateAsync({ id: selectedUser.id, ...values });
      } else {
        await createUser.mutateAsync(values);
      }
      setIsDialogOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Failed to save user:", error);
    }
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedUser(null);
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
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">User Management</h1>
          <p className="text-slate-500 mt-1">Configure roles and permissions for system users.</p>
        </div>
        <Button 
          onClick={handleAdd}
          className="bg-gradient-primary border-none shadow-lg shadow-blue-500/20 hover:scale-105 transition-transform" 
          size="lg"
        >
          <Plus className="mr-2 h-5 w-5" /> Add New User
        </Button>
      </div>

      <Card className="glass border-none shadow-xl shadow-slate-200/40 dark:shadow-none overflow-hidden">
        <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-border/40 pb-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-lg font-semibold">
              <UserCog className="text-blue-500" />
              <CardTitle>System Users</CardTitle>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search users..." 
                className="pl-9 bg-white dark:bg-slate-800 border-none shadow-sm" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/80 dark:bg-slate-900/80">
                <TableRow className="border-none hover:bg-transparent">
                  <TableHead className="py-4 pl-6 font-semibold text-slate-500">Name</TableHead>
                  <TableHead className="py-4 font-semibold text-slate-500">Email</TableHead>
                  <TableHead className="py-4 font-semibold text-slate-500">Role</TableHead>
                  <TableHead className="py-4 font-semibold text-slate-500">Status</TableHead>
                  <TableHead className="py-4 pr-6 text-right font-semibold text-slate-500">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                        <span className="text-slate-500">Loading users...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredUsers?.map((u, index) => (
                  <motion.tr 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    key={u.id}
                    className="group border-b border-border/40 hover:bg-blue-50/50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <TableCell className="pl-6">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold shadow-sm">
                          {u.name.charAt(0)}
                        </div>
                        <span className="font-semibold text-slate-700 dark:text-slate-200">{u.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-500">{u.email}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border 
                        ${u.role === Role.ADMIN ? 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/10 dark:border-indigo-500/20' 
                        : u.role === Role.ANALYST ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:border-blue-500/20' 
                        : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'}`}>
                        {u.role}
                      </span>
                    </TableCell>
                    <TableCell>
                      {u.isActive ? (
                        <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium text-sm">
                          <UserCheck size={16} /> Active
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-slate-400 font-medium text-sm">
                          <UserX size={16} /> Inactive
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="pr-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEdit(u)}
                          className="hover:bg-slate-200 dark:hover:bg-slate-700"
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          disabled={toggleStatus.isPending}
                          onClick={() => toggleStatus.mutate(u.id)}
                          className={`hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10 ${u.isActive ? 'text-slate-400' : 'text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10'}`}
                        >
                          {toggleStatus.isPending && toggleStatus.variables === u.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            u.isActive ? 'Deactivate' : 'Activate'
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] glass">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gradient">
              {selectedUser ? 'Edit User' : 'Add New User'}
            </DialogTitle>
            <DialogDescription>
              {selectedUser 
                ? "Update the user's information and access level below." 
                : "Fill in the details below to create a new user account."}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-4 pt-4">
              <FormField
                control={form.control as any}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} className="bg-white/50 dark:bg-black/50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control as any}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input placeholder="john@example.com" {...field} className="bg-white/50 dark:bg-black/50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control as any}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>System Role</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value as string}>
                      <FormControl>
                        <SelectTrigger className="bg-white/50 dark:bg-black/50">
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="glass">
                        <SelectItem value={Role.ADMIN}>Admin (Full Access)</SelectItem>
                        <SelectItem value={Role.ANALYST}>Analyst (Read/Write)</SelectItem>
                        <SelectItem value={Role.VIEWER}>Viewer (Read Only)</SelectItem>
                      </SelectContent>
                    </Select>
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
                  disabled={createUser.isPending || updateUser.isPending}
                >
                  {(createUser.isPending || updateUser.isPending) && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {selectedUser ? 'Save Changes' : 'Create User'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default UsersList;

