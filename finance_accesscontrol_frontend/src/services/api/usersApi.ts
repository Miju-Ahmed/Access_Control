import { type User, Role } from '../../types/auth';

// Mock Data
let mockUsers: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@test.com', role: Role.ADMIN, isActive: true },
  { id: '2', name: 'Analyst User', email: 'analyst@test.com', role: Role.ANALYST, isActive: true },
  { id: '3', name: 'Viewer User', email: 'viewer@test.com', role: Role.VIEWER, isActive: false },
  { id: '4', name: 'John Doe', email: 'john@test.com', role: Role.VIEWER, isActive: true },
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getUsers = async (): Promise<User[]> => {
  await delay(800);
  return [...mockUsers];
};

export const createUser = async (data: Omit<User, 'id' | 'isActive'>): Promise<User> => {
  await delay(1000);
  const newUser: User = {
    ...data,
    id: Date.now().toString(),
    isActive: true, // Auto active on creation
  };
  mockUsers = [...mockUsers, newUser];
  return newUser;
};

export const updateUser = async (data: { id: string } & Partial<User>): Promise<User> => {
  await delay(1000);
  let updatedUser: User | undefined;
  mockUsers = mockUsers.map(u => {
    if (u.id === data.id) {
      updatedUser = { ...u, ...data };
      return updatedUser;
    }
    return u;
  });
  
  if (!updatedUser) throw new Error('User not found');
  return updatedUser;
};

export const toggleUserStatus = async (id: string): Promise<User> => {
  await delay(600);
  let updatedUser: User | undefined;
  mockUsers = mockUsers.map(u => {
    if (u.id === id) {
      updatedUser = { ...u, isActive: !u.isActive };
      return updatedUser;
    }
    return u;
  });
  
  if (!updatedUser) throw new Error('User not found');
  return updatedUser;
};
