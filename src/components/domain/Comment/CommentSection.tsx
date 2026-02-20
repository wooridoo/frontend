import { useState } from 'react';
import clsx from 'clsx';
import { useComments, useCreateComment, useDeleteComment } from '@/hooks/useComment';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui';
import { Send, Trash2, X, CornerDownRight } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from '@/lib/utils';
import type { Comment } from '@/types/comment';
import { useConfirmDialog } from '@/store/modal/useConfirmDialogStore';
import styles from './CommentSection.module.css';

interface CommentSectionProps {
  challengeId: string;
  postId: string;
}

interface ReplyTarget {
  id: string;
  name: string;
}

export function CommentSection({ challengeId, postId }: CommentSectionProps) {
  const { data: comments = [], isLoading } = useComments(challengeId, postId);
  const createMutation = useCreateComment(challengeId, postId);
  const deleteMutation = useDeleteComment(challengeId, postId);
  const { user } = useAuthStore();
  const { confirm } = useConfirmDialog();

  const [newComment, setNewComment] = useState('');
  const [replyTarget, setReplyTarget] = useState<ReplyTarget | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newComment.trim();
    if (!trimmed) return;

    try {
      await createMutation.mutateAsync({
        content: trimmed,
        parentId: replyTarget?.id,
      });
      setNewComment('');
      setReplyTarget(null);
    } catch {
      toast.error('댓글 작성에 실패했습니다.');
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
    } catch {
      toast.error('댓글 삭제에 실패했습니다.');
    }
  };

  const handleReply = (commentId: string, authorName: string) => {
    setReplyTarget({ id: commentId, name: authorName });
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
    const hasReplies = comment.replies && comment.replies.length > 0;

    return (
      <div className={styles.itemWrapper}>
        <div className={clsx(styles.item, depth > 0 && styles.replyItem)} style={{ marginLeft: depth * 24 }}>
          {depth > 0 && <CornerDownRight className={styles.replyIcon} size={16} />}
          <div className={styles.itemAvatar}>
            {authorName.charAt(0) || '?'}
          </div>
          <div className={styles.itemBody}>
            <div className={styles.itemHeader}>
              <span className={styles.itemAuthor}>{authorName}</span>
              <span className={styles.itemTime}>
                {formatDistanceToNow(comment.createdAt)}
              </span>
            </div>
            <p className={styles.itemContent}>{comment.content}</p>

            <div className={styles.itemActions}>
              {user && (
                <button
                  className={styles.replyBtn}
                  onClick={() => handleReply(comment.id, authorName)}
                >
                  답글달기
                </button>
              )}
              {isAuthor && (
                <button
                  className={styles.deleteBtn}
                  onClick={() => handleDelete(comment.id)}
                  aria-label="댓글 삭제"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
        {hasReplies && (
          <div className={styles.repliesList}>
            {comment.replies!.map(reply => (
              <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>
        댓글 <span className={styles.count}>{comments.length}</span>
      </h3>

      {user && (
        <form className={styles.inputArea} onSubmit={handleSubmit}>
          {replyTarget && (
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
          )}
          <div className="flex gap-2 w-full items-start">
            <div className={styles.avatar}>
              {user.name?.charAt(0) || '?'}
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <input
                className={styles.input}
                placeholder={replyTarget ? `@${replyTarget.name}에게 답글 남기기...` : '댓글을 입력하세요...'}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                maxLength={500}
              />
            </div>
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              disabled={!newComment.trim() || createMutation.isPending}
            >
              <Send size={18} />
            </Button>
          </div>
        </form>
      )}

      <div className={styles.list}>
        {comments.length === 0 ? (
          <p className={styles.empty}>아직 댓글이 없습니다. 첫 댓글을 남겨보세요.</p>
        ) : (
          comments.map(comment => (
            <CommentItem key={comment.id} comment={comment} />
          ))
        )}
      </div>
    </div>
  );
}
