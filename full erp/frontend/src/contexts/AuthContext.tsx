import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'teacher' | 'admin';
  studentId?: string;
  phone?: string;
  program?: string;
  yearLevel?: number;
  status?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, firstName: string, lastName: string, studentId?: string, phone?: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  adminSignIn: (email: string, password: string) => Promise<{ error: string | null }>;
  adminOTP: (email: string, otp: string) => Promise<{ error: string | null; data?: User }>;
  sendOTP: (email: string) => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const API_BASE_URL = 'http://localhost:5000/api';

  useEffect(() => {
    // Check for existing token on app load
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async (token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.data.user);
      } else {
        // Token is invalid, remove it
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string, studentId?: string, phone?: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          firstName,
          lastName,
          studentId,
          phone,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.data.token);
        setUser(data.data.user);
        toast({
          title: "Success",
          description: "Account created successfully!",
        });
        navigate('/');
        return { error: null };
      } else {
        return { error: data.error || 'Registration failed' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { error: 'Network error during registration' };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.data.token);
        setUser(data.data.user);
        toast({
          title: "Success",
          description: "Welcome back!",
        });
        navigate('/');
        return { error: null };
      } else {
        return { error: data.error || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { error: 'Network error during login' };
    }
  };

  const signOut = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      setUser(null);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      navigate('/auth');
    }
  };

  const adminSignIn = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.data.user.role === 'admin') {
        localStorage.setItem('token', data.data.token);
        setUser(data.data.user);
        toast({
          title: "Success",
          description: "Admin login successful!",
        });
        navigate('/');
        return { error: null };
      } else {
        return { error: 'Invalid admin credentials' };
      }
    } catch (error) {
      console.error('Admin login error:', error);
      return { error: 'Network error during admin login' };
    }
  };

  const sendOTP = async (email: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        return { error: null };
      } else {
        return { error: data.error || 'Failed to send OTP' };
      }
    } catch (error) {
      console.error('Send OTP error:', error);
      return { error: 'Network error sending OTP' };
    }
  };

  const adminOTP = async (email: string, otp: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.data.token);
        setUser(data.data.user);
        toast({
          title: "Success",
          description: "Admin login successful!",
        });
        navigate('/');
        return { error: null, data: data.data };
      } else {
        return { error: data.error || 'OTP verification failed' };
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      return { error: 'Network error during OTP verification' };
    }
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    adminSignIn,
    adminOTP,
    sendOTP,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};