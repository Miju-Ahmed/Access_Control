import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuthStore } from '../../store/useAuthStore';
import { LogOut } from 'lucide-react';
import { Button } from '../ui/button';

const MainLayout: React.FC = () => {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 shrink-0">
          <h2 className="font-semibold text-lg">Dashboard Overview</h2>
          <div className="flex items-center gap-4">
            {/* Theme Toggle could go here */}
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-destructive">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6 bg-muted/30">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
