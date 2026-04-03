import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import MainLayout from '../components/layout/MainLayout';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import RecordsList from '../pages/RecordsList';
import UsersList from '../pages/UsersList';
import { Role } from '../types/auth';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <MainLayout />,
        children: [
          { index: true, element: <Navigate to="/dashboard" replace /> },
          {
            path: 'dashboard',
            element: <ProtectedRoute allowedRoles={[Role.VIEWER, Role.ANALYST, Role.ADMIN]} />,
            children: [{ index: true, element: <Dashboard /> }],
          },
          {
            path: 'records',
            element: <ProtectedRoute allowedRoles={[Role.VIEWER, Role.ANALYST, Role.ADMIN]} />,
            children: [{ index: true, element: <RecordsList /> }],
          },
          {
            path: 'users',
            element: <ProtectedRoute allowedRoles={[Role.ADMIN]} />,
            children: [{ index: true, element: <UsersList /> }],
          },
          {
            path: 'unauthorized',
            element: <div className="p-8 text-center text-red-500">You do not have access to this page.</div>,
          },
          {
            path: '*',
            element: <Navigate to="/dashboard" replace />,
          },
        ],
      },
    ],
  },
]);
