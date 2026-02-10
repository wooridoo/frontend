import { client } from './client';
import type { LoginRequest, LoginResponse, SignupRequest } from '@/types/auth';

/**
 * 로그인
 */
export async function login(data: LoginRequest): Promise<LoginResponse> {
  return client.post<LoginResponse>('/auth/login', data);
}

/**
 * 회원가입
 */
export async function signup(data: SignupRequest): Promise<void> {
  return client.post<void>('/auth/signup', data);
}

/**
 * 이메일 중복 확인 (Optional helper if API exists)
 */
export async function checkEmail(email: string): Promise<{ available: boolean }> {
  return client.get<{ available: boolean }>('/auth/check-email', { params: { email } });
}
