import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { Button, SemanticIcon } from '@/components/ui';
import { PageContainer } from '@/components/layout/PageContainer/PageContainer';
import { PageHeader } from '@/components/navigation/PageHeader/PageHeader';
import { getMyChallenges, type ChallengeInfo } from '@/lib/api/challenge';
import { getCategoryLabel } from '@/lib/utils/categoryLabels';
import { ChallengeStatus } from '@/types/enums';
import { CHALLENGE_ROUTES } from '@/routes/challengePaths';
import styles from './MyChallengesPage.module.css';

const CHALLENGE_FALLBACK_IMAGE = '/images/challenge-fallback.svg';

type TabType = 'all' | 'inProgress' | 'recruiting' | 'completed';

const TAB_OPTIONS: { value: TabType; label: string }[] = [
    { value: 'all', label: '전체' },
    { value: 'inProgress', label: '진행 중' },
    { value: 'recruiting', label: '모집 중' },
    { value: 'completed', label: '완료' },
];

const STATUS_MAP: Record<TabType, ChallengeStatus | null> = {
    all: null,
    inProgress: ChallengeStatus.IN_PROGRESS,
    recruiting: ChallengeStatus.RECRUITING,
    completed: ChallengeStatus.COMPLETED,
};



export function MyChallengesPage() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<TabType>('all');

    const { data: challenges = [], isLoading } = useQuery({
        queryKey: ['challenges', 'me'],
        queryFn: () => getMyChallenges(),
    });

    const filteredChallenges = challenges.filter((challenge) => {
        if (activeTab === 'all') return true;
        return challenge.status === STATUS_MAP[activeTab];
    });

    const getStatusClass = (status: ChallengeStatus) => {
        switch (status) {
            case ChallengeStatus.RECRUITING:
                return styles.recruiting;
            case ChallengeStatus.IN_PROGRESS:
                return styles.inProgress;
            case ChallengeStatus.COMPLETED:
                return styles.completed;
            default:
                return '';
        }
    };

    const getStatusLabel = (status: ChallengeStatus) => {
        switch (status) {
            case ChallengeStatus.RECRUITING:
                return '모집 중';
            case ChallengeStatus.IN_PROGRESS:
                return '진행 중';
            case ChallengeStatus.COMPLETED:
                return '완료';
            default:
                return status;
        }
    };

    const handleChallengeClick = (challenge: ChallengeInfo) => {
        navigate(CHALLENGE_ROUTES.detail(challenge.challengeId, challenge.title));
    };

    return (
        <PageContainer variant="content" contentWidth="lg">
            <PageHeader
                title="내 챌린지"
                showBack
                action={
                    <Button
                        className={styles.createButton}
                        leadingIcon={<Plus size={14} />}
                        onClick={() => navigate(CHALLENGE_ROUTES.NEW)}
                    >
                        새 챌린지
                    </Button>
                }
            />

            {/* Tabs */}
            <div className={styles.tabs}>
                {TAB_OPTIONS.map((tab) => (
                    <Button
                        key={tab.value}
                        className={`${styles.tab} ${activeTab === tab.value ? styles.active : ''}`}
                        onClick={() => setActiveTab(tab.value)}
                        shape="pill"
                        size="sm"
                        variant={activeTab === tab.value ? 'primary' : 'ghost'}
                    >
                        {tab.label}
                    </Button>
                ))}
            </div>

            {/* Content */}
            {isLoading ? (
                <div className={styles.loading}>로딩 중...</div>
            ) : filteredChallenges.length === 0 ? (
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>
                        <SemanticIcon animated={false} name="success" size={24} />
                    </div>
                    <div className={styles.emptyTitle}>
                        {activeTab === 'all' ? '참여 중인 챌린지가 없습니다' : `${TAB_OPTIONS.find(t => t.value === activeTab)?.label} 챌린지가 없습니다`}
                    </div>
                    <p className={styles.emptyDescription}>
                        새로운 챌린지에 참여하거나 직접 만들어보세요!
                    </p>
                    <Button onClick={() => navigate(CHALLENGE_ROUTES.NEW)}>챌린지 만들기</Button>
                </div>
            ) : (
                <div className={styles.challengeGrid}>
                    {filteredChallenges.map((challenge) => (
                        <div
                            key={challenge.challengeId}
                            className={styles.challengeCard}
                            onClick={() => handleChallengeClick(challenge)}
                        >
                            <img
                                src={challenge.thumbnailUrl || CHALLENGE_FALLBACK_IMAGE}
                                alt={challenge.title}
                                className={styles.cardImage}
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = CHALLENGE_FALLBACK_IMAGE;
                                }}
                            />
                            <div className={styles.cardContent}>
                                <div className={styles.cardCategory}>
                                    {getCategoryLabel(challenge.category)}
                                </div>
                                <h3 className={styles.cardTitle}>{challenge.title}</h3>
                                <div className={styles.cardMeta}>
                                    <span>{challenge.memberCount.current}/{challenge.memberCount.max}명</span>
                                    <span className={`${styles.cardStatus} ${getStatusClass(challenge.status)}`}>
                                        {getStatusLabel(challenge.status)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </PageContainer>
    );
}
