import { create } from 'zustand';
import { User } from '../types/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  isHydrated: boolean;
}

export const useAuthStore = create<AuthState>((set) => {
  const storedUser = localStorage.getItem('finance_user');
  const storedToken = localStorage.getItem('finance_token');
  
  return {
    user: storedUser ? JSON.parse(storedUser) : null,
    token: storedToken ? storedToken : null,
    isHydrated: true,
    setAuth: (user, token) => {
      localStorage.setItem('finance_user', JSON.stringify(user));
      localStorage.setItem('finance_token', token);
      set({ user, token });
    },
    logout: () => {
      localStorage.removeItem('finance_user');
      localStorage.removeItem('finance_token');
      set({ user: null, token: null });
    }
  };
});
