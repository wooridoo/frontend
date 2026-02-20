import { Modal } from '@/components/ui/Overlay/Modal';
import { usePostDetailModalStore } from '@/store/modal/useModalStore';
import { CommentSection } from '@/components/domain/Comment/CommentSection';
import { Heart, MessageCircle } from 'lucide-react';
import { useChallengeRoute } from '@/hooks/useChallengeRoute';
import { resolveChallengeId } from '@/lib/utils/challengeRoute';
import clsx from 'clsx';
import styles from './PostDetailModal.module.css';

export function PostDetailModal() {
    const { isOpen, post, onClose } = usePostDetailModalStore();
    const { challengeId: routeChallengeId } = useChallengeRoute();

    if (!post) return null;

    const challengeId = resolveChallengeId(post.challengeId) || routeChallengeId;
    if (!challengeId) return null;

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
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className={styles.container}>
                {/* Header */}
                <div className={styles.header}>
                    <img
                        src={post.createdBy.profileImage || '/images/avatar-fallback.svg'}
                        alt={post.createdBy.nickname}
                        className={styles.avatar}
                    />
                    <div>
                        <div className={styles.authorName}>
                            {post.createdBy.nickname}
                        </div>
                        <div className={styles.authorTime}>
                            {formatDate(post.createdAt)}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className={styles.content}>
                    <p className={styles.text}>
                        {post.content}
                    </p>
                </div>

                {/* Images */}
                {post.images && post.images.length > 0 && (
                    <div className={clsx(styles.images, styles[`grid${Math.min(post.images.length, 4)}`])}>
                        {post.images.map((url: string, index: number) => (
                            <img
                                key={index}
                                src={url}
                                alt={`첨부 이미지 ${index + 1}`}
                                className={styles.image}
                            />
                        ))}
                    </div>
                )}

                {/* Stats */}
                <div className={styles.stats}>
                    <span className={styles.statItem}>
                        <Heart size={14} /> {post.likeCount}
                    </span>
                    <span className={styles.statItem}>
                        <MessageCircle size={14} /> {post.commentCount}
                    </span>
                </div>

                {/* Comments */}
                <CommentSection challengeId={challengeId} postId={post.id} />
            </div>
        </Modal>
    );
}

