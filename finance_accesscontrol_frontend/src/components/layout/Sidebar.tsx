import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, Users, PickaxeIcon } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { Role } from '../../types/auth';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';

const Sidebar: React.FC = () => {
  const user = useAuthStore((state) => state.user);

  const links = [
    { to: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard', roles: [Role.VIEWER, Role.ANALYST, Role.ADMIN] },
    { to: '/records', icon: <Receipt size={20} />, label: 'Records', roles: [Role.VIEWER, Role.ANALYST, Role.ADMIN] },
    { to: '/users', icon: <Users size={20} />, label: 'Users', roles: [Role.ADMIN] },
  ];

  const logout = useAuthStore((state) => state.logout);

  return (
    <aside className="w-64 bg-slate-50 dark:bg-slate-900 border-r border-border h-full flex flex-col z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      <div className="p-6 border-b border-border/50 flex items-center gap-3">
        <div className="p-2 bg-gradient-primary rounded-xl text-white shadow-lg shadow-blue-500/20">
          <PickaxeIcon size={24} />
        </div>
        <h1 className="text-2xl font-bold text-gradient tracking-tight">FinDash</h1>
      </div>
      
      <nav className="flex-1 p-4 space-y-2 mt-4">
        {links
          .filter((link) => user && link.roles.includes(user.role))
          .map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group overflow-hidden ${
                  isActive
                    ? 'text-white shadow-md'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active-pill"
                      className="absolute inset-0 bg-gradient-primary"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  {isActive ? null : (
                    <div className="absolute inset-0 bg-slate-100 dark:bg-slate-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  )}
                  <span className="relative z-10">{React.cloneElement(link.icon as React.ReactElement<any>, { className: isActive ? "text-white" : "group-hover:scale-110 transition-transform duration-300" })}</span>
                  <span className={`relative z-10 font-medium ${isActive ? "" : "group-hover:translate-x-1 transition-transform duration-300"}`}>
                    {link.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
      </nav>
      
      <div className="p-4 space-y-4">
        <div className="flex items-center gap-4 bg-white dark:bg-slate-800/50 p-3 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 flex items-center justify-center text-blue-700 dark:text-blue-300 font-bold text-lg border border-white dark:border-slate-700 shadow-sm shrink-0">
            {user?.name.charAt(0)}
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-sm font-semibold truncate text-slate-800 dark:text-slate-200">{user?.name}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium capitalize truncate">
              {user?.role.toLowerCase()}
            </span>
          </div>
        </div>
        
        <Button 
          variant="ghost" 
          onClick={logout}
          className="w-full justify-start gap-3 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-colors h-12"
        >
          <PickaxeIcon size={18} className="rotate-180" /> 
          <span className="font-medium">Logout</span>
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
