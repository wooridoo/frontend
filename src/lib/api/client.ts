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
import { PATHS } from '@/routes/paths';

interface ApiRequestConfig extends AxiosRequestConfig {
  silentError?: boolean;
}

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
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
/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
export const AUTH_SESSION_EXPIRED_EVENT = 'auth:session-expired';

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
const errorLogHistory = new Map<string, number>();
const ERROR_LOG_THROTTLE_MS = 5000;

function shouldLogError(logKey: string): boolean {
  const now = Date.now();
  const previous = errorLogHistory.get(logKey);
  if (previous && now - previous < ERROR_LOG_THROTTLE_MS) {
    return false;
  }
  errorLogHistory.set(logKey, now);
  return true;
}

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

function clearAuthStorage() {
  try {
    localStorage.removeItem('auth-storage');
  } catch {
    // 보조 처리
  }
}

function emitSessionExpired() {
  if (typeof window === 'undefined') return;

  const currentPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  window.dispatchEvent(
    new CustomEvent(AUTH_SESSION_EXPIRED_EVENT, {
      detail: { returnTo: currentPath || PATHS.HOME },
    }),
  );
}

function isLoginRequest(url?: string): boolean {
  return Boolean(url?.includes('/auth/login'));
}

function isRefreshRequest(url?: string): boolean {
  return Boolean(url?.includes('/auth/refresh'));
}

function isTokenFailureCode(code?: string): boolean {
  return code === 'AUTH_004' || code === 'AUTH_001' || code === 'AUTH_002';
}

function shouldNotifySessionExpired(status: number, code?: string): boolean {
  return status === 401 && (!code || isTokenFailureCode(code));
}

function handleSessionExpired() {
  clearAuthStorage();
  emitSessionExpired();
}

function createApiError(normalized: ReturnType<typeof normalizeApiError>, status: number): ApiError {
  return new ApiError(normalized.userMessage, status, normalized.code, undefined, normalized.rawMessage);
}

function createSessionExpiredError(normalized: ReturnType<typeof normalizeApiError>): ApiError {
  return new ApiError('세션이 만료되었습니다. 다시 로그인해 주세요.', 401, normalized.code, undefined, normalized.rawMessage);
}

function isCredentialFailure(code?: string): boolean {
  return code === 'AUTH_001' || code === 'AUTH_002';
}

function shouldBypassSessionHandling(status: number, url?: string, code?: string): boolean {
  if (status !== 401) return false;
  if (!isLoginRequest(url)) return false;
  return !code || isCredentialFailure(code);
}

function maybeHandleGlobal401(status: number, url?: string, code?: string) {
  if (status !== 401) return;
  if (isLoginRequest(url) || isRefreshRequest(url)) return;
  if (shouldNotifySessionExpired(status, code)) {
    handleSessionExpired();
  }
}

axiosInstance.interceptors.request.use(
  (config) => {
    const storage = getAuthStorage() as { state?: { accessToken?: string } } | null;
    const accessToken = storage?.state?.accessToken;
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    if (config.data instanceof FormData && config.headers) {
      if ('delete' in config.headers && typeof config.headers.delete === 'function') {
        config.headers.delete('Content-Type');
      } else {
        delete (config.headers as Record<string, unknown>)['Content-Type'];
      }
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
      return body.data as unknown as AxiosResponse<ApiResponse<unknown>>;
    }
    return body as unknown as AxiosResponse<ApiResponse<unknown>>;
  },
  async (error: AxiosError<ApiResponse<unknown>>) => {
    const status = error.response?.status || 500;
    const responseBody = error.response?.data;
    const rawMessage = responseBody?.message || error.message || 'Network Error';
    const normalized = normalizeApiError(rawMessage);
    const originalRequest = error.config as (InternalAxiosRequestConfig & { _retry?: boolean; silentError?: boolean }) | undefined;
    const requestUrl = originalRequest?.url;
    const requestMethod = (originalRequest?.method || 'get').toLowerCase();
    const logKey = `${requestMethod}:${requestUrl}:${status}:${normalized.code || normalized.rawMessage}`;
    const shouldPrintErrorLog = shouldLogError(logKey);
    const isSilentRequest = Boolean(originalRequest?.silentError);

    if (status === 401 && originalRequest && !originalRequest._retry) {
      if (shouldBypassSessionHandling(status, requestUrl, normalized.code)) {
        return Promise.reject(createApiError(normalized, status));
      }

      if (isRefreshRequest(requestUrl)) {
        handleSessionExpired();
        return Promise.reject(createSessionExpiredError(normalized));
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
          throw new Error('NO_REFRESH_TOKEN');
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
        handleSessionExpired();
        return Promise.reject(createSessionExpiredError(normalized));
      } finally {
        isRefreshing = false;
      }
    }

    maybeHandleGlobal401(status, requestUrl, normalized.code);

    if (!isSilentRequest && shouldPrintErrorLog) {
      console.error('API Error', {
        url: error.config?.url,
        method: error.config?.method,
        status,
        rawMessage: normalized.rawMessage,
        code: normalized.code,
      });
    }

    if (!isSilentRequest && status !== 401 && status !== 403 && shouldPrintErrorLog) {
      toast.error(normalized.userMessage);
    }

    return Promise.reject(
      createApiError(normalized, status),
    );
  },
);

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
export const client = {
  get: <T>(url: string, config?: ApiRequestConfig) =>
    axiosInstance.get<unknown, T>(url, config),

  post: <T>(url: string, data?: unknown, config?: ApiRequestConfig) =>
    axiosInstance.post<unknown, T>(url, data, config),

  put: <T>(url: string, data?: unknown, config?: ApiRequestConfig) =>
    axiosInstance.put<unknown, T>(url, data, config),

  delete: <T>(url: string, config?: ApiRequestConfig) =>
    axiosInstance.delete<unknown, T>(url, config),

  patch: <T>(url: string, data?: unknown, config?: ApiRequestConfig) =>
    axiosInstance.patch<unknown, T>(url, data, config),
};
