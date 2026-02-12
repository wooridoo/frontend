import axios, { AxiosError } from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
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

// --- Token Refresh State ---
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null) {
  failedQueue.forEach((prom) => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });
  failedQueue = [];
}

function clearAuthAndRedirect() {
  try {
    localStorage.removeItem('auth-storage');
  } catch { /* ignore */ }
  if (!window.location.pathname.includes('/login')) {
    window.location.href = '/login';
  }
}

// --- Interceptors ---

// Request: Attach Token from LocalStorage (Avoiding Circular Dependency)
axiosInstance.interceptors.request.use(
  (config) => {
    try {
      const storageStr = localStorage.getItem('auth-storage');
      if (storageStr) {
        const storage = JSON.parse(storageStr);
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
    const responseBody = response.data;

    if (responseBody && typeof responseBody === 'object' && 'success' in responseBody) {
      if (!responseBody.success) {
        throw new ApiError(
          responseBody.message || 'Unknown API Error',
          response.status,
          responseBody.error?.code,
          responseBody.error?.details
        );
      }
      return responseBody.data;
    }

    return responseBody;
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async (error: AxiosError<ApiResponse<any>>) => {
    const status = error.response?.status || 500;
    const responseBody = error.response?.data;
    const message = responseBody?.message || error.message || 'Network Error';
    const code = responseBody?.error?.code;
    const details = responseBody?.error?.details;
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // 401 Unauthorized → 토큰 갱신 시도 후 실패 시 로그아웃
    if (status === 401 && originalRequest && !originalRequest._retry) {
      // refresh 요청 자체가 401이면 순환 방지
      if (originalRequest.url?.includes('/auth/refresh') || originalRequest.url?.includes('/auth/login')) {
        clearAuthAndRedirect();
        return Promise.reject(new ApiError(message, status, code, details));
      }

      if (isRefreshing) {
        // 이미 갱신 중이면 큐에 추가하여 갱신 완료 후 재시도
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return axiosInstance(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const storageStr = localStorage.getItem('auth-storage');
        const storage = storageStr ? JSON.parse(storageStr) : null;
        const refreshTokenValue = storage?.state?.refreshToken;

        if (!refreshTokenValue) {
          throw new Error('No refresh token available');
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response = await axios.post<any>(
          `${API_BASE_URL}/auth/refresh`,
          { refreshToken: refreshTokenValue }
        );

        const respData = response.data?.data ?? response.data;
        const newAccessToken = respData?.accessToken;

        if (!newAccessToken) {
          throw new Error('No access token in refresh response');
        }

        // localStorage의 auth-storage 갱신
        if (storage) {
          storage.state.accessToken = newAccessToken;
          localStorage.setItem('auth-storage', JSON.stringify(storage));
        }

        processQueue(null, newAccessToken);

        // 원래 요청 재시도
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearAuthAndRedirect();
        return Promise.reject(new ApiError('세션이 만료되었습니다. 다시 로그인해주세요.', 401));
      } finally {
        isRefreshing = false;
      }
    }

    // 401 but already retried → force logout
    if (status === 401) {
      clearAuthAndRedirect();
    }

    // Detailed Error Logging
    console.error('❌ API Error Details:', {
      url: error.config?.url,
      method: error.config?.method,
      status,
      message,
      responseBody: responseBody,
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
