import axios, { AxiosError } from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { useAuthStore } from '@/store/useAuthStore';
import type { ApiResponse } from '@/types/api';

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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Interceptors ---

// Request: Attach Token
axiosInstance.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response: Unwrapping & Error Handling
axiosInstance.interceptors.response.use(
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
  (error: AxiosError<ApiResponse<any>>) => {
    // Handle HTTP Errors (4xx, 5xx)
    const status = error.response?.status || 500;
    const responseBody = error.response?.data;
    const message = responseBody?.message || error.message || 'Network Error';
    const code = responseBody?.error?.code;
    const details = responseBody?.error?.details;

    // Optional: Handle 401 Global Logout triggers here if not handled by Guard
    // if (status === 401) { ... }

    return Promise.reject(new ApiError(message, status, code, details));
  }
);

// --- Typed API Methods ---

export const client = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    axiosInstance.get<any, T>(url, config),

  post: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    axiosInstance.post<any, T>(url, data, config),

  put: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    axiosInstance.put<any, T>(url, data, config),

  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    axiosInstance.delete<any, T>(url, config),

  patch: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    axiosInstance.patch<any, T>(url, data, config),
};
