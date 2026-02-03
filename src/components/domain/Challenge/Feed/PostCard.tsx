import clsx from 'clsx';
import { Heart, MessageCircle, Share2, MoreVertical, Pin } from 'lucide-react';
import { ChallengeRole } from '@/types/enums';
import styles from './PostCard.module.css';

interface PostCardProps {
  id: number;
  author: {
    name: string;
    avatar: string;
    role?: ChallengeRole;
  };
  content: string;
  images?: string[];
  createdAt: string;
  likes: number;
  comments: number;
  isNotice?: boolean;
}

export function PostCard({ author, content, images, createdAt, likes, comments, isNotice }: PostCardProps) {
  return (
    <div className={clsx(styles.card, isNotice && styles.noticeCard)}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.authorInfo}>
          <img src={author.avatar} alt={author.name} className={styles.avatar} />
          <div className={styles.metaData}>
            <div className={styles.nameRow}>
              <span className={styles.name}>{author.name}</span>
              {author.role === ChallengeRole.LEADER && <span className={styles.leaderBadge}>👑 리더</span>}
              {isNotice && <span className={styles.noticeBadge}>📢 필독</span>}
            </div>
            <span className={styles.time}>{createdAt}</span>
          </div>
        </div>
        <button className={styles.moreButton}>
          <MoreVertical size={18} />
        </button>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {isNotice && <div className={styles.pinIcon}><Pin size={14} fill="currentColor" /></div>}
        <p className={styles.text}>{content}</p>

        {images && images.length > 0 && (
          <div className={clsx(styles.imageGrid, styles[`grid${Math.min(images.length, 4)}`])}>
            {images.map((img, idx) => (
              <img key={idx} src={img} alt="Post attachment" className={styles.postImage} />
            ))}
          </div>
        )}
      </div>

      {/* Footer / Actions */}
      <div className={styles.footer}>
        <button className={styles.actionButton}>
          <Heart size={18} />
          <span>{likes}</span>
        </button>
        <button className={styles.actionButton}>
          <MessageCircle size={18} />
          <span>{comments}</span>
        </button>
        <button className={styles.shareAction}>
          <Share2 size={18} />
          <span>공유</span>
        </button>
      </div>
    </div>
  );
}
