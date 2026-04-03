import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { useLogin } from '../hooks/useAuthHooks';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const { mutate: login, isPending } = useLogin();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'admin@test.com',
      password: 'password',
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    setErrorMsg(null);
    login(data, {
      onError: (error: any) => {
        setErrorMsg(error.message || 'Login failed. Please try again.');
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Animated Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/20 mix-blend-multiply filter blur-3xl opacity-50 animate-blob" />
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/20 mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000" />
      <div className="absolute bottom-[-20%] left-[20%] w-[40%] h-[40%] rounded-full bg-cyan-500/20 mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="glass shadow-2xl border-white/20">
          <CardHeader className="space-y-2 text-center pb-8 pt-8">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <CardTitle className="text-4xl font-bold tracking-tight text-gradient mb-2">FinDash</CardTitle>
            </motion.div>
            <CardDescription className="text-base text-slate-600 dark:text-slate-400">
              Enter your credentials to access the dashboard
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-destructive/15 text-destructive text-sm p-4 rounded-lg border border-destructive/20 font-medium"
                >
                  {errorMsg}
                </motion.div>
              )}
              <div className="space-y-3">
                <Label htmlFor="email" className="text-slate-700 dark:text-slate-300 font-medium ml-1">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...register('email')}
                  className={`h-12 bg-white/50 dark:bg-black/50 border-white/20 focus-visible:ring-blue-500 transition-all ${errors.email ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                />
                {errors.email && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-destructive pl-1">{errors.email.message}</motion.p>
                )}
              </div>
              <div className="space-y-3">
                <Label htmlFor="password" className="text-slate-700 dark:text-slate-300 font-medium ml-1">Password</Label>
                <Input
                  id="password"
                  type="password"
                  {...register('password')}
                  className={`h-12 bg-white/50 dark:bg-black/50 border-white/20 focus-visible:ring-blue-500 transition-all ${errors.password ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                />
                {errors.password && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-destructive pl-1">{errors.password.message}</motion.p>
                )}
              </div>
            </CardContent>
            <CardFooter className="pb-8 pt-4">
              <Button 
                className="w-full h-12 text-md font-semibold bg-gradient-primary border-0 transition-transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-blue-500/25" 
                type="submit" 
                disabled={isPending}
              >
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Signing in...
                  </span>
                ) : 'Sign In'}
              </Button>
            </CardFooter>
          </form>
          <div className="text-center pb-6 text-xs text-slate-500 dark:text-slate-400">
            Demo Credentials:<br/>
            <span className="font-semibold select-all mt-1 inline-block">admin@test.com</span> / <span className="font-semibold">password</span>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
