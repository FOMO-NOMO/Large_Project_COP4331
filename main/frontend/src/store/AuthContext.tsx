// Store: Auth Context
// Purpose: Authentication state management
import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthAPI } from "../api/auth";
import type { User } from "../types";

interface LoginCredentials {
  login: string;
  password: string;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  login: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing authentication on mount
  useEffect(() => {
    const currentUser = AuthAPI.getCurrentUser();
    if (currentUser) {
      // Convert old format to new User type
      setUser({
        id: currentUser.id,
        email: '', // TODO: Get from API
        displayName: `${currentUser.firstName} ${currentUser.lastName}`,
        bio: '',
        major: '',
        classYear: undefined,
        interests: [],
        createdAt: new Date().toISOString()
      });
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const response = await AuthAPI.login(credentials);
      
      if (response.error) {
        throw new Error(response.error);
      }

      if (response.id && response.firstName && response.lastName) {
        // Store auth data in localStorage
        localStorage.setItem('userId', response.id.toString());
        localStorage.setItem('userName', `${response.firstName} ${response.lastName}`);
        if (response.accessToken) {
          localStorage.setItem('authToken', response.accessToken);
        }

        // Create User object
        const newUser: User = {
          id: response.id.toString(),
          email: '', // TODO: Get from response
          displayName: `${response.firstName} ${response.lastName}`,
          bio: '',
          major: '',
          classYear: undefined,
          interests: [],
          createdAt: new Date().toISOString()
        };

        setUser(newUser);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    setIsLoading(true);
    try {
      const response = await AuthAPI.register(userData);
      
      if (response.error) {
        throw new Error(response.error);
      }

      // Registration successful - user will need to login
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    AuthAPI.logout();
    setUser(null);
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
    }
  };

  const contextValue: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}