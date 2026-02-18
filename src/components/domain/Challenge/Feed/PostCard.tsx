import clsx from 'clsx';
import { useState } from 'react';
import { Heart, MessageCircle, MoreVertical, Pin, Share2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { type User } from '@/types/user';
import { Avatar } from '@/components/ui/Avatar';
import { useAuthStore } from '@/store/useAuthStore';
import { useToggleLike, useDeletePost } from '@/hooks/useFeed';
import { ResponsiveOverlay } from '@/components/ui/Overlay/ResponsiveOverlay';
import { resolveChallengeId } from '@/lib/utils/challengeRoute';
import { useChallengeRoute } from '@/hooks/useChallengeRoute';
import { useConfirmDialog } from '@/store/modal/useConfirmDialogStore';
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
  onOpenDetail?: () => void;
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
  isLiked: initialIsLiked,
  onOpenDetail,
}: PostCardProps) {
  const { challengeId: routeChallengeId } = useChallengeRoute();
  const { confirm } = useConfirmDialog();
  const challengeId = resolveChallengeId(propChallengeId) || routeChallengeId || '';
  const { user } = useAuthStore();

  const [isLiked, setIsLiked] = useState(initialIsLiked || false);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleLike = useToggleLike(challengeId);
  const deletePost = useDeletePost(challengeId);

  const author = createdBy || { nickname: '알 수 없음', profileImage: undefined, userId: 'unknown' };
  const authorName = author.nickname;
  const isAuthor = user?.userId === author.userId;

  const handleLike = () => {
    if (!user) return;

    const previousIsLiked = isLiked;
    const previousLikeCount = likeCount;

    setIsLiked(!isLiked);
    setLikeCount(prev => (isLiked ? prev - 1 : prev + 1));

    toggleLike.mutate(id, {
      onError: () => {
        setIsLiked(previousIsLiked);
        setLikeCount(previousLikeCount);
      },
    });
  };

  const handleDelete = async () => {
    const isConfirmed = await confirm({
      title: '게시글을 삭제하시겠습니까?',
      confirmText: '삭제',
      cancelText: '취소',
      variant: 'danger',
    });
    if (!isConfirmed) return;

    deletePost.mutate(id, {
      onSuccess: () => {
        setIsMenuOpen(false);
        toast.success('게시글이 삭제되었습니다.');
      },
      onError: () => {
        toast.error('게시글 삭제에 실패했습니다.');
      },
    });
  };

  const handleOpenDetail = () => {
    onOpenDetail?.();
  };

  const menuContent = (
    <div className="flex flex-col p-1 min-w-[150px] bg-white rounded-md shadow-lg border border-gray-100">
      <button
        className="flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 w-full text-left rounded-md"
        onClick={() => {
          void handleDelete();
        }}
      >
        <Trash2 size={16} />
        삭제하기
      </button>
    </div>
  );

  return (
    <div className={clsx(styles.card, isNotice && styles.noticeCard)}>
      <div className={styles.header}>
        <div className={styles.authorInfo}>
          <Avatar className={styles.avatar} name={authorName} size="md" src={author.profileImage} />
          <div className={styles.metaData}>
            <div className={styles.nameRow}>
              <span className={styles.name}>{authorName}</span>
              {isNotice ? <span className={styles.noticeBadge}>공지</span> : null}
            </div>
            <span className={styles.time}>{createdAt}</span>
          </div>
        </div>

        {isAuthor ? (
          <ResponsiveOverlay
            align="end"
            onOpenChange={setIsMenuOpen}
            open={isMenuOpen}
            title="게시글 메뉴"
            trigger={
              <button className={styles.moreButton}>
                <MoreVertical size={18} />
              </button>
            }
          >
            {menuContent}
          </ResponsiveOverlay>
        ) : null}
      </div>

      <div className={styles.content} onClick={handleOpenDetail}>
        {isNotice ? (
          <div className={styles.pinIcon}>
            <Pin fill="currentColor" size={14} />
          </div>
        ) : null}
        <p className={styles.text}>{content}</p>

        {images && images.length > 0 ? (
          <div className={clsx(styles.imageGrid, styles[`grid${Math.min(images.length, 4)}`])}>
            {images.map((img, idx) => (
              <img key={idx} alt="Post attachment" className={styles.postImage} src={img} />
            ))}
          </div>
        ) : null}
      </div>

      <div className={styles.footer}>
        <button className={clsx(styles.actionButton, isLiked && 'text-red-500')} onClick={handleLike}>
          <Heart fill={isLiked ? 'currentColor' : 'none'} size={18} />
          <span>{likeCount}</span>
        </button>
        <button className={styles.actionButton} onClick={handleOpenDetail}>
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
