import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { useMembers } from '@/hooks/useMember';
import { MemberCard } from './MemberCard';
import { Skeleton } from '@/components/feedback';
import { Button } from '@/components/ui';
import type { MemberStatus } from '@/types/member';
import { CHALLENGE_ROUTES } from '@/routes/challengePaths';
import { useChallengeRoute } from '@/hooks/useChallengeRoute';
import styles from './MemberList.module.css';

type FilterTab = 'ALL' | MemberStatus;

const TABS: { value: FilterTab; label: string }[] = [
    { value: 'ALL', label: '전체' },
    { value: 'ACTIVE', label: '활동중' },
    { value: 'OVERDUE', label: '미납' },
    { value: 'GRACE_PERIOD', label: '유예' },
];

export function MemberList() {
    const { challengeId, challengeRef } = useChallengeRoute();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<FilterTab>('ALL');

    const statusFilter = activeTab === 'ALL' ? undefined : activeTab;
    const { data, isLoading } = useMembers(challengeId, statusFilter);

    if (isLoading) {
        return (
            <div className={styles.container}>
                <div className={styles.skeleton}>
                    <Skeleton height={60} />
                    <Skeleton height={80} />
                    <Skeleton height={80} />
                    <Skeleton height={80} />
                </div>
            </div>
        );
    }

    const handleMemberClick = (memberId: string) => {
        navigate(CHALLENGE_ROUTES.memberDetail(challengeRef || challengeId, memberId));
    };

    return (
        <div className={styles.container}>
            {/* Header with Summary */}
            <div className={styles.header}>
                <h2 className={styles.title}>멤버</h2>
                {data?.summary && (
                    <div className={styles.summary}>
                        <span className={styles.summaryItem}>
                            <span className={styles.summaryCount}>{data.summary.total}</span>명
                        </span>
                        <span className={clsx(styles.summaryItem, styles.statusActive)}>
                            활동 {data.summary.active}
                        </span>
                        {data.summary.overdue > 0 && (
                            <span className={clsx(styles.summaryItem, styles.statusOverdue)}>
                                미납 {data.summary.overdue}
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Filter Tabs */}
            <div className={styles.tabs}>
                {TABS.map(tab => (
                    <Button
                        key={tab.value}
                        className={clsx(styles.tab, activeTab === tab.value && styles.tabActive)}
                        onClick={() => setActiveTab(tab.value)}
                        shape="rounded"
                        size="sm"
                        variant={activeTab === tab.value ? 'secondary' : 'ghost'}
                    >
                        {tab.label}
                    </Button>
                ))}
            </div>

            {/* Member List */}
            <div className={styles.memberList}>
                {data?.members && data.members.length > 0 ? (
                    data.members.map(member => (
                        <MemberCard
                            key={member.memberId}
                            member={member}
                            onClick={() => handleMemberClick(member.memberId)}
                        />
                    ))
                ) : (
                    <div className={styles.emptyState}>
                        조건에 맞는 멤버가 없습니다.
                    </div>
                )}
            </div>
        </div>
    );
}
