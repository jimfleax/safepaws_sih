import { useAuthStore } from '../store/authStore';

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');

  const response = await fetch(`/api${endpoint}`, {
    ...options,
    credentials: 'include',
    headers,
  });

  if (response.status === 401) {
    // Token is invalid or expired
    useAuthStore.getState().logout();
  }

  return response;
};
