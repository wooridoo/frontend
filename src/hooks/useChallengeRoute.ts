import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { getChallenges } from '@/lib/api/challenge';
import {
  CHALLENGE_SLUG_REGEX,
  rememberChallengeRoute,
  resolveChallengeId,
  toChallengeTitleSlug,
} from '@/lib/utils/challengeRoute';

const isResolvedChallengeId = (value: string | undefined): boolean =>
  Boolean(value && (CHALLENGE_SLUG_REGEX.test(value) || /^\d+$/.test(value)));

export function useChallengeRoute() {
  const { id } = useParams<{ id: string }>();
  const initialResolvedId = useMemo(() => resolveChallengeId(id), [id]);
  const needsLookup = Boolean(id) && !isResolvedChallengeId(initialResolvedId);

  const { data: lookedUpChallengeId, isLoading: isResolving } = useQuery({
    queryKey: ['challenge', 'route-resolve', id],
    enabled: needsLookup,
    staleTime: 1000 * 60 * 5,
    retry: false,
    queryFn: async () => {
      if (!id) return undefined;

      const routeSlug = toChallengeTitleSlug(id);
      if (!routeSlug) return undefined;

      let queryKeyword = id;
      try {
        queryKeyword = decodeURIComponent(id);
      } catch {
        queryKeyword = id;
      }

      queryKeyword = queryKeyword.replace(/-/g, ' ').trim();
      const candidates = await getChallenges({ query: queryKeyword, size: 100 });
      const matched = candidates.find(challenge => toChallengeTitleSlug(challenge.title) === routeSlug);

      if (!matched) return undefined;

      const challengeId = String(matched.challengeId);
      rememberChallengeRoute(challengeId, matched.title);
      return challengeId;
    },
  });

  const challengeId = (isResolvedChallengeId(initialResolvedId) ? initialResolvedId : lookedUpChallengeId) || '';

  return useMemo(() => ({
    challengeRef: id,
    challengeId,
    isResolving,
  }), [challengeId, id, isResolving]);
}
