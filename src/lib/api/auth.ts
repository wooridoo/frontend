import { client } from './client';
import type { LoginRequest, LoginResponse, SignupRequest } from '@/types/auth';

/**
 * 로그인
 */
import { normalizeUser } from '@/lib/utils/dataMappers';

/**
 * 로그인
 */
export async function login(data: LoginRequest): Promise<LoginResponse> {
  const response = await client.post<LoginResponse>('/auth/login', data);
  if (response.user) {
    response.user = normalizeUser(response.user);
  }
  return response;
}

/**
 * 회원가입
 */
export async function signup(data: SignupRequest): Promise<void> {
  return client.post<void>('/auth/signup', data);
}

/**
 * 로그아웃
 * POST /auth/logout — 서버 측 토큰 무효화
 */
export async function logout(refreshToken: string): Promise<void> {
  return client.post<void>('/auth/logout', { refreshToken });
}

/**
 * 토큰 갱신
 * POST /auth/refresh — refreshToken으로 새 accessToken 발급
 */
export async function refreshToken(token: string): Promise<{ accessToken: string }> {
  return client.post<{ accessToken: string }>('/auth/refresh', { refreshToken: token });
}

/**
 * 비밀번호 재설정 요청
 * POST /auth/password/reset — 이메일로 재설정 링크 전송
 */
export async function requestPasswordReset(email: string): Promise<void> {
  return client.post<void>('/auth/password/reset', { email });
}

export interface PasswordResetExecuteRequest {
  token: string;
  newPassword: string;
  newPasswordConfirm: string;
}

export interface PasswordResetExecuteResponse {
  passwordReset: boolean;
}

export async function executePasswordReset(
  data: PasswordResetExecuteRequest
): Promise<PasswordResetExecuteResponse> {
  return client.put<PasswordResetExecuteResponse>('/auth/password/reset', data);
}
