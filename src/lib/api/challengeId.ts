import { resolveChallengeId } from '@/lib/utils/challengeRoute';

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
export const toApiChallengeId = (challengeRef: string | undefined | null): string =>
  resolveChallengeId(challengeRef);
