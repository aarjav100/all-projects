import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService, userService } from '../services';

interface User {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'guest' | 'host' | 'admin';
  isVerified: boolean;
  bio?: string;
  phone?: string;
  wishlists: any[];
  createdAt: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  clearError: () => void;
  updateUser: (data: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  login: async (email, password) => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await authService.login({ email, password });
      const { user, accessToken, refreshToken } = data.data;

      await AsyncStorage.setItem('accessToken', accessToken);
      await AsyncStorage.setItem('refreshToken', refreshToken);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error: any) {
      const message = error.response?.data?.error || 'Login failed';
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  register: async (name, email, password) => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await authService.register({ name, email, password });
      const { user, accessToken, refreshToken } = data.data;

      await AsyncStorage.setItem('accessToken', accessToken);
      await AsyncStorage.setItem('refreshToken', refreshToken);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error: any) {
      const message = error.response?.data?.error || 'Registration failed';
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  logout: async () => {
    await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);
    set({ user: null, isAuthenticated: false, isLoading: false });
  },

  loadUser: async () => {
    try {
      const userStr = await AsyncStorage.getItem('user');
      const token = await AsyncStorage.getItem('accessToken');

      if (userStr && token) {
        const user = JSON.parse(userStr);
        set({ user, isAuthenticated: true, isLoading: false });

        // Refresh user data in background
        try {
          const { data } = await userService.getMe();
          set({ user: data.data });
          await AsyncStorage.setItem('user', JSON.stringify(data.data));
        } catch {
          // Silent fail - use cached data
        }
      } else {
        set({ isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
  updateUser: (data) => set((state) => ({
    user: state.user ? { ...state.user, ...data } : null,
  })),
}));
