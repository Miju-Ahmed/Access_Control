import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuthStore } from '../../store/useAuthStore';
import { LogOut, Bell, Search } from 'lucide-react';
import { Button } from '../ui/button';
import { motion, AnimatePresence } from 'framer-motion';

const MainLayout: React.FC = () => {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-slate-50/50 dark:bg-slate-950 overflow-hidden text-slate-900 dark:text-slate-100 font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 bg-gradient-to-br from-slate-100/50 to-blue-50/30 dark:from-slate-900 dark:to-indigo-950/20">
        <header className="h-20 border-b border-border/40 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl flex items-center justify-between px-8 shrink-0 shadow-[0_4px_30px_rgba(0,0,0,0.02)] z-10">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-full max-w-md hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="w-full pl-10 pr-4 py-2.5 bg-slate-100/70 dark:bg-slate-800/70 border-none rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:bg-white dark:focus:bg-slate-800 transition-all text-sm outline-none shadow-inner"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative text-slate-500 hover:text-slate-900 bg-slate-100/50 dark:bg-slate-800/50 dark:text-slate-400 dark:hover:text-white rounded-full h-10 w-10 transition-transform hover:scale-105 active:scale-95">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900"></span>
            </Button>
            
            <div className="h-8 w-[1px] bg-border/50 mx-2"></div>
            
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl px-4 transition-all hover:scale-105">
              <LogOut className="w-4 h-4 mr-2" />
              <span className="font-medium">Logout</span>
            </Button>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-8 container max-w-7xl mx-auto custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
