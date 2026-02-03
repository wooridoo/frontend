export const PATHS = {
  HOME: '/',
  AUTH: {
    LOGIN: '/login',   // Modal trigger conceptually, or route if implemented
    SIGNUP: '/signup', // Modal trigger conceptually
  },
  RECOMMENDED: '/recommended',
  EXPLORE: '/explore',
  FEED: '/feed', // Global shortcut
  NOT_FOUND: '/404',
  CHALLENGE: {
    ROOT: '/challenges',
    CREATE: '/challenges/create',
    DETAIL: (id: string | number) => `/challenges/${id}`,
    DASHBOARD: (id: string | number) => `/challenges/${id}/dashboard`,
    FEED: (id: string | number) => `/challenges/${id}/feed`,
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
