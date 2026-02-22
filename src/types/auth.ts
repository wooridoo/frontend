import type { User } from './user';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType?: string;
  expiresIn?: number;
  returnTo?: string | null;
  user: User;
}

export type SocialAuthProvider = 'GOOGLE' | 'KAKAO';
export type SocialAuthIntent = 'login' | 'signup';

export interface SocialAuthStartRequest {
  provider: SocialAuthProvider;
  intent: SocialAuthIntent;
  returnTo?: string;
}

export interface SocialAuthStartResponse {
  authorizeUrl: string;
}

export interface SocialAuthCompleteRequest {
  provider: SocialAuthProvider;
  code: string;
  state: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  nickname: string;
  name: string;
  phone: string;
  birthDate?: string;
  gender?: string; // ?? ??
  profileImage?: string;
  verificationToken?: string;
  termsAgreed: boolean;
  privacyAgreed: boolean;
  marketingAgreed?: boolean;
}
