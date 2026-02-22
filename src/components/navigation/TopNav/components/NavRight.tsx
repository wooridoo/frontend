import { useLocation } from 'react-router-dom';
import { LogIn, UserPlus } from 'lucide-react';
import { ProfileMenu } from '@/components/ui/Overlay';
import { NotificationOverlay } from '@/components/domain/Notification/NotificationOverlay';
import { useLoginModalStore } from '@/store/modal/useModalStore';
import { useSignupModalStore } from '@/store/modal/useModalStore';
import { BrixBadge } from '@/components/domain/BrixBadge/BrixBadge';
import { Button, IconButton } from '@/components/ui';
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

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
export function NavRight({ isLoggedIn = false, user, onLogout }: NavRightProps) {
  const location = useLocation();
  const { onOpen: openLogin } = useLoginModalStore();
  const { onOpen: openSignup } = useSignupModalStore();
  const returnTo = sanitizeReturnToPath(`${location.pathname}${location.search}${location.hash}`, PATHS.HOME);

  return (
    <div className={styles.root}>
      {isLoggedIn && user ? (
        <div className={styles.userActions}>
          <div className={styles.summaryChip}>
            <div className={styles.brixContainer}>
              <BrixBadge grade={getBrixGrade(user.brix)} variant="3d" size="sm" showLabel={false} />
              <span className={styles.brixScore}>{formatBrix(user.brix)} 브릭스</span>
            </div>
            {user.account ? (
              <>
                <span className={styles.summaryDot}>·</span>
                <span className={styles.balanceLabel}>보유금</span>
                <span className={styles.balanceValue}>{formatCurrency(user.account.balance)}</span>
              </>
            ) : null}
          </div>

          {/* 보조 설명 */}
          <NotificationOverlay />

          {/* 보조 설명 */}
          <ProfileMenu
            user={user}
            onLogout={onLogout}
            trigger={
              <IconButton
                aria-label="프로필 메뉴"
                className={styles.profileButton}
                icon={user.profileImage ? (
                  <img src={user.profileImage} alt={user.name || user.nickname} className={styles.profileImage} />
                ) : (
                  <span>{(user.name || user.nickname || '?').slice(0, 1)}</span>
                )}
                shape="circle"
                size="sm"
                variant="outline"
              />
            }
          />
        </div>
      ) : (
        <div className={styles.authButtons}>
          <Button
            className={styles.secondaryButton}
            onClick={() => openLogin({ returnTo })}
            leadingIcon={<LogIn size={16} />}
            size="sm"
            variant="outline"
          >
            <span className={styles.buttonText}>로그인</span>
          </Button>
          <Button
            className={styles.primaryButton}
            onClick={() => openSignup()}
            leadingIcon={<UserPlus size={16} />}
            size="sm"
            variant="primary"
          >
            <span className={styles.buttonText}>회원가입</span>
          </Button>
        </div>
      )}
    </div>
  );
}
