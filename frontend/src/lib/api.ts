/**
 * Native Fetch API client for Kitsuno TanStack Frontend
 * Pure browser fetch with credentials: 'include' for session cookie auth.
 */

export const API_BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) ||
  'http://localhost:3001';

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  ok: boolean;
  headers: Headers;
}

export class ApiError extends Error {
  response?: {
    data: any;
    status: number;
  };
  status?: number;

  constructor(message: string, status?: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    if (status !== undefined || data !== undefined) {
      this.response = {
        status: status || 500,
        data,
      };
    }
  }
}

async function request<T = any>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const url = endpoint.startsWith('http://') || endpoint.startsWith('https://')
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const fetchOptions: RequestInit = {
    ...options,
    headers,
    credentials: 'include',
  };

  try {
    const res = await fetch(url, fetchOptions);

    let data: any = null;
    const contentType = res.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      try {
        data = await res.json();
      } catch {
        data = null;
      }
    } else {
      try {
        data = await res.text();
      } catch {
        data = null;
      }
    }

    if (!res.ok) {
      const errorMsg =
        data?.message ||
        data?.error ||
        (Array.isArray(data?.message) ? data.message.join(', ') : null) ||
        `Request failed with status ${res.status}`;

      throw new ApiError(errorMsg, res.status, data);
    }

    return {
      data,
      status: res.status,
      ok: res.ok,
      headers: res.headers,
    };
  } catch (err: any) {
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError(err?.message || 'Network connection failed', 0, {
      message: err?.message || 'Network connection failed',
    });
  }
}

export const api = {
  get: <T = any>(endpoint: string, options?: RequestInit) =>
    request<T>(endpoint, { ...options, method: 'GET' }),

  post: <T = any>(endpoint: string, body?: any, options?: RequestInit) =>
    request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
    }),

  put: <T = any>(endpoint: string, body?: any, options?: RequestInit) =>
    request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
    }),

  delete: <T = any>(endpoint: string, options?: RequestInit) =>
    request<T>(endpoint, { ...options, method: 'DELETE' }),
};

export default api;
