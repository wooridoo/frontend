import clsx from 'clsx';
import { useLocation } from 'react-router-dom';
import { LogIn, UserPlus } from 'lucide-react';
import { ProfileMenu } from '@/components/ui/Overlay';
import { NotificationOverlay } from '@/components/domain/Notification/NotificationOverlay';
import { useLoginModalStore } from '@/store/modal/useModalStore';
import { useSignupModalStore } from '@/store/modal/useModalStore';
import { BrixBadge } from '@/components/domain/BrixBadge/BrixBadge';
import { getBrixGrade, formatBrix } from '@/lib/brix';
import { formatCurrency } from '@/lib/utils';
import type { User } from '@/types/user';
import { sanitizeReturnToPath } from '@/lib/utils/authNavigation';
import { PATHS } from '@/routes/paths';
import styles from './NavRight.module.css';

interface NavRightProps {
  isLoggedIn?: boolean;
  user?: User;
  onLogout: () => void;
}

export function NavRight({ isLoggedIn = false, user, onLogout }: NavRightProps) {
  const location = useLocation();
  const { onOpen: openLogin } = useLoginModalStore();
  const { onOpen: openSignup } = useSignupModalStore();
  const returnTo = sanitizeReturnToPath(`${location.pathname}${location.search}${location.hash}`, PATHS.HOME);

  return (
    <div className={styles.root}>
      {isLoggedIn && user ? (
        <div className={styles.userActions}>
          <div className={styles.userInfo}>
            {/* Brix Badge & Score */}
            <div className={styles.brixContainer}>
              <BrixBadge grade={getBrixGrade(user.brix)} variant="3d" size="sm" showLabel={false} />
              <span className={styles.brixScore}>{formatBrix(user.brix)} 브릭스</span>
            </div>

            {/* Account Balance */}
            {user.account && (
              <div className={styles.balanceContainer}>
                <span className={styles.balanceLabel}>보유금</span>
                <span className={styles.balanceValue}>{formatCurrency(user.account.balance)}</span>
              </div>
            )}
          </div>

          <div className={styles.divider} />

          {/* Notification Overlay */}
          <NotificationOverlay />

          {/* Profile Menu */}
          <ProfileMenu
            user={user}
            onLogout={onLogout}
            trigger={
              <button className={styles.profileButton}>
                {user.profileImage ? (
                  <img src={user.profileImage} alt={user.name || user.nickname} className={styles.profileImage} />
                ) : (
                  <span>{(user.name || user.nickname || '?').slice(0, 1)}</span>
                )}
              </button>
            }
          />
        </div>
      ) : (
        <div className={styles.authButtons}>
          <button
            className={clsx(styles.button, styles.secondaryButton)}
            onClick={() => openLogin({ returnTo })}
            aria-label="로그인"
          >
            <LogIn size={16} />
            <span className={styles.buttonText}>로그인</span>
          </button>
          <button
            className={clsx(styles.button, styles.primaryButton)}
            onClick={() => openSignup()}
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
