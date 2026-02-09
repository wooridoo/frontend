export const PATHS = {
  HOME: '/',
  AUTH: {
    LOGIN: '/login',   // Modal trigger conceptually, or route if implemented
    SIGNUP: '/signup', // Modal trigger conceptually
  },
  RECOMMENDED: '/recommended',
  SIGNUP: '/signup',
  EXPLORE: '/explore',
  FEED: '/feed', // Global shortcut
  NOT_FOUND: '/404',
  WALLET: {
    ROOT: '/wallet',
    CHARGE: '/wallet/charge',
    WITHDRAW: '/wallet/withdraw',
  },
  CHALLENGE: {
    ROOT: '/challenges',
    NEW: '/challenges/new',
    DETAIL: (id: string) => `/challenges/${id}`,
    INTRO: (id: string) => `/challenges/${id}/intro`, // 비멤버용 소개 페이지
    FEED: (id: string) => `/challenges/${id}/feed`,
    MEETINGS: (id: string) => `/challenges/${id}/meetings`,
    MEMBERS: (id: string | number) => `/challenges/${id}/members`,
    SETTINGS: (id: string | number) => `/challenges/${id}/settings`,
  },
  MY: {
    PROFILE: '/me',
    ACCOUNT: '/me/account',
    CHALLENGES: '/me/challenges', // Was /my-challenges
    LEDGER: '/me/ledger',         // Was /ledger
    SETTINGS: '/me/settings',     // Was /settings
  }
} as const;

// Type helper to extract path parameters if needed in the future
export type AppPaths = typeof PATHS;
