// API: Groups
// Purpose: Group management API calls
import { buildPath } from '../Path.js';
import type { Group } from '../types';

const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
});

export class GroupsAPI {
  static async getGroups(): Promise<Group[]> {
    try {
      const response = await fetch(buildPath('api/groups'), {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch groups: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching groups:', error);
      throw error;
    }
  }

  static async getSingleGroup(groupId: string): Promise<Group> {
    try {
      const response = await fetch(buildPath(`api/groups/${groupId}`), {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch group: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching single group:', error);
      throw error;
    }
  }

  static async getRecommendedGroups(): Promise<Group[]> {
    try {
      const response = await fetch(buildPath('api/groups/recommended'), {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch recommended groups: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching recommended groups:', error);
      throw error;
    }
  }

  static async searchGroups(query: string): Promise<Group[]> {
    try {
      const response = await fetch(buildPath(`api/groups/search?q=${encodeURIComponent(query)}`), {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`Failed to search groups: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error searching groups:', error);
      throw error;
    }
  }
}
