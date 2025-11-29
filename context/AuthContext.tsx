
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define user roles
export type UserRole = 'admin' | 'manager' | 'employee' | 'accountant' | 'technician';

// Define the shape of the user object
interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  // Add other user properties as needed
}

// Define the shape of the auth context
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

// Create the AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a mock user for demonstration purposes
const mockAdminUser: User = {
  id: 'user-001',
  name: 'Mohamed Said',
  email: 'trabelshooterss@gmail.com',
  role: 'admin',
};

/**
 * AuthProvider component that wraps the application to provide auth context.
 * For demonstration, it logs in a mock admin user by default.
 * @param children The child components to be rendered.
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(mockAdminUser); // Automatically log in the admin
  const isAuthenticated = !!user;

  const login = (loggedInUser: User) => {
    setUser(loggedInUser);
    // In a real app, you'd also store the token in localStorage/sessionStorage
  };

  const logout = () => {
    setUser(null);
    // In a real app, you'd also clear the token from storage
  };

  const value = {
    isAuthenticated,
    user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook to use the AuthContext.
 * @returns The auth context.
 * @throws An error if used outside of an AuthProvider.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
