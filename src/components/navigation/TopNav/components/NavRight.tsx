import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { LogIn, UserPlus, Bell } from 'lucide-react';
import { ProfileMenu } from '@/components/ui/Overlay';
import { useLoginModalStore } from '@/store/useLoginModalStore';
import styles from './NavRight.module.css';

interface User {
  name: string;
  avatar?: string;
  sugarScore: number;
  balance: number;
}

interface NavRightProps {
  isLoggedIn?: boolean;
  user?: User;
  onLogout: () => void;
}

export function NavRight({ isLoggedIn = false, user, onLogout }: NavRightProps) {
  const navigate = useNavigate();
  const { onOpen } = useLoginModalStore();

  return (
    <div className={styles.root}>
      {isLoggedIn && user ? (
        <div className={styles.userActions}>
          {/* Notification Bell */}
          <button className={styles.iconButton}>
            <Bell size={24} />
            <span className={styles.notiDot} />
          </button>

          {/* Profile Menu */}
          <ProfileMenu
            user={user}
            onLogout={onLogout}
            trigger={
              <button className={styles.profileButton}>
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className={styles.profileImage} />
                ) : (
                  <span>{user.name.slice(0, 1)}</span>
                )}
              </button>
            }
          />
        </div>
      ) : (
        <div className={styles.authButtons}>
          <button
            className={clsx(styles.button, styles.secondaryButton)}
            onClick={onOpen}
            aria-label="로그인"
          >
            <LogIn size={16} />
            <span className={styles.buttonText}>로그인</span>
          </button>
          <button
            className={clsx(styles.button, styles.primaryButton)}
            onClick={() => navigate('/signup')}
            aria-label="회원가입"
          >
            <UserPlus size={16} />
            <span className={styles.buttonText}>회원가입</span>
          </button>
        </div>
      )}
    </div>
  );
}
