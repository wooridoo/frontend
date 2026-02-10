import clsx from 'clsx';
import { Heart, MessageCircle, Share2, MoreVertical, Pin } from 'lucide-react';
import { type User } from '@/types/user';
import styles from './PostCard.module.css';

interface PostCardProps {
  id: string;
  createdBy: User;
  content: string;
  images?: string[];
  createdAt: string;
  likeCount: number;
  commentCount: number;
  isNotice?: boolean;
}

export function PostCard({ createdBy, content, images, createdAt, likeCount, commentCount, isNotice }: PostCardProps) {
  const authorName = createdBy.nickname;
  const authorImage = createdBy.profileImage || `https://i.pravatar.cc/150?u=${createdBy.userId}`;
  // User doesn't have role directly usually? Leader check needs challenge info.
  // For now, assuming User object has what we need or we display what pertains to user.
  // The layout uses createdBy.

  return (
    <div className={clsx(styles.card, isNotice && styles.noticeCard)}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.authorInfo}>
          <img src={authorImage} alt={authorName} className={styles.avatar} />
          <div className={styles.metaData}>
            <div className={styles.nameRow}>
              <span className={styles.name}>{authorName}</span>
              {/* Role badge handling might need extra prop if not in User */}
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
          <span>{likeCount}</span>
        </button>
        <button className={styles.actionButton}>
          <MessageCircle size={18} />
          <span>{commentCount}</span>
        </button>
        <button className={styles.shareAction}>
          <Share2 size={18} />
          <span>공유</span>
        </button>
      </div>
    </div>
  );
}
