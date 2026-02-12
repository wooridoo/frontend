import { useState } from 'react';
import { useComments, useCreateComment, useDeleteComment } from '@/hooks/useComment';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui';
import { Send, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from '@/lib/utils';
import styles from './CommentSection.module.css';

interface CommentSectionProps {
  postId: string;
}

export function CommentSection({ postId }: CommentSectionProps) {
  const { data: comments = [], isLoading } = useComments(postId);
  const createMutation = useCreateComment(postId);
  const deleteMutation = useDeleteComment(postId);
  const { user } = useAuthStore();
  const [newComment, setNewComment] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newComment.trim();
    if (!trimmed) return;

    try {
      await createMutation.mutateAsync({ content: trimmed });
      setNewComment('');
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

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>댓글을 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>
        댓글 <span className={styles.count}>{comments.length}</span>
      </h3>

      {/* Comment Input */}
      {user && (
        <form className={styles.inputArea} onSubmit={handleSubmit}>
          <div className={styles.avatar}>
            {user.name?.charAt(0) || '?'}
          </div>
          <input
            className={styles.input}
            placeholder="댓글을 입력하세요..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            maxLength={500}
          />
          <Button
            type="submit"
            variant="ghost"
            size="sm"
            disabled={!newComment.trim() || createMutation.isPending}
          >
            <Send size={18} />
          </Button>
        </form>
      )}

      {/* Comment List */}
      <div className={styles.list}>
        {comments.length === 0 ? (
          <p className={styles.empty}>아직 댓글이 없습니다. 첫 댓글을 달아보세요!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className={styles.item}>
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
              </div>
              {user?.userId === comment.createdBy?.userId && (
                <button
                  className={styles.deleteBtn}
                  onClick={() => handleDelete(comment.id)}
                  aria-label="댓글 삭제"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
