// Store: Auth Context
// Purpose: Authentication state management
import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthAPI } from "../api/auth";
import type { User } from "../types";

interface LoginCredentials {
  email: string;
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
  isNewUser: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<any>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  markSurveyComplete: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);

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
      console.log('Login response:', response); // Debug log
      
      if (response.error) {
        throw new Error(response.error);
      }

      if (response.accessToken) {
        // Store the JWT token
        localStorage.setItem('authToken', response.accessToken);
        
        // Decode the token to get user info (you might want to create a proper JWT decode function)
        // For now, we'll make another API call or decode the JWT
        // Let's try to extract user info from the token payload
        try {
          const tokenPayload = JSON.parse(atob(response.accessToken.split('.')[1]));
          console.log('Token payload:', tokenPayload);
          
          const newUser: User = {
            id: tokenPayload.userId.toString(),
            email: credentials.email,
            displayName: `${tokenPayload.firstName} ${tokenPayload.lastName}`,
            bio: '',
            major: '',
            classYear: undefined,
            interests: [],
            createdAt: new Date().toISOString()
          };

          setUser(newUser);
          
          // Store additional user data
          localStorage.setItem('userId', tokenPayload.userId.toString());
          localStorage.setItem('userName', `${tokenPayload.firstName} ${tokenPayload.lastName}`);
        } catch (decodeError) {
          console.error('Failed to decode token:', decodeError);
          throw new Error('Invalid token received from server');
        }
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

      // Development mode: Skip email verification for easier testing
      const isDevelopment = import.meta.env.MODE === 'development';
      
      if (isDevelopment) {
        // In development, automatically log the user in
        console.log('🚧 DEV MODE: Skipping email verification');
        setIsNewUser(true); // Mark as new user for survey redirect
        await login({
          email: userData.email,
          password: userData.password
        });
      } else {
        // Production: Email verification required
        return response;
      }
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

  const markSurveyComplete = () => {
    setIsNewUser(false);
  };

  const contextValue: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    isNewUser,
    login,
    register,
    logout,
    updateUser,
    markSurveyComplete,
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