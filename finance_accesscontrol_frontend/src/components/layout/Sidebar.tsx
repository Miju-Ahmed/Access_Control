import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, Users } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { Role } from '../../types/auth';

const Sidebar: React.FC = () => {
  const user = useAuthStore((state) => state.user);

  const links = [
    { to: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard', roles: [Role.VIEWER, Role.ANALYST, Role.ADMIN] },
    { to: '/records', icon: <Receipt size={20} />, label: 'Records', roles: [Role.VIEWER, Role.ANALYST, Role.ADMIN] },
    { to: '/users', icon: <Users size={20} />, label: 'Users', roles: [Role.ADMIN] },
  ];

  return (
    <aside className="w-64 bg-card border-r border-border h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">FinDash</h1>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {links
          .filter((link) => user && link.roles.includes(user.role))
          .map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`
              }
            >
              {link.icon}
              {link.label}
            </NavLink>
          ))}
      </nav>
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
            {user?.name.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{user?.name}</span>
            <span className="text-xs text-muted-foreground">{user?.role}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
