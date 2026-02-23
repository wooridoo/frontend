import { useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import {
  useComments,
  useCreateComment,
  useDeleteComment,
  useToggleCommentLike,
  useUpdateComment,
} from '@/hooks/useComment';
import { useAuthStore } from '@/store/useAuthStore';
import { Button, Input } from '@/components/ui';
import {
  Check,
  CornerDownRight,
  Heart,
  PencilLine,
  Send,
  Trash2,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from '@/lib/utils';
import type { Comment } from '@/types/comment';
import { useConfirmDialog } from '@/store/modal/useConfirmDialogStore';
import { capabilities } from '@/lib/api/capabilities';
import styles from './CommentSection.module.css';

interface CommentSectionProps {
  challengeId: string;
  postId: string;
  mode?: 'modal' | 'inline';
  previewCount?: number;
  expanded?: boolean;
  onExpandChange?: (expanded: boolean) => void;
}

interface ReplyTarget {
  id: string;
  name: string;
}

const DEFAULT_PREVIEW_COUNT = 2;

const countComments = (comments: Comment[]): number =>
  comments.reduce((total, comment) => total + 1 + countComments(comment.replies || []), 0);

const toMillis = (value: string) => {
  const parsed = new Date(value).getTime();
  return Number.isFinite(parsed) ? parsed : 0;
};

const extractRetryAfterSeconds = (error: unknown): number | null => {
  if (!error || typeof error !== 'object') return null;
  const candidate = (error as { details?: { retryAfterSeconds?: unknown } }).details?.retryAfterSeconds;
  const parsed = Number(candidate);
  if (!Number.isFinite(parsed) || parsed <= 0) return null;
  return Math.ceil(parsed);
};

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
export function CommentSection({
  challengeId,
  postId,
  mode = 'modal',
  previewCount = DEFAULT_PREVIEW_COUNT,
  expanded = true,
  onExpandChange,
}: CommentSectionProps) {
  const inlineMode = mode === 'inline';
  const isExpanded = inlineMode ? expanded : true;

  const { data: comments = [], isLoading } = useComments(challengeId, postId);
  const createMutation = useCreateComment(challengeId, postId);
  const deleteMutation = useDeleteComment(challengeId, postId);
  const updateMutation = useUpdateComment(challengeId, postId);
  const toggleLikeMutation = useToggleCommentLike(challengeId, postId);
  const { user } = useAuthStore();
  const { confirm } = useConfirmDialog();

  const [newComment, setNewComment] = useState('');
  const [replyTarget, setReplyTarget] = useState<ReplyTarget | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [cooldownUntilMs, setCooldownUntilMs] = useState<number | null>(null);
  const [nowMs, setNowMs] = useState(Date.now());

  const composerRef = useRef<HTMLFormElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const totalCount = useMemo(() => countComments(comments), [comments]);

  const visibleComments = useMemo(() => {
    if (!inlineMode || isExpanded) return comments;
    return [...comments]
      .sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt))
      .slice(0, Math.max(1, previewCount));
  }, [comments, inlineMode, isExpanded, previewCount]);

  useEffect(() => {
    if (!cooldownUntilMs) return;
    const timer = window.setInterval(() => {
      setNowMs(Date.now());
    }, 1000);
    return () => window.clearInterval(timer);
  }, [cooldownUntilMs]);

  useEffect(() => {
    if (!cooldownUntilMs) return;
    if (cooldownUntilMs <= Date.now()) {
      setCooldownUntilMs(null);
    }
  }, [cooldownUntilMs, nowMs]);

  const cooldownSeconds = cooldownUntilMs
    ? Math.max(0, Math.ceil((cooldownUntilMs - nowMs) / 1000))
    : 0;
  const isComposerLocked = cooldownSeconds > 0;

  const getErrorMessage = (error: unknown, fallback: string) =>
    error instanceof Error && error.message ? error.message : fallback;

  const handleCreateError = (error: unknown) => {
    const retryAfter = extractRetryAfterSeconds(error);
    if (retryAfter) {
      setCooldownUntilMs(Date.now() + retryAfter * 1000);
      toast.error(`요청이 많아 잠시 제한되었습니다. ${retryAfter}초 후 다시 시도해 주세요.`);
      return;
    }
    toast.error(getErrorMessage(error, '댓글 작성에 실패했습니다.'));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isComposerLocked) return;

    const trimmed = newComment.trim();
    if (!trimmed) return;

    try {
      await createMutation.mutateAsync({
        content: trimmed,
        parentId: replyTarget?.id,
      });
      setNewComment('');
      setReplyTarget(null);
    } catch (error) {
      handleCreateError(error);
    }
  };

  const handleDelete = async (commentId: string) => {
    const isConfirmed = await confirm({
      title: '댓글을 삭제하시겠습니까?',
      confirmText: '삭제',
      cancelText: '취소',
      variant: 'danger',
    });
    if (!isConfirmed) return;

    try {
      await deleteMutation.mutateAsync(commentId);
      toast.success('댓글을 삭제했습니다.');
    } catch (error) {
      toast.error(getErrorMessage(error, '댓글 삭제에 실패했습니다.'));
    }
  };

  const beginEdit = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditingContent(comment.content);
  };

  const handleSaveEdit = async () => {
    if (!editingCommentId) return;
    const trimmed = editingContent.trim();
    if (!trimmed) return;

    try {
      await updateMutation.mutateAsync({
        commentId: editingCommentId,
        data: { content: trimmed },
      });
      setEditingCommentId(null);
      setEditingContent('');
      toast.success('댓글을 수정했습니다.');
    } catch (error) {
      toast.error(getErrorMessage(error, '댓글 수정에 실패했습니다.'));
    }
  };

  const handleReply = (commentId: string, authorName: string) => {
    const isSameTarget = replyTarget?.id === commentId;
    const nextTarget = isSameTarget ? null : { id: commentId, name: authorName };
    setReplyTarget(nextTarget);

    if (!nextTarget) return;
    if (inlineMode && !isExpanded) {
      onExpandChange?.(true);
    }

    window.requestAnimationFrame(() => {
      composerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      inputRef.current?.focus();
    });
  };

  const handleToggleLike = async (commentId: string) => {
    if (!user || !capabilities.commentLike) return;
    try {
      await toggleLikeMutation.mutateAsync(commentId);
    } catch (error) {
      const retryAfter = extractRetryAfterSeconds(error);
      if (retryAfter) {
        toast.error(`요청이 많아 잠시 제한되었습니다. ${retryAfter}초 후 다시 시도해 주세요.`);
        return;
      }
      toast.error(getErrorMessage(error, '좋아요 처리에 실패했습니다.'));
    }
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>댓글을 불러오는 중...</div>
      </div>
    );
  }

  const CommentItem = ({ comment, depth = 0 }: { comment: Comment; depth?: number }) => {
    const authorName = comment.createdBy?.nickname || '익명';
    const isAuthor = user?.userId === comment.createdBy?.userId;
    const hasReplies = Boolean(comment.replies && comment.replies.length > 0);
    const isDeleted = Boolean(comment.isDeleted);
    const isEditing = editingCommentId === comment.id;

    return (
      <div className={styles.itemWrapper}>
        <div
          className={clsx(
            styles.item,
            depth > 0 && styles.replyItem,
            replyTarget?.id === comment.id && styles.replyTargetItem,
            isDeleted && styles.deletedItem,
          )}
          style={{ marginLeft: depth * 20 }}
        >
          {depth > 0 && <CornerDownRight className={styles.replyIcon} size={15} />}
          <div className={styles.itemAvatar}>{authorName.charAt(0) || '?'}</div>
          <div className={styles.itemBody}>
            <div className={styles.itemHeader}>
              <span className={styles.itemAuthor}>{authorName}</span>
              <span className={styles.itemTime}>{formatDistanceToNow(comment.createdAt)}</span>
            </div>

            {isEditing ? (
              <div className={styles.editRow}>
                <Input
                  value={editingContent}
                  onChange={(event) => setEditingContent(event.target.value)}
                  maxLength={500}
                  className={styles.editInput}
                />
                <button
                  type="button"
                  className={styles.inlineAction}
                  onClick={() => void handleSaveEdit()}
                  aria-label="댓글 수정 저장"
                >
                  <Check size={14} />
                </button>
                <button
                  type="button"
                  className={styles.inlineAction}
                  onClick={() => {
                    setEditingCommentId(null);
                    setEditingContent('');
                  }}
                  aria-label="댓글 수정 취소"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <p className={clsx(styles.itemContent, isDeleted && styles.deletedContent)}>{comment.content}</p>
            )}

            {!isEditing ? (
              <div className={styles.itemActions}>
                {user && capabilities.commentLike && !isDeleted ? (
                  <button
                    type="button"
                    className={clsx(styles.inlineTextButton, comment.isLiked && styles.activeLike)}
                    onClick={() => void handleToggleLike(comment.id)}
                  >
                    <Heart fill={comment.isLiked ? 'currentColor' : 'none'} size={13} />
                    <span>{comment.likeCount}</span>
                  </button>
                ) : null}

                {user && !isDeleted ? (
                  <button
                    type="button"
                    className={clsx(
                      styles.replyBtn,
                      replyTarget?.id === comment.id && styles.replyBtnActive,
                    )}
                    onClick={() => handleReply(comment.id, authorName)}
                  >
                    답글달기
                  </button>
                ) : null}

                {isAuthor && !isDeleted ? (
                  <>
                    <button
                      type="button"
                      className={styles.inlineTextButton}
                      onClick={() => beginEdit(comment)}
                    >
                      <PencilLine size={13} />
                      <span>수정</span>
                    </button>
                    <button
                      type="button"
                      className={styles.deleteBtn}
                      onClick={() => void handleDelete(comment.id)}
                      aria-label="댓글 삭제"
                    >
                      <Trash2 size={14} />
                    </button>
                  </>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>

        {hasReplies ? (
          <div className={styles.repliesList}>
            {comment.replies!.map((reply) => (
              <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
            ))}
          </div>
        ) : null}
      </div>
    );
  };

  const showExpandToggle = inlineMode && totalCount > previewCount;
  const canWriteComment = Boolean(user && (!inlineMode || isExpanded));

  return (
    <div className={clsx(styles.container, inlineMode && styles.inlineContainer)}>
      <div className={styles.titleRow}>
        <h3 className={styles.title}>
          댓글 <span className={styles.count}>{totalCount}</span>
        </h3>
        {showExpandToggle ? (
          <button
            type="button"
            className={styles.expandButton}
            onClick={() => onExpandChange?.(!isExpanded)}
          >
            {isExpanded ? '댓글 접기' : `댓글 ${totalCount}개 모두 보기`}
          </button>
        ) : null}
      </div>

      {canWriteComment ? (
        <form ref={composerRef} className={styles.inputArea} onSubmit={handleSubmit}>
          {replyTarget ? (
            <div className={styles.replyingTo}>
              <span><strong>{replyTarget.name}</strong>님에게 답글 작성 중</span>
              <button
                type="button"
                onClick={() => setReplyTarget(null)}
                className={styles.cancelReply}
              >
                <X size={14} />
              </button>
            </div>
          ) : null}

          {isComposerLocked ? (
            <div className={styles.cooldownBanner}>
              요청 제한 중입니다. {cooldownSeconds}초 후 다시 작성할 수 있습니다.
            </div>
          ) : null}

          <div className="flex gap-2 w-full items-start">
            <div className={styles.avatar}>{user?.name?.charAt(0) || '?'}</div>
            <div className="flex-1 flex flex-col gap-2">
              <input
                ref={inputRef}
                className={styles.input}
                placeholder={replyTarget ? `@${replyTarget.name}에게 답글 남기기...` : '댓글을 입력하세요...'}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                maxLength={500}
                disabled={isComposerLocked}
              />
            </div>
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              disabled={!newComment.trim() || createMutation.isPending || isComposerLocked}
            >
              <Send size={18} />
            </Button>
          </div>
        </form>
      ) : null}

      <div className={styles.list}>
        {visibleComments.length === 0 ? (
          <p className={styles.empty}>아직 댓글이 없습니다. 첫 댓글을 남겨보세요.</p>
        ) : (
          visibleComments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))
        )}
      </div>
    </div>
  );
}
