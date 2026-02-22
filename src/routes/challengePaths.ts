import { PATHS } from '@/routes/paths';

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
export const CHALLENGE_ROUTES = {
  ROOT: PATHS.CHALLENGE.ROOT,
  NEW: PATHS.CHALLENGE.NEW,
  DETAIL_PATTERN: '/:id/challenge',
  INTRO_PATTERN: '/:id/challenge/intro',
  LEGACY_DETAIL_PATTERN: '/challenges/:id/*',
  LEGACY_GROUP_DETAIL_PATTERN: '/groups/:id/*',
  LEGACY_NEW: PATHS.CHALLENGE.LEGACY_ROOT + '/new',
  LEGACY_GROUP_NEW: PATHS.CHALLENGE.LEGACY_GROUP_ROOT + '/new',
  LEGACY_ROOT: PATHS.CHALLENGE.LEGACY_ROOT,
  LEGACY_GROUP_ROOT: PATHS.CHALLENGE.LEGACY_GROUP_ROOT,
  detail: (challengeRef: string | number, challengeTitle?: string) =>
    PATHS.CHALLENGE.DETAIL(challengeRef, challengeTitle),
  detailWithTitle: (challengeRef: string | number, challengeTitle: string) =>
    PATHS.CHALLENGE.DETAIL(challengeRef, challengeTitle),
  intro: (challengeRef: string | number, challengeTitle?: string) =>
    PATHS.CHALLENGE.INTRO(challengeRef, challengeTitle),
  feed: (challengeRef: string | number, challengeTitle?: string) =>
    PATHS.CHALLENGE.FEED(challengeRef, challengeTitle),
  feedWithTitle: (challengeRef: string | number, challengeTitle: string) =>
    PATHS.CHALLENGE.FEED(challengeRef, challengeTitle),
  meetings: (challengeRef: string | number, challengeTitle?: string) =>
    PATHS.CHALLENGE.MEETINGS(challengeRef, challengeTitle),
  meetingDetail: (
    challengeRef: string | number,
    meetingId: string | number,
    challengeTitle?: string
  ) => `${PATHS.CHALLENGE.MEETINGS(challengeRef, challengeTitle)}/${meetingId}`,
  ledger: (challengeRef: string | number, challengeTitle?: string) =>
    `${PATHS.CHALLENGE.DETAIL(challengeRef, challengeTitle)}/ledger`,
  votes: (challengeRef: string | number, challengeTitle?: string) =>
    `${PATHS.CHALLENGE.DETAIL(challengeRef, challengeTitle)}/votes`,
  voteNew: (challengeRef: string | number, challengeTitle?: string) =>
    `${PATHS.CHALLENGE.DETAIL(challengeRef, challengeTitle)}/votes/new`,
  voteDetail: (challengeRef: string | number, voteId: string | number, challengeTitle?: string) =>
    `${PATHS.CHALLENGE.DETAIL(challengeRef, challengeTitle)}/votes/${voteId}`,
  members: (challengeRef: string | number, challengeTitle?: string) =>
    PATHS.CHALLENGE.MEMBERS(challengeRef, challengeTitle),
  memberDetail: (
    challengeRef: string | number,
    memberId: string | number,
    challengeTitle?: string
  ) => `${PATHS.CHALLENGE.MEMBERS(challengeRef, challengeTitle)}/${memberId}`,
  settings: (challengeRef: string | number, challengeTitle?: string) =>
    PATHS.CHALLENGE.SETTINGS(challengeRef, challengeTitle),
};
