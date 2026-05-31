import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: (credential: string) => Promise<void>;
  register: (email: string, password: string, fullName: string, phone?: string) => Promise<void>;
  signOut: () => void;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const validateToken = async () => {
      if (token) {
        try {
          // Fetch profile from backend
          const res = await fetch('/api/auth/profile', {
            headers: { Authorization: `Bearer ${token}` },
          });
          
          if (!res.ok) {
            // Token is invalid or expired, clear it silently
            setUser(null);
            setToken(null);
            localStorage.removeItem('token');
            return;
          }
          
          const data = await res.json();
          if (data.success && data.data?.user) {
            const apiUser = data.data.user;
            setUser({
              id: apiUser.id || apiUser._id,
              email: apiUser.email,
              fullName: apiUser.fullName,
              phone: apiUser.phone || '',
              role: apiUser.role || 'customer'
            });
          }
        } catch (err) {
          // Network error or other issue, clear token
          console.log('Token validation failed, clearing session');
          setUser(null);
          setToken(null);
          localStorage.removeItem('token');
        }
      } else {
        setUser(null);
      }
    };
    
    validateToken();
  }, [token]);

  const signIn = async (email: string, password: string) => {
    setLoading(true); setError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Login failed');
      }
      const apiUser = data.data.user;
      const token = data.data.token;
      setToken(token);
      localStorage.setItem('token', token);
      setUser({
        id: apiUser.id || apiUser._id,
        email: apiUser.email,
        fullName: apiUser.fullName,
        phone: apiUser.phone || '',
        role: apiUser.role || 'customer'
      });
    } catch (err: any) {
      setError(err.message);
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, fullName: string, phone?: string) => {
    setLoading(true); setError(null);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, fullName, phone }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Registration failed');
      }
      const apiUser = data.data.user;
      const token = data.data.token;
      setToken(token);
      localStorage.setItem('token', token);
      setUser({
        id: apiUser.id || apiUser._id,
        email: apiUser.email,
        fullName: apiUser.fullName,
        phone: apiUser.phone || '',
        role: apiUser.role || 'customer'
      });
    } catch (err: any) {
      setError(err.message);
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async (credential: string) => {
    setLoading(true); setError(null);
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Google sign-in failed');
      }
      const apiUser = data.data.user;
      const token = data.data.token;
      setToken(token);
      localStorage.setItem('token', token);
      setUser({
        id: apiUser.id || apiUser._id,
        email: apiUser.email,
        fullName: apiUser.fullName,
        phone: apiUser.phone || '',
        role: apiUser.role || 'customer'
      });
    } catch (err: any) {
      setError(err.message);
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, signIn, signInWithGoogle, register, signOut, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
}; 