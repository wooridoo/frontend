import { Modal } from '@/components/ui/Overlay/Modal';
import { usePostDetailModalStore } from '@/store/modal/useModalStore';
import { CommentSection } from '@/components/domain/Comment/CommentSection';

export function PostDetailModal() {
    const { isOpen, post, onClose } = usePostDetailModalStore();

    if (!post) return null;

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="post-detail-modal">
            <div style={{ padding: 'var(--spacing-lg)' }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)' }}>
                    <img
                        src={post.createdBy.profileImage || `https://ui-avatars.com/api/?name=${post.createdBy.nickname}&background=random`}
                        alt={post.createdBy.nickname}
                        style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                        <div style={{ fontWeight: 600, fontSize: 'var(--font-size-md)' }}>
                            {post.createdBy.nickname}
                        </div>
                        <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-tertiary)' }}>
                            {formatDate(post.createdAt)}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                    <p style={{ fontSize: 'var(--font-size-md)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                        {post.content}
                    </p>
                </div>

                {/* Images */}
                {post.images && post.images.length > 0 && (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: post.images.length === 1 ? '1fr' : 'repeat(2, 1fr)',
                        gap: 'var(--spacing-sm)',
                        marginBottom: 'var(--spacing-lg)',
                    }}>
                        {post.images.map((url: string, index: number) => (
                            <img
                                key={index}
                                src={url}
                                alt={`Post image ${index + 1}`}
                                style={{
                                    width: '100%',
                                    borderRadius: 'var(--radius-md)',
                                    objectFit: 'cover',
                                    maxHeight: 300,
                                }}
                            />
                        ))}
                    </div>
                )}

                {/* Stats */}
                <div style={{
                    display: 'flex',
                    gap: 'var(--spacing-lg)',
                    paddingTop: 'var(--spacing-md)',
                    borderTop: '1px solid var(--color-border)',
                    color: 'var(--color-text-secondary)',
                    fontSize: 'var(--font-size-sm)',
                }}>
                    <span>❤️ {post.likeCount}</span>
                    <span>💬 {post.commentCount}</span>
                </div>

                {/* Comments */}
                <CommentSection postId={post.id} />
            </div>
        </Modal>
    );
}

