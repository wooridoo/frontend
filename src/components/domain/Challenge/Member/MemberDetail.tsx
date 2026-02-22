import { useParams, useNavigate } from 'react-router-dom';
import { Crown, Calendar, Wallet, TrendingUp, Users } from 'lucide-react';
import { useMember, useDelegateLeader } from '@/hooks/useMember';
import { useAuthStore } from '@/store/useAuthStore';
import { Skeleton } from '@/components/feedback';
import { ChallengeRole } from '@/types/enums';
import { useChallengeRoute } from '@/hooks/useChallengeRoute';
import { useConfirmDialog } from '@/store/modal/useConfirmDialogStore';
import { toast } from 'sonner';
import { Button } from '@/components/ui';
import styles from './MemberDetail.module.css';

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
export function MemberDetail() {
    const { memberId } = useParams<{ memberId: string }>();
    const { challengeId } = useChallengeRoute();
    const navigate = useNavigate();
    const { user: currentUser } = useAuthStore();
    const { confirm } = useConfirmDialog();

    const { data: member, isLoading } = useMember(challengeId, memberId);
    const delegateMutation = useDelegateLeader(challengeId!);

    if (isLoading) {
        return (
            <div className={styles.container}>
                <div className={styles.skeleton}>
                    <Skeleton height={200} />
                    <Skeleton height={150} />
                    <Skeleton height={100} />
                </div>
            </div>
        );
    }

    if (!member) {
        return (
            <div className={styles.container}>
                <div className={styles.skeleton}>멤버를 찾을 수 없습니다.</div>
            </div>
        );
    }

    const { user, role, stats, supportHistory } = member;

    // 보조 처리
    const isCurrentUserLeader = currentUser?.participatingChallengeIds?.includes(challengeId);
    const canDelegate = isCurrentUserLeader && role !== ChallengeRole.LEADER;

    const handleDelegate = async () => {
        const isConfirmed = await confirm({
            title: `${user.nickname}님에게 리더 권한을 위임하시겠습니까?`,
            confirmText: '위임하기',
            cancelText: '취소',
        });

        if (!isConfirmed) {
            return;
        }

        try {
            await delegateMutation.mutateAsync(member.user.userId);
            toast.success('리더 권한이 위임되었습니다.');
            navigate(-1);
        } catch {
            toast.error('위임에 실패했습니다.');
        }
    };

    const formatAmount = (amount: number) => {
        return new Intl.NumberFormat('ko-KR').format(amount) + '원';
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
    };

    return (
        <div className={styles.container}>
            {/* 보조 설명 */}
            <div className={styles.profile}>
                <div className={styles.avatarWrapper}>
                    <img
                        src={user.profileImage || '/images/avatar-fallback.svg'}
                        alt={user.nickname}
                        className={styles.avatar}
                    />
                    {role === ChallengeRole.LEADER && (
                        <span className={styles.leaderBadge}>
                            <Crown />
                        </span>
                    )}
                </div>
                <span className={styles.nickname}>{user.nickname}</span>
                {user.brix !== undefined && (
                    <span className={styles.brix}>브릭스 {user.brix.toFixed(1)}</span>
                )}
                <span className={styles.memberSince}>
                    {formatDate(member.joinedAt)} 가입
                </span>
            </div>

            {/* 보조 설명 */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <span className={styles.statLabel}>
                        <Wallet /> 총 서포트
                    </span>
                    <span className={styles.statValue}>
                        {formatAmount(stats.totalSupport)}
                    </span>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statLabel}>
                        <TrendingUp /> 서포트율
                    </span>
                    <span className={styles.statValue}>
                        {stats.supportRate}<span className={styles.statUnit}>%</span>
                    </span>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statLabel}>
                        <Calendar /> 참석률
                    </span>
                    <span className={styles.statValue}>
                        {stats.attendanceRate}<span className={styles.statUnit}>%</span>
                    </span>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statLabel}>
                        <Users /> 모임 참석
                    </span>
                    <span className={styles.statValue}>
                        {stats.meetingsAttended}
                        <span className={styles.statUnit}>/{stats.meetingsTotal}</span>
                    </span>
                </div>
            </div>

            {/* 보조 설명 */}
            <div className={styles.section}>
                <h3 className={styles.sectionTitle}>서포트 이력</h3>
                <div className={styles.historyList}>
                    {supportHistory.map((record) => (
                        <div key={record.month} className={styles.historyItem}>
                            <span className={styles.historyMonth}>{record.month}</span>
                            <span className={styles.historyAmount}>
                                {formatAmount(record.amount)}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* 보조 설명 */}
            {canDelegate && (
                <div className={styles.actions}>
                    <Button
                        className={styles.delegateButton}
                        onClick={handleDelegate}
                        disabled={delegateMutation.isPending}
                        fullWidth
                    >
                        {delegateMutation.isPending ? '처리 중...' : '리더 위임하기'}
                    </Button>
                </div>
            )}
        </div>
    );
}
