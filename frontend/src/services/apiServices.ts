import { getAccessToken } from '@/tokenManager';
import { API_FULL_URL } from '@/types/ApiTypes';

export type FetchAPIMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
export type FetchAPIResponseType = 'json' | 'blob' | 'text';

interface FetchAPIOptions<B = undefined> {
  method?: FetchAPIMethod;
  headers?: HeadersInit;
  body?: B;
  queryParams?: Record<string, string | number>;
  signal?: AbortSignal;
  responseType?: FetchAPIResponseType;
}

export async function fetchAPI<T, B = undefined>(endpoint: string, options: FetchAPIOptions<B> = {}): Promise<T> {
  const { method = 'GET', headers = {}, body, queryParams = {}, signal, responseType = 'json' } = options;

  const accessToken = getAccessToken();

  try {
    const queryString = new URLSearchParams(
      Object.entries(queryParams).reduce<Record<string, string>>((acc, [key, value]) => ({ ...acc, [key]: String(value) }), {}),
    ).toString();

    const fullUrl = queryString ? `${API_FULL_URL}${endpoint}?${queryString}` : `${API_FULL_URL}${endpoint}`;

    const fetchHeaders = new Headers();

    fetchHeaders.set('Authorization', `Bearer ${accessToken}`);

    // Merge custom headers
    if (headers instanceof Headers) {
      headers.forEach((value, key) => {
        fetchHeaders.set(key, value);
      });
    } else if (Array.isArray(headers)) {
      headers.forEach(([key, value]) => {
        fetchHeaders.set(key, value);
      });
    } else {
      Object.entries(headers).forEach(([key, value]) => {
        fetchHeaders.set(key, value);
      });
    }

    const fetchOptions: RequestInit = {
      method,
      headers: fetchHeaders,
      signal,
      credentials: 'include',
    };

    if (body !== null && body !== undefined) {
      if (body instanceof FormData) {
        fetchOptions.body = body;
      } else if (typeof body === 'string') {
        fetchOptions.body = body;
      } else if (typeof body === 'object') {
        fetchHeaders.set('Content-Type', 'application/json');
        fetchOptions.body = JSON.stringify(body);
      } else {
        throw new Error('Unsupported body type');
      }
    }

    const response = await fetch(fullUrl, fetchOptions);

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `HTTP error! status: ${response.status}`;

      try {
        const errorData = JSON.parse(errorText);
        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        } else {
          errorMessage = errorData;
        }
      } catch (jsonError) {
        console.warn('Failed to parse error response as JSON:', jsonError);
      }

      throw new Error(errorMessage);
    }

    // Handle different response types
    switch (responseType) {
      case 'blob':
        return (await response.blob()) as unknown as T;
      case 'text':
        return (await response.text()) as unknown as T;
      case 'json':
      default:
        return (await response.json()) as T;
    }
  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      console.error('Fetch request was aborted');
    } else {
      console.error('Fetch API error:', error);
    }
    throw error;
  }
}

export default fetchAPI;
