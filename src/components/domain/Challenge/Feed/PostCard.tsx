import clsx from 'clsx';
import { useState } from 'react';
import { Heart, MessageCircle, MoreVertical, Pin, Share2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { type User } from '@/types/user';
import { Avatar } from '@/components/ui/Avatar';
import { CommentSection } from '@/components/domain/Comment/CommentSection';
import { useAuthStore } from '@/store/useAuthStore';
import { useToggleLike, useDeletePost, useSetPostPinned } from '@/hooks/useFeed';
import { ResponsiveOverlay } from '@/components/ui/Overlay/ResponsiveOverlay';
import { resolveChallengeId } from '@/lib/utils/challengeRoute';
import { useChallengeRoute } from '@/hooks/useChallengeRoute';
import { useConfirmDialog } from '@/store/modal/useConfirmDialogStore';
import { capabilities } from '@/lib/api/capabilities';
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
  isPinned?: boolean;
  isLiked?: boolean;
  canPinNotice?: boolean;
  onOpenDetail?: () => void;
  inlineThreadExpanded?: boolean;
  onInlineThreadExpandedChange?: (expanded: boolean) => void;
}

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
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
  isPinned = false,
  isLiked: initialIsLiked,
  canPinNotice = false,
  onOpenDetail,
  inlineThreadExpanded,
  onInlineThreadExpandedChange,
}: PostCardProps) {
  const { challengeId: routeChallengeId } = useChallengeRoute();
  const { confirm } = useConfirmDialog();
  const challengeId = resolveChallengeId(propChallengeId) || routeChallengeId || '';
  const { user } = useAuthStore();

  const [isLiked, setIsLiked] = useState(initialIsLiked || false);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [internalThreadExpanded, setInternalThreadExpanded] = useState(false);

  const isThreadExpanded = inlineThreadExpanded ?? internalThreadExpanded;
  const setThreadExpanded = (nextExpanded: boolean | ((prevExpanded: boolean) => boolean)) => {
    const resolved = typeof nextExpanded === 'function'
      ? nextExpanded(isThreadExpanded)
      : nextExpanded;

    if (onInlineThreadExpandedChange) {
      onInlineThreadExpandedChange(resolved);
      return;
    }
    setInternalThreadExpanded(resolved);
  };

  const toggleLike = useToggleLike(challengeId);
  const deletePost = useDeletePost(challengeId);
  const pinPost = useSetPostPinned(challengeId);

  const author = createdBy || { nickname: '알 수 없음', profileImage: undefined, userId: 'unknown' };
  const authorName = author.nickname;
  const isAuthor = user?.userId === author.userId;
  const canOpenMenu = isAuthor || (canPinNotice && isNotice);

  const formatCreatedAt = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

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

  const handleTogglePin = () => {
    pinPost.mutate(
      { postId: id, pinned: !isPinned },
      {
        onSuccess: () => {
          toast.success(isPinned ? '공지 고정을 해제했습니다.' : '공지를 상단에 고정했습니다.');
          setIsMenuOpen(false);
        },
        onError: () => {
          toast.error('공지 고정 상태 변경에 실패했습니다.');
        },
      },
    );
  };

  const handleShare = async () => {
    if (typeof window === 'undefined') {
      return;
    }

    const currentUrl = `${window.location.origin}${window.location.pathname}${window.location.search}${window.location.hash}`;
    const shareUrl = new URL(currentUrl);
    shareUrl.searchParams.set('postId', id);
    const url = shareUrl.toString();

    try {
      if (navigator.share) {
        await navigator.share({
          title: '챌린지 피드',
          text: '게시글을 확인해보세요.',
          url,
        });
        return;
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
        toast.success('게시글 링크가 복사되었습니다.');
        return;
      }

      toast.error('공유를 지원하지 않는 브라우저입니다.');
    } catch {
      toast.error('공유에 실패했습니다.');
    }
  };

  const menuContent = (
    <div className={styles.menuContainer}>
      {canPinNotice && isNotice ? (
        <button
          className={styles.menuButton}
          onClick={handleTogglePin}
          disabled={pinPost.isPending}
        >
          <Pin size={16} />
          {isPinned ? '고정 해제' : '상단 고정'}
        </button>
      ) : null}
      {isAuthor ? (
        <button
          className={clsx(styles.menuButton, styles.menuButtonDanger)}
          onClick={() => {
            void handleDelete();
          }}
        >
          <Trash2 size={16} />
          삭제하기
        </button>
      ) : null}
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
            <span className={styles.time}>{formatCreatedAt(createdAt)}</span>
          </div>
        </div>

        {canOpenMenu ? (
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

      <div className={styles.content}>
        {isPinned ? (
          <div className={styles.pinIcon}>
            <Pin fill="currentColor" size={14} />
          </div>
        ) : null}
        <p className={styles.text}>{content}</p>

        {images && images.length > 0 ? (
          <div className={clsx(styles.imageGrid, styles[`grid${Math.min(images.length, 4)}`])}>
            {images.map((img, idx) => (
              <img key={idx} alt={`첨부 이미지 ${idx + 1}`} className={styles.postImage} src={img} />
            ))}
          </div>
        ) : null}
      </div>

      <div className={styles.footer}>
        <button className={clsx(styles.actionButton, isLiked && styles.activeActionButton)} onClick={handleLike}>
          <Heart fill={isLiked ? 'currentColor' : 'none'} size={18} />
          <span>{likeCount}</span>
        </button>
        <button
          className={styles.actionButton}
          onClick={() => {
            if (capabilities.feedInlineThread) {
              setThreadExpanded(prev => !prev);
              return;
            }
            handleOpenDetail();
          }}
        >
          <MessageCircle size={18} />
          <span>{commentCount}</span>
        </button>
        <button className={styles.shareAction} onClick={handleShare}>
          <Share2 size={18} />
          <span>공유</span>
        </button>
      </div>

      {capabilities.feedInlineThread ? (
        <div className={styles.inlineThread}>
          <CommentSection
            challengeId={challengeId}
            postId={id}
            mode="inline"
            commentCountHint={commentCount}
            expanded={isThreadExpanded}
            previewCount={2}
            onExpandChange={setThreadExpanded}
          />
        </div>
      ) : null}
    </div>
  );
}
