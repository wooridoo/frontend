import { useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './PostEditor.module.css';
import { Image, Send } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useCreatePost } from '@/hooks/useFeed';

interface PostEditorProps {
  onSuccess?: () => void;
}

export function PostEditor({ onSuccess }: PostEditorProps) {
  const { id: challengeId } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const avatarUrl = user?.profileImage || 'https://ui-avatars.com/api/?name=User&background=random';

  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createPost = useCreatePost(challengeId || '');

  const handleSubmit = async () => {
    if (!content.trim() || !challengeId) return;

    setIsSubmitting(true);
    try {
      await createPost.mutateAsync({ content: content.trim() });
      setContent('');
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
      <div className={styles.inputRow}>
        <img src={avatarUrl} alt="User" className={styles.avatar} />
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
