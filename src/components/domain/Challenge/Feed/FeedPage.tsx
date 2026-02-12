import { useParams } from 'react-router-dom';
import styles from './FeedPage.module.css';
import { PostEditor } from './PostEditor';
import { PostCard } from './PostCard';
import { useFeed } from '@/hooks/useFeed';
import { Skeleton } from '@/components/feedback/Skeleton/Skeleton';
import { VerificationModal } from '../VerificationModal';
import { useVerificationModalStore } from '@/store/useVerificationModalStore';
import { Button } from '@/components/ui';
import { Camera } from 'lucide-react';

export function FeedPage() {
  const { id } = useParams<{ id: string }>();
  const { data: posts, isLoading, error } = useFeed(id);
  const verificationModal = useVerificationModalStore();

  if (isLoading) {
    return (
      <div className={styles.feedContainer}>
        <div className="flex flex-col gap-4">
          <Skeleton className="w-full h-32 rounded-lg" />
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="w-full h-48 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  // Error handling: API errors are thrown, render empty state
  if (error) {
    return (
      <div className={styles.feedContainer}>
        <div className="text-center py-8 text-gray-500">
          피드를 불러오는 중 오류가 발생했습니다.
        </div>
      </div>
    );
  }

  return (
    <div className={styles.feedContainer}>
      <div className={styles.headerAction}>
        {/* Verification Trigger */}
        <Button
          onClick={verificationModal.onOpen}
          className="w-full mb-4 bg-primary text-white flex gap-2 items-center justify-center py-4 rounded-xl"
        >
          <Camera size={20} />
          오늘의 인증하기
        </Button>
      </div>

      <PostEditor />
      <div className={styles.feedList}>
        {posts?.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            아직 게시글이 없습니다. 첫 번째 글을 작성해보세요!
          </div>
        ) : (
          posts?.map((post, index) => (
            <PostCard key={post.id || index} {...post} />
          ))
        )}
      </div>

      <VerificationModal />
    </div>
  );
}
