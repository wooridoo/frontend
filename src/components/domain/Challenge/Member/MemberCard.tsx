import { Crown, Calendar, Wallet } from 'lucide-react';
import clsx from 'clsx';
import { ChallengeRole } from '@/types/enums';
import type { Member } from '@/types/member';
import styles from './MemberCard.module.css';

interface MemberCardProps {
    member: Member;
    onClick?: () => void;
}

export function MemberCard({ member, onClick }: MemberCardProps) {
    const { user, role, status, supportStatus, attendanceRate } = member;

    const statusLabels: Record<string, string> = {
        ACTIVE: '활동중',
        OVERDUE: '미납',
        GRACE_PERIOD: '유예기간',
    };

    const statusStyles: Record<string, string> = {
        ACTIVE: styles.statusActive,
        OVERDUE: styles.statusOverdue,
        GRACE_PERIOD: styles.statusGrace,
    };

    return (
        <div className={styles.card} onClick={onClick}>
            {/* Avatar */}
            <div className={styles.avatar}>
                <img
                    src={user.profileImage || `https://i.pravatar.cc/150?u=${user.userId}`}
                    alt={user.nickname}
                    className={styles.avatarImage}
                />
                {role === ChallengeRole.LEADER && (
                    <span className={styles.leaderBadge}>
                        <Crown />
                    </span>
                )}
            </div>

            {/* Info */}
            <div className={styles.info}>
                <div className={styles.nameRow}>
                    <span className={styles.name}>{user.nickname}</span>
                    {user.brix !== undefined && (
                        <span className={styles.brix}>Brix {user.brix.toFixed(1)}</span>
                    )}
                </div>
                <div className={styles.stats}>
                    <span className={styles.stat}>
                        <Calendar />
                        참석률 {attendanceRate}%
                    </span>
                    <span
                        className={clsx(
                            styles.stat,
                            supportStatus.thisMonth === 'PAID'
                                ? styles.supportPaid
                                : styles.supportUnpaid
                        )}
                    >
                        <Wallet />
                        {supportStatus.thisMonth === 'PAID' ? '납입완료' : '미납'}
                    </span>
                </div>
            </div>

            {/* Status Badge */}
            <span className={clsx(styles.status, statusStyles[status])}>
                {statusLabels[status]}
            </span>
        </div>
    );
}
