/**
    * 동작 설명은 추후 세분화 예정입니다.
    * 동작 설명은 추후 세분화 예정입니다.
 */

export type UUID = string;

// 보조 처리
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T | null;
  message: string | null;
  timestamp: string;
}

// 보조 처리
export interface PageResponse<T> {
  content: T[];
  page: {
    number: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
}

// 보조 처리
export interface PageParams {
  page?: number;
  size?: number;
  sort?: string;
}
