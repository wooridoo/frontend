import { useNavigate } from 'react-router-dom';
import {
  User,
  Settings,
  CreditCard,
  LogOut,
  ChevronRight,
  Target,
  Loader2
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '@/components/navigation/PageHeader/PageHeader';
import { PageContainer } from '@/components/layout/PageContainer/PageContainer';
import { Badge } from '@/components/ui';
import { PATHS } from '@/routes/paths';
import { getMyProfile } from '@/lib/api/user';
import { useAuthStore } from '@/store/useAuthStore';
import { Avatar } from '@/components/ui/Avatar';
import { useConfirmDialog } from '@/store/modal/useConfirmDialogStore';
import styles from './MyPage.module.css';

export function MyPage() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const { confirm } = useConfirmDialog();

  const { data: user, isLoading, error } = useQuery({
    queryKey: ['myProfile'],
    queryFn: getMyProfile,
    retry: 1,
  });

  const handleLogout = async () => {
    const isConfirmed = await confirm({
      title: '로그아웃 하시겠습니까?',
      confirmText: '로그아웃',
      cancelText: '취소',
    });

    if (!isConfirmed) return;
    logout();
    navigate(PATHS.HOME);
  };

  if (isLoading) {
    return (
      <PageContainer>
        <PageHeader title="마이페이지" />
        <div className={styles.stateContainer}>
          <Loader2 className="animate-spin" size={32} style={{ color: 'var(--color-grey-400)' }} />
        </div>
      </PageContainer>
    );
  }

  if (error || !user) {
    return (
      <PageContainer>
        <PageHeader title="마이페이지" />
        <div className={styles.stateContainer}>
          <div className={styles.stateText}>
            {error ? '로그인이 필요하거나 정보를 불러올 수 없습니다.' : '사용자 정보가 없습니다.'}
          </div>
          <button
            className={styles.loginButton}
            onClick={() => navigate(PATHS.AUTH.LOGIN)}
          >
            로그인 하러 가기
          </button>
        </div>
      </PageContainer>
    );
  }

  const menuItems = [
    {
      icon: <Target size={20} />,
      label: '나의 챌린지',
      path: PATHS.MY.CHALLENGES,
    },
    {
      icon: <CreditCard size={20} />,
      label: '나의 장부 (Wallet)',
      path: PATHS.MY.LEDGER,
    },
    {
      icon: <Settings size={20} />,
      label: '설정',
      path: PATHS.MY.SETTINGS,
    },
  ];

  return (
    <PageContainer>
      <PageHeader title="마이페이지" />

      <div className={styles.profileSection}>
        <Avatar
          src={user.profileImage}
          name={user.nickname}
          size="xl"
          className={styles.avatar}
        />
        <div className={styles.profileInfo}>
          <div className={styles.nickname}>
            {user.nickname} <Badge variant="default">Lv.{Math.floor(user.brix / 1000) + 1}</Badge>
          </div>
          <div className={styles.email}>{user.email}</div>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{user.participatingChallengeIds?.length || 0}</span>
          <span className={styles.statLabel}>참여중</span>
        </div>
        {/* 달성률 Mock 제거 */}
      </div>

      <div className={styles.menuSection}>
        <h3 className={styles.menuTitle}>내 활동</h3>
        <div className={styles.menuList}>
          {menuItems.map((item) => (
            <div
              key={item.label}
              className={styles.menuItem}
              onClick={() => navigate(item.path)}
            >
              <div className={styles.menuIcon}>{item.icon}</div>
              <span className={styles.menuText}>{item.label}</span>
              <ChevronRight size={18} className={styles.chevron} />
            </div>
          ))}
        </div>
      </div>

      <div className={styles.menuSection} style={{ marginTop: '24px' }}>
        <h3 className={styles.menuTitle}>계정</h3>
        <div className={styles.menuList}>
          <div className={styles.menuItem} onClick={() => navigate(PATHS.MY.LEDGER)}>
            <div className={styles.menuIcon}><User size={20} /></div>
            <span className={styles.menuText}>계정 관리</span>
            <ChevronRight size={18} className={styles.chevron} />
          </div>
          <div className={styles.menuItem} onClick={handleLogout}>
            <div className={styles.menuIcon}><LogOut size={20} /></div>
            <span className={`${styles.menuText} ${styles.dangerText}`}>
              로그아웃
            </span>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
