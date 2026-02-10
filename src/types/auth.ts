import type { User } from './user';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}

export interface SignupRequest {
  email: string;
  password: string;
  nickname: string;
  name: string;
  phone: string;
  birthDate?: string;
  profileImage?: string;
  termsAgreed: boolean;
  privacyAgreed: boolean;
  marketingAgreed: boolean;
}
