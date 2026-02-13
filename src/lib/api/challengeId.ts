import { resolveChallengeId } from '@/lib/utils/challengeRoute';

export const toApiChallengeId = (challengeRef: string | undefined | null): string =>
  resolveChallengeId(challengeRef);
