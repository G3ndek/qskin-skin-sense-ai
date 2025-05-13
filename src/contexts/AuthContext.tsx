
import React, { createContext, useContext, useState, ReactNode } from 'react';

type UserRole = 'patient' | 'doctor' | null;

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string, role: UserRole) => {
    // Mock authentication
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock user data
    setUser({
      id: '1',
      name: role === 'patient' ? 'John Doe' : 'Dr. Smith',
      email,
      role
    });
  };

  const signup = async (name: string, email: string, password: string, role: UserRole) => {
    // Mock signup
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock user data
    setUser({
      id: '1',
      name,
      email,
      role
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      login, 
      signup, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
