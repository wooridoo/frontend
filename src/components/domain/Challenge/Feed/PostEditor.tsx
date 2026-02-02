import styles from './PostEditor.module.css';
import { Image, Send } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

export function PostEditor() {
  const { user } = useAuthStore();
  const avatarUrl = user?.avatar || 'https://ui-avatars.com/api/?name=User&background=random';

  return (
    <div className={styles.container}>
      <div className={styles.inputRow}>
        <img src={avatarUrl} alt="User" className={styles.avatar} />
        <div className={styles.inputWrapper}>
          <textarea
            placeholder="새로운 소식을 공유해보세요..."
            className={styles.textarea}
            rows={1}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = `${target.scrollHeight}px`;
            }}
          />
        </div>
      </div>

      <div className={styles.actions}>
        <button className={styles.actionButton}>
          <Image size={20} />
          <span>사진</span>
        </button>
        <button className={styles.postButton}>
          게시 <Send size={14} className={styles.sendIcon} />
        </button>
      </div>
    </div>
  );
}
