import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; requiresOTP?: boolean; message?: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; requiresOTP?: boolean; message?: string }>;
  verifyOTP: (otp: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  pendingUser: { email: string; name: string } | null;
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
  const [isLoading, setIsLoading] = useState(true);
  const [pendingUser, setPendingUser] = useState<{ email: string; name: string } | null>(null);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('auth_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo purposes, any email/password combo works
    if (email && password.length >= 6) {
      const userData = { email, name: email.split('@')[0] };
      setPendingUser(userData);
      setIsLoading(false);
      console.log('Login successful, requiresOTP: true');
      return { success: true, requiresOTP: true };
    }
    
    setIsLoading(false);
    return { success: false, message: 'Invalid credentials. Password must be at least 6 characters.' };
  };

  const signup = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email && password.length >= 6 && name) {
      const userData = { email, name };
      setPendingUser(userData);
      setIsLoading(false);
      return { success: true, requiresOTP: true };
    }
    
    setIsLoading(false);
    return { success: false, message: 'Please fill all fields. Password must be at least 6 characters.' };
  };

  const verifyOTP = async (otp: string) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo, accept any 6-digit OTP
    if (otp === '123456' || otp.length === 6) {
      if (pendingUser) {
        const newUser: User = {
          id: Date.now().toString(),
          email: pendingUser.email,
          name: pendingUser.name
        };
        
        setUser(newUser);
        localStorage.setItem('auth_user', JSON.stringify(newUser));
        setPendingUser(null);
        setIsLoading(false);
        return { success: true };
      }
    }
    
    setIsLoading(false);
    return { success: false, message: 'Invalid OTP. Try 123456 for demo.' };
  };

  const logout = () => {
    setUser(null);
    setPendingUser(null);
    localStorage.removeItem('auth_user');
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    verifyOTP,
    logout,
    pendingUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};