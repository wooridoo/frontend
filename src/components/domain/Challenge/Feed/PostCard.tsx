import clsx from 'clsx';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Heart, MessageCircle, Share2, MoreVertical, Pin, Trash2 } from 'lucide-react';
import { type User } from '@/types/user';
import { Avatar } from '@/components/ui/Avatar';
import { useAuthStore } from '@/store/useAuthStore';
import { useToggleLike, useDeletePost } from '@/hooks/useFeed';
import { ResponsiveOverlay } from '@/components/ui/Overlay/ResponsiveOverlay';
import styles from './PostCard.module.css';

interface PostCardProps {
  id: string;
  challengeId?: string;
  createdBy: User;
  content: string;
  images?: string[];
  createdAt: string;
  likeCount: number;
  commentCount: number;
  isNotice?: boolean;
  isLiked?: boolean;
}

export function PostCard({
  id,
  challengeId: propChallengeId,
  createdBy,
  content,
  images,
  createdAt,
  likeCount: initialLikeCount,
  commentCount,
  isNotice,
  isLiked: initialIsLiked
}: PostCardProps) {
  const { id: paramChallengeId } = useParams<{ id: string }>();
  const challengeId = propChallengeId || paramChallengeId || '';
  const { user } = useAuthStore();

  const [isLiked, setIsLiked] = useState(initialIsLiked || false);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleLike = useToggleLike(challengeId);
  const deletePost = useDeletePost(challengeId);

  // Determine author name safely
  const author = createdBy || { nickname: '알 수 없음', profileImage: undefined, userId: 'unknown' };
  const authorName = author.nickname;
  const isAuthor = user?.userId === author.userId;

  const handleLike = () => {
    if (!user) return; // Login required check usually handled globally or here

    // Optimistic update
    const previousIsLiked = isLiked;
    const previousLikeCount = likeCount;

    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);

    toggleLike.mutate(id, {
      onError: () => {
        // Revert on error
        setIsLiked(previousIsLiked);
        setLikeCount(previousLikeCount);
      }
    });
  };

  const handleDelete = () => {
    if (!window.confirm('게시글을 삭제하시겠습니까?')) return;

    deletePost.mutate(id, {
      onSuccess: () => {
        setIsMenuOpen(false);
      }
    });
  };

  const MenuContent = (
    <div className="flex flex-col p-1 min-w-[150px] bg-white rounded-md shadow-lg border border-gray-100">
      {/* 
      <button 
        className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
        onClick={() => {
           alert('수정 기능 준비 중입니다.');
           setIsMenuOpen(false);
        }}
      >
        <Edit2 size={16} />
        수정하기
      </button> 
      */}
      <button
        className="flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 w-full text-left rounded-md"
        onClick={handleDelete}
      >
        <Trash2 size={16} />
        삭제하기
      </button>
    </div>
  );

  return (
    <div className={clsx(styles.card, isNotice && styles.noticeCard)}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.authorInfo}>
          <Avatar
            src={author.profileImage}
            name={authorName}
            size="md"
            className={styles.avatar}
          />
          <div className={styles.metaData}>
            <div className={styles.nameRow}>
              <span className={styles.name}>{authorName}</span>
              {/* Role badge handling might need extra prop if not in User */}
              {isNotice && <span className={styles.noticeBadge}>📢 필독</span>}
            </div>
            <span className={styles.time}>{createdAt}</span>
          </div>
        </div>

        {isAuthor && (
          <ResponsiveOverlay
            trigger={
              <button className={styles.moreButton}>
                <MoreVertical size={18} />
              </button>
            }
            open={isMenuOpen}
            onOpenChange={setIsMenuOpen}
            title="게시글 메뉴"
            align="end"
          >
            {MenuContent}
          </ResponsiveOverlay>
        )}
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
        <button
          className={clsx(styles.actionButton, isLiked && "text-red-500")}
          onClick={handleLike}
        >
          <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
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
