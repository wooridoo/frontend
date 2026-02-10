import { useNavigate } from 'react-router-dom';
import {
  User,
  Settings,
  CreditCard,
  LogOut,
  ChevronRight,
  Target
} from 'lucide-react';
import { PageHeader } from '@/components/navigation/PageHeader/PageHeader';
import { PageContainer } from '@/components/layout/PageContainer/PageContainer';
import { Badge } from '@/components/ui';
import { PATHS } from '@/routes/paths';
import styles from './MyPage.module.css';

// Mock User Data
const MOCK_USER = {
  nickname: '챌린지마스터',
  email: 'user@example.com',
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  brix: 12500,
  stats: {
    joined: 5,
    successRate: 92,
  }
};

export function MyPage() {
  const navigate = useNavigate();
  // TODO: Fetch user profile
  const user = MOCK_USER;

  const handleLogout = () => {
    // TODO: Implement logout logic
    if (confirm('로그아웃 하시겠습니까?')) {
      navigate(PATHS.HOME);
    }
  };

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
        <img src={user.avatarUrl} alt="Profile" className={styles.avatar} />
        <div className={styles.profileInfo}>
          <div className={styles.nickname}>
            {user.nickname} <Badge variant="default">Level 3</Badge>
          </div>
          <div className={styles.email}>{user.email}</div>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{user.stats.joined}</span>
          <span className={styles.statLabel}>참여중</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{user.stats.successRate}%</span>
          <span className={styles.statLabel}>달성률</span>
        </div>
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
          <div className={styles.menuItem} onClick={() => navigate(PATHS.MY.ACCOUNT)}>
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
