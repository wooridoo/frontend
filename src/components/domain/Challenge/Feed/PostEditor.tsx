import { useState } from 'react';
import styles from './PostEditor.module.css';
import { Image, Send } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useCreatePost } from '@/hooks/useFeed';
import { useChallengeRoute } from '@/hooks/useChallengeRoute';
import { useChallengeDetail } from '@/hooks/useChallenge';

interface PostEditorProps {
  onSuccess?: () => void;
}

export function PostEditor({ onSuccess }: PostEditorProps) {
  const { challengeId } = useChallengeRoute();
  const { data: challenge } = useChallengeDetail(challengeId);
  const { user } = useAuthStore();
  const avatarUrl = user?.profileImage || '/images/avatar-fallback.svg';
  const isLeader = challenge?.myMembership?.role === 'LEADER';

  const [content, setContent] = useState('');
  const [category, setCategory] = useState<'GENERAL' | 'NOTICE'>('GENERAL');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createPost = useCreatePost(challengeId || '');

  const handleSubmit = async () => {
    if (!content.trim() || !challengeId) return;

    setIsSubmitting(true);
    try {
      await createPost.mutateAsync({
        title: content.slice(0, 20), // 임시: 내용 앞부분을 제목으로 사용
        content: content.trim(),
        category,
      });
      setContent('');
      setCategory('GENERAL');
      onSuccess?.();
    } catch (error) {
      console.error('Failed to create post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className={styles.container}>
      {isLeader ? (
        <div className={styles.categoryRow}>
          <label htmlFor="post-category" className={styles.categoryLabel}>게시글 유형</label>
          <select
            id="post-category"
            className={styles.categorySelect}
            value={category}
            onChange={(e) => setCategory(e.target.value as 'GENERAL' | 'NOTICE')}
            disabled={isSubmitting}
          >
            <option value="GENERAL">일반</option>
            <option value="NOTICE">공지</option>
          </select>
        </div>
      ) : null}

      <div className={styles.inputRow}>
        <img src={avatarUrl} alt="내 프로필" className={styles.avatar} />
        <div className={styles.inputWrapper}>
          <textarea
            placeholder="새로운 소식을 공유해보세요..."
            className={styles.textarea}
            rows={1}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = `${target.scrollHeight}px`;
            }}
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className={styles.actions}>
        <button className={styles.actionButton} disabled={isSubmitting}>
          <Image size={20} />
          <span>사진</span>
        </button>
        <button
          className={styles.postButton}
          onClick={handleSubmit}
          disabled={!content.trim() || isSubmitting}
        >
          {isSubmitting ? '게시 중...' : '게시'} <Send size={14} className={styles.sendIcon} />
        </button>
      </div>
    </div>
  );
}
