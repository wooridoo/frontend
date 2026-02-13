import { toChallengeSlug } from '@/lib/utils/challengeRoute';

const toGroupBase = (challengeRef: string | number): string =>
  `/groups/${toChallengeSlug(String(challengeRef))}`;

export const CHALLENGE_ROUTES = {
  ROOT: '/groups',
  NEW: '/groups/new',
  DETAIL_PATTERN: '/groups/:id',
  INTRO_PATTERN: '/groups/:id/intro',
  LEGACY_DETAIL_PATTERN: '/challenges/:id/*',
  LEGACY_NEW: '/challenges/new',
  LEGACY_ROOT: '/challenges',
  detail: (challengeRef: string | number) => toGroupBase(challengeRef),
  intro: (challengeRef: string | number) => `${toGroupBase(challengeRef)}/intro`,
  feed: (challengeRef: string | number) => `${toGroupBase(challengeRef)}/feed`,
  meetings: (challengeRef: string | number) => `${toGroupBase(challengeRef)}/meetings`,
  meetingDetail: (challengeRef: string | number, meetingId: string | number) =>
    `${toGroupBase(challengeRef)}/meetings/${meetingId}`,
  ledger: (challengeRef: string | number) => `${toGroupBase(challengeRef)}/ledger`,
  votes: (challengeRef: string | number) => `${toGroupBase(challengeRef)}/votes`,
  voteNew: (challengeRef: string | number) => `${toGroupBase(challengeRef)}/votes/new`,
  voteDetail: (challengeRef: string | number, voteId: string | number) =>
    `${toGroupBase(challengeRef)}/votes/${voteId}`,
  members: (challengeRef: string | number) => `${toGroupBase(challengeRef)}/members`,
  memberDetail: (challengeRef: string | number, memberId: string | number) =>
    `${toGroupBase(challengeRef)}/members/${memberId}`,
  settings: (challengeRef: string | number) => `${toGroupBase(challengeRef)}/settings`,
};
