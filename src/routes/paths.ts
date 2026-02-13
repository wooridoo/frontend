import { toChallengeSlug } from '@/lib/utils/challengeRoute';

const toChallengePath = (challengeRef: string | number, challengeTitle?: string): string =>
  `/${toChallengeSlug(String(challengeRef), challengeTitle)}/challenge`;

export const PATHS = {
  HOME: '/',
  AUTH: {
    LOGIN: '/login',
    SIGNUP: '/signup',
  },
  RECOMMENDED: '/recommended',
  SIGNUP: '/signup',
  EXPLORE: '/explore',
  FEED: '/feed',
  NOT_FOUND: '/404',
  WALLET: {
    ROOT: '/wallet',
    CHARGE: '/wallet/charge',
    WITHDRAW: '/wallet/withdraw',
    PAYMENT_CALLBACK: '/wallet/payment/callback',
  },
  CHALLENGE: {
    ROOT: '/challenge',
    LEGACY_ROOT: '/challenges',
    LEGACY_GROUP_ROOT: '/groups',
    NEW: '/challenge/new',
    DETAIL: (id: string | number, challengeTitle?: string) => toChallengePath(id, challengeTitle),
    INTRO: (id: string | number, challengeTitle?: string) => `${toChallengePath(id, challengeTitle)}/intro`,
    FEED: (id: string | number, challengeTitle?: string) => `${toChallengePath(id, challengeTitle)}/feed`,
    MEETINGS: (id: string | number, challengeTitle?: string) => `${toChallengePath(id, challengeTitle)}/meetings`,
    MEMBERS: (id: string | number, challengeTitle?: string) => `${toChallengePath(id, challengeTitle)}/members`,
    SETTINGS: (id: string | number, challengeTitle?: string) => `${toChallengePath(id, challengeTitle)}/settings`,
  },
  MY: {
    PROFILE: '/me',
    ACCOUNT: '/me/account',
    CHALLENGES: '/me/challenges',
    LEDGER: '/me/ledger',
    SETTINGS: '/me/settings',
  },
} as const;

export type AppPaths = typeof PATHS;
