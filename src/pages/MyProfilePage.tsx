import { useNavigate } from 'react-router-dom';
import { useMyProfile } from '@/hooks/useUser';
import { Button } from '@/components/ui';
import { PageContainer } from '@/components/layout/PageContainer/PageContainer';
import { PageHeader } from '@/components/navigation/PageHeader/PageHeader';
import { formatCurrency } from '@/lib/utils';
import { PATHS } from '@/routes/paths';
import styles from './MyProfilePage.module.css';

export function MyProfilePage() {
    const navigate = useNavigate();
    const { data: user, isLoading, error } = useMyProfile();

    if (isLoading) {
        return (
            <PageContainer>
                <PageHeader title="프로필" showBack />
                <div className={styles.loading}>
                    <div>로딩 중...</div>
                </div>
            </PageContainer>
        );
    }

    if (error || !user) {
        return (
            <PageContainer>
                <PageHeader title="프로필" showBack />
                <div className={styles.error}>
                    <div>프로필을 불러올 수 없습니다.</div>
                    <Button onClick={() => window.location.reload()}>다시 시도</Button>
                </div>
            </PageContainer>
        );
    }

    // Use user.account as the display account
    const displayAccount = user.account;

    return (
        <PageContainer>
            <PageHeader title="프로필" showBack />
            {/* Header */}
            <div className={styles.header}>
                <img
                    src={user.profileImage || `https://ui-avatars.com/api/?name=${user.nickname}&background=random`}
                    alt={user.nickname}
                    className={styles.avatar}
                />
                <div className={styles.userInfo}>
                    <h1 className={styles.nickname}>{user.nickname}</h1>
                    <p className={styles.email}>{user.email}</p>
                    <div className={styles.brixBadge}>
                        🍊 Brix {user.brix?.toFixed(1) || '0.0'}
                    </div>
                </div>
                <Button className={styles.editButton} variant="secondary">
                    프로필 수정
                </Button>
            </div>

            {/* Stats */}
            <div className={styles.statsSection}>
                <div className={styles.statCard}>
                    <div className={styles.statValue}>{user.stats?.challengeCount || 0}</div>
                    <div className={styles.statLabel}>참여 챌린지</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statValue}>{user.stats?.completedChallenges || 0}</div>
                    <div className={styles.statLabel}>완료한 챌린지</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statValue}>
                        {formatCurrency(user.stats?.totalSupportAmount || 0)}
                    </div>
                    <div className={styles.statLabel}>총 서포트 금액</div>
                </div>
            </div>

            {/* Account */}
            {displayAccount && (
                <div className={styles.accountSection}>
                    <h2 className={styles.sectionTitle}>💰 내 지갑</h2>
                    <div className={styles.balanceRow}>
                        <span className={styles.balanceLabel}>사용 가능</span>
                        <span className={`${styles.balanceValue} ${styles.total}`}>
                            {formatCurrency(displayAccount.availableBalance)}
                        </span>
                    </div>
                    <div className={styles.balanceRow}>
                        <span className={styles.balanceLabel}>잠긴 금액 (보증금)</span>
                        <span className={styles.balanceValue}>
                            {formatCurrency(displayAccount.lockedBalance)}
                        </span>
                    </div>
                    <div className={styles.balanceRow}>
                        <span className={styles.balanceLabel}>총 잔액</span>
                        <span className={styles.balanceValue}>
                            {formatCurrency(displayAccount.balance)}
                        </span>
                    </div>
                    <div className={styles.accountActions}>
                        <Button onClick={() => navigate(PATHS.MY.ACCOUNT)}>충전하기</Button>
                        <Button variant="secondary">거래 내역</Button>
                    </div>
                </div>
            )}

            {/* Menu */}
            <div className={styles.menuSection}>
                <div className={styles.menuItem} onClick={() => navigate(PATHS.MY.CHALLENGES)}>
                    <span>🏆 내 챌린지</span>
                    <span className={styles.menuArrow}>›</span>
                </div>
                <div className={styles.menuItem} onClick={() => navigate(PATHS.MY.LEDGER)}>
                    <span>📊 장부 관리</span>
                    <span className={styles.menuArrow}>›</span>
                </div>
                <div className={styles.menuItem} onClick={() => navigate(PATHS.MY.SETTINGS)}>
                    <span>⚙️ 설정</span>
                    <span className={styles.menuArrow}>›</span>
                </div>
                <div className={`${styles.menuItem} ${styles.danger}`}>
                    <span>회원 탈퇴</span>
                    <span className={styles.menuArrow}>›</span>
                </div>
            </div>
        </PageContainer>
    );
}
