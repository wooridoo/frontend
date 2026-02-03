import { useParams } from 'react-router-dom';
import styles from './FeedPage.module.css';
import { PostEditor } from './PostEditor';
import { PostCard } from './PostCard';
import { useChallengeGuard } from '@/hooks/useChallengeGuard';
import { Skeleton } from '@/components/feedback/Skeleton/Skeleton';
import { VerificationModal } from '../VerificationModal';
import { useVerificationModalStore } from '@/store/useVerificationModalStore';
import { Button } from '@/components/ui';
import { Camera } from 'lucide-react';

export function FeedPage() {
  const { id } = useParams<{ id: string }>();
  const { data: posts, isLoading, error } = useChallengeGuard(id || '');
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

  // Error is handled by useEffect in the hook (Redirects), but we render null/fallback here
  if (error) {
    return null;
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
        {posts?.map(post => (
          <PostCard key={post.id} {...post} />
        ))}
      </div>

      <VerificationModal />
      <VerificationModal />
    </div>
  );
}

