// API: Authentication
// Purpose: Authentication related API calls that connect to backend endpoints

import { buildPath } from '../Path.js';

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

interface LoginResponse {
  accessToken?: string;
  error?: string;
}

interface RegisterResponse {
  error?: string;
}

export class AuthAPI {
  static async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      console.log('Sending login credentials:', credentials); // Debug log

      const response = await fetch(buildPath('api/auth/login'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Login API response:', data); // Debug log
      return data;
    } catch (error) {
      console.error('Login API error:', error);
      throw new Error('Login failed. Please try again.');
    }
  }

  static async register(userData: RegisterData): Promise<RegisterResponse> {
    try {
      console.log('Sending registration data:', userData); // Debug log

      const response = await fetch(buildPath('api/auth/register'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();
      console.log('Registration response:', data); // Debug log

      if (!response.ok) {
        // Return the specific error message from the backend
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('Register API error:', error);
      throw error; // Re-throw the original error instead of generic message
    }
  }

  static async logout() {
    try {
      // invalidate JWT
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          await fetch(buildPath('api/logout'), {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
        } catch (error) {
          console.warn('Backend logout failed:', error);
        }
      }

      // clear local storage
      localStorage.removeItem('authToken');
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
      localStorage.removeItem('user_data');
      localStorage.removeItem('refreshToken');
      sessionStorage.clear();

      // redirect to login page
      window.location.href = '/login';

    } catch (error) {
      console.error('Logout error:', error);
      // force cleanup even if there's an error
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '/login';
    }
  }

  static getCurrentUser() {
    // Get user data from localStorage (set during login)
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
    const token = localStorage.getItem('authToken');

    if (userId && userName && token) {
      const [firstName, lastName] = userName.split(' ');
      return {
        id: userId,
        firstName: firstName || '',
        lastName: lastName || '',
        token: token
      };
    }

    return null;
  }

  static async refreshToken(): Promise<string | null> {
    try {
      const currentToken = localStorage.getItem('authToken');
      if (!currentToken) {
        return null;
      }

      // Call refresh endpoint
      const response = await fetch(buildPath('api/refresh'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: currentToken })
      });

      if (!response.ok) {
        throw new Error(`Token refresh failed: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.accessToken) {
        localStorage.setItem('authToken', data.accessToken);
        return data.accessToken;
      }

      return null;
    } catch (error) {
      console.error('Token refresh failed:', error);
      // Clear invalid token
      this.logout();
      return null;
    }
  }

  static async forgotPassword(email: string): Promise<{ message?: string; error?: string }> {
    try {
      const response = await fetch(buildPath('api/auth/forgot-password'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data; // { message: "...", error?: "..." }
    } catch (error) {
      console.error('Forgot password API error:', error);
      throw new Error('Failed to send password reset email. Please try again.');
    }
  }

  static async resetPassword(token: string, newPassword: string): Promise<{ message?: string; error?: string }> {
    try {
      const response = await fetch(buildPath('api/auth/reset-password'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resetToken: token, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data; // { message: "...", error?: "..." }
    } catch (error) {
      console.error('Reset password API error:', error);
      throw new Error('Password reset failed. Please try again.');
    }
  }


  static isTokenExpired(): boolean {
    const token = localStorage.getItem('authToken');
    if (!token) return true;

    try {
      // Decode JWT payload
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);

      // Check if token has exp field and if it's expired
      return payload.exp && payload.exp < currentTime;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  }
}
