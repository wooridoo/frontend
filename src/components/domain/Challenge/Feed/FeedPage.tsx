import styles from './FeedPage.module.css';
import { PostEditor } from './PostEditor';
import { PostCard } from './PostCard';
import { useFeed } from '@/hooks/useFeed';
import { Skeleton } from '@/components/feedback/Skeleton/Skeleton';
import { VerificationModal } from '../VerificationModal';
import { useVerificationModalStore, usePostDetailModalStore } from '@/store/modal/useModalStore';
import { Button } from '@/components/ui';
import { Camera } from 'lucide-react';
import { useChallengeRoute } from '@/hooks/useChallengeRoute';
import { useChallengeDetail } from '@/hooks/useChallenge';

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
export function FeedPage() {
  const { challengeId, isResolving } = useChallengeRoute();
  const { data: posts, isLoading, error } = useFeed(challengeId);
  const { data: challenge } = useChallengeDetail(challengeId);
  const verificationModal = useVerificationModalStore();
  const { onOpen: openPostDetail } = usePostDetailModalStore();
  const isLeader = challenge?.myMembership?.role === 'LEADER';

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
      <div className={styles.headerAction}>
        {/* 인증하기 버튼 (트리거) */}
        <Button
          onClick={verificationModal.onOpen}
          className={styles.verifyButton}
        >
          <Camera size={20} />
          오늘의 인증하기
        </Button>
      </div>

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
            />
          ))
        )}
      </div>

      <VerificationModal />
    </div>
  );
}
