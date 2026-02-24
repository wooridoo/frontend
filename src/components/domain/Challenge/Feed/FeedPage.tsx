import styles from './FeedPage.module.css';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PostEditor } from './PostEditor';
import { PostCard } from './PostCard';
import { useFeed } from '@/hooks/useFeed';
import { Skeleton } from '@/components/feedback/Skeleton/Skeleton';
import { usePostDetailModalStore } from '@/store/modal/useModalStore';
import { useChallengeRoute } from '@/hooks/useChallengeRoute';
import { useChallengeDetail } from '@/hooks/useChallenge';

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
export function FeedPage() {
  const { challengeId, isResolving } = useChallengeRoute();
  const [searchParams, setSearchParams] = useSearchParams();
  const [threadExpandedByPostId, setThreadExpandedByPostId] = useState<Record<string, boolean>>({});
  const { data: posts, isLoading, error } = useFeed(challengeId);
  const { data: challenge } = useChallengeDetail(challengeId);
  const { onOpen: openPostDetail } = usePostDetailModalStore();
  const isLeader = challenge?.myMembership?.role === 'LEADER';

  const setThreadExpanded = (postId: string, expanded: boolean) => {
    setThreadExpandedByPostId(prev => ({ ...prev, [postId]: expanded }));
  };

  useEffect(() => {
    const targetPostId = searchParams.get('postId');
    if (!targetPostId || !posts || posts.length === 0) {
      return;
    }

    const targetPost = posts.find(post => post.id === targetPostId);
    if (!targetPost) {
      return;
    }

    openPostDetail(targetPost);

    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('postId');
    setSearchParams(nextParams, { replace: true });
  }, [openPostDetail, posts, searchParams, setSearchParams]);

  if (isResolving || isLoading) {
    return (
      <div className={styles.feedContainer}>
        <div className={styles.skeletonList}>
          <Skeleton className="w-full h-32 rounded-lg" />
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="w-full h-48 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  // 보조 처리
  if (error) {
    return (
      <div className={styles.feedContainer}>
        <div className={styles.stateText}>
          피드를 불러오는 중 오류가 발생했습니다.
        </div>
      </div>
    );
  }

  return (
    <div className={styles.feedContainer}>
      <PostEditor />
      <div className={styles.feedList}>
        {posts?.length === 0 ? (
          <div className={styles.stateText}>
            아직 게시글이 없습니다. 첫 번째 글을 작성해보세요!
          </div>
        ) : (
          posts?.map((post, index) => (
            <PostCard
              key={post.id || index}
              {...post}
              canPinNotice={isLeader}
              onOpenDetail={() => openPostDetail(post)}
              inlineThreadExpanded={Boolean(threadExpandedByPostId[post.id])}
              onInlineThreadExpandedChange={(expanded) => setThreadExpanded(post.id, expanded)}
            />
          ))
        )}
      </div>
    </div>
  );
}
