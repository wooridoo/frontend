import { useState } from 'react';
import clsx from 'clsx';
import { useComments, useCreateComment, useDeleteComment } from '@/hooks/useComment';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui';
import { Send, Trash2, X, CornerDownRight } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from '@/lib/utils';
import type { Comment } from '@/types/comment';
import styles from './CommentSection.module.css';

interface CommentSectionProps {
  postId: string;
}

interface ReplyTarget {
  id: string;
  name: string;
}

export function CommentSection({ postId }: CommentSectionProps) {
  const { data: comments = [], isLoading } = useComments(postId);
  const createMutation = useCreateComment(postId);
  const deleteMutation = useDeleteComment(postId);
  const { user } = useAuthStore();

  const [newComment, setNewComment] = useState('');
  const [replyTarget, setReplyTarget] = useState<ReplyTarget | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newComment.trim();
    if (!trimmed) return;

    try {
      await createMutation.mutateAsync({
        content: trimmed,
        parentId: replyTarget?.id
      });
      setNewComment('');
      setReplyTarget(null);
    } catch {
      toast.error('댓글 작성에 실패했습니다.');
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!window.confirm('댓글을 삭제하시겠습니까?')) return;
    try {
      await deleteMutation.mutateAsync(commentId);
      toast.success('댓글이 삭제되었습니다.');
    } catch {
      toast.error('댓글 삭제에 실패했습니다.');
    }
  };

  const handleReply = (commentId: string, authorName: string) => {
    setReplyTarget({ id: commentId, name: authorName });
    // Focus input? (optional, straightforward if ref used)
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>댓글을 불러오는 중...</div>
      </div>
    );
  }

  const CommentItem = ({ comment, depth = 0 }: { comment: Comment; depth?: number }) => {
    const isAuthor = user?.userId === comment.createdBy?.userId;
    const hasReplies = comment.replies && comment.replies.length > 0;

    return (
      <div className={styles.itemWrapper}>
        <div className={clsx(styles.item, depth > 0 && styles.replyItem)} style={{ marginLeft: depth * 24 }}>
          {depth > 0 && <CornerDownRight className={styles.replyIcon} size={16} />}
          <div className={styles.itemAvatar}>
            {comment.createdBy?.name?.charAt(0) || '?'}
          </div>
          <div className={styles.itemBody}>
            <div className={styles.itemHeader}>
              <span className={styles.itemAuthor}>
                {comment.createdBy?.name || '익명'}
              </span>
              <span className={styles.itemTime}>
                {formatDistanceToNow(comment.createdAt)}
              </span>
            </div>
            <p className={styles.itemContent}>{comment.content}</p>

            <div className={styles.itemActions}>
              {user && (
                <button
                  className={styles.replyBtn}
                  onClick={() => handleReply(comment.id, comment.createdBy?.name || '익명')}
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

      {/* Comment Input */}
      {user && (
        <form className={styles.inputArea} onSubmit={handleSubmit}>
          {replyTarget && (
            <div className={styles.replyingTo}>
              <span>Replying to <strong>{replyTarget.name}</strong></span>
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
                placeholder={replyTarget ? `@${replyTarget.name}님에게 답글 남기기...` : "댓글을 입력하세요..."}
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

      {/* Comment List */}
      <div className={styles.list}>
        {comments.length === 0 ? (
          <p className={styles.empty}>아직 댓글이 없습니다. 첫 댓글을 달아보세요!</p>
        ) : (
          comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))
        )}
      </div>
    </div>
  );
}
