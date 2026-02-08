import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui';
import { getChallenges, type ChallengeInfo } from '@/lib/api/challenge';
import { useCreateChallengeModalStore } from '@/store/useCreateChallengeModalStore';
import { ChallengeStatus } from '@/types/enums';
import { PATHS } from '@/routes/paths';
import styles from './MyChallengesPage.module.css';

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

const CATEGORY_LABELS: Record<string, string> = {
    HOBBY: '취미',
    STUDY: '학습',
    EXERCISE: '운동',
    SAVINGS: '저축',
    TRAVEL: '여행',
    FOOD: '음식',
    CULTURE: '문화',
    OTHER: '기타',
};

export function MyChallengesPage() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<TabType>('all');
    const { onOpen: openCreateModal } = useCreateChallengeModalStore();

    const { data: challenges = [], isLoading } = useQuery({
        queryKey: ['challenges', 'me'],
        queryFn: () => getChallenges(), // Will be replaced with getMyChallenges API
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
        navigate(PATHS.CHALLENGE.DETAIL(challenge.challengeId));
    };

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <h1 className={styles.title}>내 챌린지</h1>
                <Button className={styles.createButton} onClick={openCreateModal}>
                    + 새 챌린지
                </Button>
            </div>

            {/* Tabs */}
            <div className={styles.tabs}>
                {TAB_OPTIONS.map((tab) => (
                    <button
                        key={tab.value}
                        className={`${styles.tab} ${activeTab === tab.value ? styles.active : ''}`}
                        onClick={() => setActiveTab(tab.value)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            {isLoading ? (
                <div className={styles.loading}>로딩 중...</div>
            ) : filteredChallenges.length === 0 ? (
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>🏆</div>
                    <div className={styles.emptyTitle}>
                        {activeTab === 'all' ? '참여 중인 챌린지가 없습니다' : `${TAB_OPTIONS.find(t => t.value === activeTab)?.label} 챌린지가 없습니다`}
                    </div>
                    <p className={styles.emptyDescription}>
                        새로운 챌린지에 참여하거나 직접 만들어보세요!
                    </p>
                    <Button onClick={openCreateModal}>챌린지 만들기</Button>
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
                                src={challenge.thumbnailUrl || `https://picsum.photos/seed/${challenge.challengeId}/400/200`}
                                alt={challenge.title}
                                className={styles.cardImage}
                            />
                            <div className={styles.cardContent}>
                                <div className={styles.cardCategory}>
                                    {CATEGORY_LABELS[challenge.category] || challenge.category}
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
        </div>
    );
}
