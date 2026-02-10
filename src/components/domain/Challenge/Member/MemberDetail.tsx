import { useParams, useNavigate } from 'react-router-dom';
import { Crown, Calendar, Wallet, TrendingUp, Users } from 'lucide-react';
import { useMember, useDelegateLeader } from '@/hooks/useMember';
import { useAuthStore } from '@/store/useAuthStore';
import { Skeleton } from '@/components/feedback';
import { ChallengeRole } from '@/types/enums';
import styles from './MemberDetail.module.css';

export function MemberDetail() {
    const { id: challengeId, memberId } = useParams<{ id: string; memberId: string }>();
    const navigate = useNavigate();
    const { user: currentUser } = useAuthStore();

    const { data: member, isLoading } = useMember(challengeId, Number(memberId));
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

    // Check if current user is leader (can delegate)
    const isCurrentUserLeader = currentUser?.participatingChallengeIds?.includes(challengeId!);
    const canDelegate = isCurrentUserLeader && role !== ChallengeRole.LEADER;

    const handleDelegate = async () => {
        if (!window.confirm(`${user.nickname}님에게 리더 권한을 위임하시겠습니까?`)) {
            return;
        }

        try {
            await delegateMutation.mutateAsync(member.memberId);
            alert('리더 권한이 위임되었습니다.');
            navigate(-1);
        } catch {
            alert('위임에 실패했습니다.');
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
            {/* Profile Section */}
            <div className={styles.profile}>
                <div className={styles.avatarWrapper}>
                    <img
                        src={user.profileImage || `https://i.pravatar.cc/150?u=${user.userId}`}
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
                    <span className={styles.brix}>Brix {user.brix.toFixed(1)}</span>
                )}
                <span className={styles.memberSince}>
                    {formatDate(member.joinedAt)} 가입
                </span>
            </div>

            {/* Stats Grid */}
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

            {/* Support History */}
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

            {/* Actions (Leader Only) */}
            {canDelegate && (
                <div className={styles.actions}>
                    <button
                        className={styles.delegateButton}
                        onClick={handleDelegate}
                        disabled={delegateMutation.isPending}
                    >
                        {delegateMutation.isPending ? '처리 중...' : '리더 위임하기'}
                    </button>
                </div>
            )}
        </div>
    );
}
