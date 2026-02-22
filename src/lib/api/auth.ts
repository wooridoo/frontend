import { client } from './client';
import type {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SocialAuthCompleteRequest,
  SocialAuthStartRequest,
  SocialAuthStartResponse,
} from '@/types/auth';

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
    * 동작 설명은 추후 세분화 예정입니다.
 */
export async function logout(refreshToken: string): Promise<void> {
  return client.post<void>('/auth/logout', { refreshToken });
}

/**
 * 토큰 갱신
    * 동작 설명은 추후 세분화 예정입니다.
 */
export async function refreshToken(token: string): Promise<{ accessToken: string }> {
  return client.post<{ accessToken: string }>('/auth/refresh', { refreshToken: token });
}

/**
 * 비밀번호 재설정 요청
    * 동작 설명은 추후 세분화 예정입니다.
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

/**
 * 소셜 로그인 인가 URL을 발급합니다.
 */
export async function startSocialAuth(data: SocialAuthStartRequest): Promise<SocialAuthStartResponse> {
  return client.post<SocialAuthStartResponse>('/auth/social/start', data);
}

/**
 * 소셜 인가 코드를 서버에서 교환해 서비스 토큰을 발급받습니다.
 */
export async function completeSocialAuth(data: SocialAuthCompleteRequest): Promise<LoginResponse> {
  const response = await client.post<LoginResponse>('/auth/social/complete', data);
  if (response.user) {
    response.user = normalizeUser(response.user);
  }
  return response;
}
