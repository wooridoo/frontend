import { PATHS } from '@/routes/paths';

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
  detail: (challengeRef: string | number) => PATHS.CHALLENGE.DETAIL(challengeRef),
  detailWithTitle: (challengeRef: string | number, challengeTitle: string) =>
    PATHS.CHALLENGE.DETAIL(challengeRef, challengeTitle),
  intro: (challengeRef: string | number) => PATHS.CHALLENGE.INTRO(challengeRef),
  feed: (challengeRef: string | number) => PATHS.CHALLENGE.FEED(challengeRef),
  feedWithTitle: (challengeRef: string | number, challengeTitle: string) =>
    PATHS.CHALLENGE.FEED(challengeRef, challengeTitle),
  meetings: (challengeRef: string | number) => PATHS.CHALLENGE.MEETINGS(challengeRef),
  meetingDetail: (challengeRef: string | number, meetingId: string | number) =>
    `${PATHS.CHALLENGE.MEETINGS(challengeRef)}/${meetingId}`,
  ledger: (challengeRef: string | number) => `${PATHS.CHALLENGE.DETAIL(challengeRef)}/ledger`,
  votes: (challengeRef: string | number) => `${PATHS.CHALLENGE.DETAIL(challengeRef)}/votes`,
  voteNew: (challengeRef: string | number) => `${PATHS.CHALLENGE.DETAIL(challengeRef)}/votes/new`,
  voteDetail: (challengeRef: string | number, voteId: string | number) =>
    `${PATHS.CHALLENGE.DETAIL(challengeRef)}/votes/${voteId}`,
  members: (challengeRef: string | number) => PATHS.CHALLENGE.MEMBERS(challengeRef),
  memberDetail: (challengeRef: string | number, memberId: string | number) =>
    `${PATHS.CHALLENGE.MEMBERS(challengeRef)}/${memberId}`,
  settings: (challengeRef: string | number) => PATHS.CHALLENGE.SETTINGS(challengeRef),
};
