import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { resolveChallengeId } from '@/lib/utils/challengeRoute';

export function useChallengeRoute() {
  const { id } = useParams<{ id: string }>();

  return useMemo(() => ({
    challengeRef: id,
    challengeId: resolveChallengeId(id),
  }), [id]);
}
