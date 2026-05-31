export interface User {
  id: string;
  email: string;
  fullName: string;
  avatar?: string;
  createdAt: string;
  subscription?: 'free' | 'pro' | 'enterprise';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
  fullName: string;
  confirmPassword: string;
}