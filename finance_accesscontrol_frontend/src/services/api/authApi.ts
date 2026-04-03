// import { axiosClient } from './axiosClient';
import { type AuthResponse, Role } from '../../types/auth';

export const login = async (credentials: { email: string; password: string }): Promise<AuthResponse> => {
  // Uncomment below to use actual backend API
  // const { data } = await axiosClient.post<AuthResponse>('/auth/login', credentials);
  // return data;

  // Mock implementation for development and testing
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (credentials.email === 'admin@test.com' && credentials.password === 'password') {
        resolve({
          token: 'mock-jwt-token-admin',
          user: { id: '1', name: 'Admin User', email: 'admin@test.com', role: Role.ADMIN, isActive: true },
        });
      } else if (credentials.email === 'analyst@test.com' && credentials.password === 'password') {
        resolve({
          token: 'mock-jwt-token-analyst',
          user: { id: '2', name: 'Analyst User', email: 'analyst@test.com', role: Role.ANALYST, isActive: true },
        });
      } else if (credentials.email === 'viewer@test.com' && credentials.password === 'password') {
        resolve({
          token: 'mock-jwt-token-viewer',
          user: { id: '3', name: 'Viewer User', email: 'viewer@test.com', role: Role.VIEWER, isActive: true },
        });
      } else {
        reject(new Error('Invalid credentials. Use admin@test.com / password'));
      }
    }, 1000);
  });
};
