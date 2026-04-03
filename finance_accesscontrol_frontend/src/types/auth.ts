export enum Role {
  VIEWER = 'VIEWER',
  ANALYST = 'ANALYST',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  isActive: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
}
