import axios, { AxiosError } from 'axios';
import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import type { ApiResponse } from '@/types/api';
import { toast } from 'sonner';
import { normalizeApiError } from './errorNormalizer';

export class ApiError extends Error {
  status: number;
  code?: string;
  details?: unknown;
  rawMessage?: string;

  constructor(message: string, status: number, code?: string, details?: unknown, rawMessage?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
    this.rawMessage = rawMessage;
  }
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

function getAuthStorage(): Record<string, unknown> | null {
  try {
    const storageStr = localStorage.getItem('auth-storage');
    return storageStr ? JSON.parse(storageStr) : null;
  } catch {
    return null;
  }
}

function updateStoredTokens(accessToken: string, refreshToken?: string) {
  const storage = getAuthStorage();
  if (!storage || typeof storage !== 'object') return;

  const state = (storage as { state?: Record<string, unknown> }).state;
  if (!state) return;

  state.accessToken = accessToken;
  if (refreshToken) {
    state.refreshToken = refreshToken;
  }
  localStorage.setItem('auth-storage', JSON.stringify(storage));
}

function clearAuthAndRedirect() {
  try {
    localStorage.removeItem('auth-storage');
  } catch {
    // ignore
  }

  if (!window.location.pathname.includes('/login')) {
    window.location.href = '/login';
  }
}

axiosInstance.interceptors.request.use(
  (config) => {
    const storage = getAuthStorage() as { state?: { accessToken?: string } } | null;
    const accessToken = storage?.state?.accessToken;
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<unknown>>) => {
    const body = response.data;
    if (body && typeof body === 'object' && 'success' in body) {
      if (!body.success) {
        const normalized = normalizeApiError(body.message);
        throw new ApiError(normalized.userMessage, response.status, normalized.code, undefined, normalized.rawMessage);
      }
      return body.data as any;
    }
    return body as any;
  },
  async (error: AxiosError<ApiResponse<unknown>>) => {
    const status = error.response?.status || 500;
    const responseBody = error.response?.data;
    const rawMessage = responseBody?.message || error.message || 'Network Error';
    const normalized = normalizeApiError(rawMessage);
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (status === 401 && originalRequest && !originalRequest._retry) {
      if (originalRequest.url?.includes('/auth/refresh') || originalRequest.url?.includes('/auth/login')) {
        clearAuthAndRedirect();
        return Promise.reject(
          new ApiError(normalized.userMessage, status, normalized.code, undefined, normalized.rawMessage),
        );
      }

      if (isRefreshing) {
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
        const storage = getAuthStorage() as { state?: { refreshToken?: string } } | null;
        const refreshToken = storage?.state?.refreshToken;
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const refreshResponse = await axios.post<ApiResponse<{ accessToken: string; refreshToken?: string }>>(
          `${API_BASE_URL}/auth/refresh`,
          { refreshToken },
        );
        const refreshBody = refreshResponse.data;
        const refreshed = refreshBody?.data || (refreshResponse.data as unknown as { accessToken?: string; refreshToken?: string });
        const newAccessToken = refreshed?.accessToken;
        const newRefreshToken = refreshed?.refreshToken;

        if (!newAccessToken) {
          throw new Error('No access token in refresh response');
        }

        updateStoredTokens(newAccessToken, newRefreshToken);
        processQueue(null, newAccessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearAuthAndRedirect();
        return Promise.reject(
          new ApiError('세션이 만료되었습니다. 다시 로그인해 주세요.', 401, normalized.code, undefined, normalized.rawMessage),
        );
      } finally {
        isRefreshing = false;
      }
    }

    if (status === 401) {
      clearAuthAndRedirect();
    }

    console.error('API Error', {
      url: error.config?.url,
      method: error.config?.method,
      status,
      rawMessage: normalized.rawMessage,
      code: normalized.code,
    });

    if (status !== 401 && status !== 403) {
      toast.error(normalized.userMessage);
    }

    return Promise.reject(
      new ApiError(normalized.userMessage, status, normalized.code, undefined, normalized.rawMessage),
    );
  },
);

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
