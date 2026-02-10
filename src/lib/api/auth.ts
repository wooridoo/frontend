import { client } from './client';
import type { User } from '@/types/user';

// =====================
// Types
// =====================

export interface LoginRequest {
  email: string;
  password?: string;
  socialProvider?: 'GOOGLE' | 'KAKAO' | 'NAVER';
  socialToken?: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface SignupRequest {
  email: string;
  password?: string;
  nickname: string;
  name: string; // Real name
  phone: string; // Phone number
  birthDate?: string; // YYYY-MM-DD
  profileImage?: string;
  socialProvider?: 'GOOGLE' | 'KAKAO' | 'NAVER';
  socialToken?: string;
  termsAgreed?: boolean;
  privacyAgreed?: boolean;
  marketingAgreed?: boolean;
}

export interface SignupResponse {
  userId: number;
  email: string;
  nickname: string;
}

// =====================
// API Functions
// =====================

/**
 * 로그인 (API 001)
 */
export async function login(data: LoginRequest): Promise<LoginResponse> {
  // USE_MOCK check could be added here if needed, but we want real auth now.
  // if (USE_MOCK) return mockLogin(data);
  return client.post<LoginResponse>('/auth/login', data);
}

/**
 * 회원가입 (API 002)
 */
export async function signup(data: SignupRequest): Promise<SignupResponse> {
  return client.post<SignupResponse>('/auth/signup', data);
}
