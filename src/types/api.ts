/**
 * WooriDo API Type Definitions
 * Based on API_SPECIFICATION_1.0.0.md
 */

export type UUID = string;

// Generic API Response Wrapper
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string; // ISO 8601
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

// Pagination Response Wrapper
export interface PageResponse<T> {
  content: T[];
  page: {
    number: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
}

// Common Params
export interface PageParams {
  page?: number;
  size?: number;
  sort?: string;
}
