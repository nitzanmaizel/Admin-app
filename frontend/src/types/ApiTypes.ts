export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const API_VERSION = '/api/v1';

export const API_FULL_URL = `${API_BASE_URL}${API_VERSION}`;

export const API_LOGIN = `${API_FULL_URL}/auth/login`;

export const API_USER = '/auth/user';

export interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
}
