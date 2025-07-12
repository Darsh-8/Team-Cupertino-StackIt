
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  initials: string;
  isAdmin?: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string, name?: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password: string, name?: string): boolean => {
    // Check for admin credentials
    if (email === 'admin@xyz.in' && password === 'admin') {
      const adminUser: User = {
        id: 'admin-001',
        name: 'Admin User',
        email: 'admin@xyz.in',
        initials: 'AD',
        isAdmin: true
      };
      setUser(adminUser);
      console.log('Admin logged in:', adminUser);
      return true;
    }
    
    // Regular user login
    const initials = name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : email.substring(0, 2).toUpperCase();
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: name || email.split('@')[0],
      email,
      initials,
      isAdmin: false
    };
    setUser(newUser);
    console.log('User logged in:', newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
    console.log('User logged out');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoggedIn: !!user,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};
