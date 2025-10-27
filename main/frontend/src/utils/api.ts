// Utils: API Helpers
// Purpose: Utility functions for API calls with JWT handling

import { AuthAPI } from '../api/auth';

export const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
});

export const fetchWithAuth = async (url: string, options: RequestInit = {}): Promise<Response> => {
  // Check if token is expired and try to refresh
  if (AuthAPI.isTokenExpired()) {
    const newToken = await AuthAPI.refreshToken();
    if (!newToken) {
      // Refresh failed, redirect to login
      window.location.href = '/login';
      throw new Error('Authentication required');
    }
  }

  // Add auth headers to the request
  const authHeaders = getAuthHeaders();
  const response = await fetch(url, {
    ...options,
    headers: {
      ...authHeaders,
      ...options.headers,
    },
  });

  // If we get 401 (Unauthorized), try to refresh token once
  if (response.status === 401) {
    const newToken = await AuthAPI.refreshToken();
    if (newToken) {
      // Retry the request with new token
      const retryHeaders = getAuthHeaders();
      return fetch(url, {
        ...options,
        headers: {
          ...retryHeaders,
          ...options.headers,
        },
      });
    } else {
      // Refresh failed, redirect to login
      window.location.href = '/login';
      throw new Error('Authentication required');
    }
  }

  return response;
};