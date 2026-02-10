import axios, { AxiosError } from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import type { ApiResponse } from '@/types/api';
import { toast } from 'sonner';

// --- Error Handling ---

export class ApiError extends Error {
  status: number;
  code?: string;
  details?: unknown;

  constructor(message: string, status: number, code?: string, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

// --- Client Configuration ---

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Interceptors ---

// Request: Attach Token from LocalStorage (Avoiding Circular Dependency)
axiosInstance.interceptors.request.use(
  (config) => {
    try {
      // zustand persist stores data in localStorage under the key 'auth-storage'
      const storageStr = localStorage.getItem('auth-storage');
      if (storageStr) {
        const storage = JSON.parse(storageStr);
        // Zustand persist structure: { state: { ... }, version: ... }
        const accessToken = storage.state?.accessToken;
        if (accessToken && config.headers) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
      }
    } catch (e) {
      console.warn('Failed to parse auth token from storage', e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response: Unwrapping & Error Handling
axiosInstance.interceptors.response.use(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (response: AxiosResponse<ApiResponse<any>>) => {
    // 1. HTTP 200 OK
    const responseBody = response.data;

    // 2. Check Logical Success (Standard Wrapper)
    // Some APIs might return pure generic JSON, but our Spec says "success": true/false
    if (responseBody && typeof responseBody === 'object' && 'success' in responseBody) {
      if (!responseBody.success) {
        // Logically failed even if HTTP 200 (rare but possible in some designs)
        throw new ApiError(
          responseBody.message || 'Unknown API Error',
          response.status,
          responseBody.error?.code,
          responseBody.error?.details
        );
      }
      // Return unwrapped data
      return responseBody.data;
    }

    // If no wrapper, return full data (fallback)
    return responseBody;
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (error: AxiosError<ApiResponse<any>>) => {
    // Handle HTTP Errors (4xx, 5xx)
    const status = error.response?.status || 500;
    const responseBody = error.response?.data;
    const message = responseBody?.message || error.message || 'Network Error';
    const code = responseBody?.error?.code;
    const details = responseBody?.error?.details;

    // Optional: Handle 401 Global Logout triggers here if not handled by Guard
    // if (status === 401) { ... }

    // Detailed Error Logging
    console.error('❌ API Error Details:', {
      url: error.config?.url,
      method: error.config?.method,
      status,
      message,
      responseBody: responseBody,
      headers: error.config?.headers
    });

    // Global Error Notification (except 401/403)
    if (status !== 401 && status !== 403) {
      toast.error(message);
    }

    return Promise.reject(new ApiError(message, status, code, details));
  }
);

// --- Typed API Methods ---

export const client = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    axiosInstance.get<unknown, T>(url, config),

  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    axiosInstance.post<unknown, T>(url, data, config),

  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    axiosInstance.put<unknown, T>(url, data, config),

  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    axiosInstance.delete<unknown, T>(url, config),

  patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    axiosInstance.patch<unknown, T>(url, data, config),
};
