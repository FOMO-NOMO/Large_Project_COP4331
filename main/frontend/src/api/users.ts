// API: Users
// Purpose: User management API calls
import { buildPath } from '../Path.js';
import type { UpdateProfileRequest } from '../types';
import type { User } from '../types';

const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
});

export class UsersAPI {
  static async getProfile(userId?: string): Promise<User> {
    try {
      const endpoint = userId ? `api/users/${userId}` : 'api/users/me';
      const response = await fetch(buildPath(endpoint), {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch user profile: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }

  static async updateProfile(userData: UpdateProfileRequest): Promise<User> {
    try {
      const response = await fetch(buildPath('api/users/me'), {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(userData)
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update profile: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  static async searchUsers(query: string): Promise<User[]> {
    try {
      const response = await fetch(buildPath(`api/users/search?q=${encodeURIComponent(query)}`), {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`Failed to search users: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  }
}