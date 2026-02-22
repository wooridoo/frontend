import { Target, LogIn } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useLoginModalStore } from '@/store/modal/useModalStore';
import { PATHS } from '@/routes/paths';
import { sanitizeReturnToPath } from '@/lib/utils/authNavigation';
import styles from './StatusBlock.module.css';

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
export function StatusBlock() {
  const { user, isLoggedIn } = useAuthStore();
  const location = useLocation();
  const { onOpen: openLogin } = useLoginModalStore();
  const returnTo = sanitizeReturnToPath(`${location.pathname}${location.search}${location.hash}`, PATHS.HOME);

  if (!isLoggedIn || !user) {
    return (
      <div
        className={styles.container}
        role="button"
        tabIndex={0}
        onClick={() => openLogin({ returnTo })}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openLogin({ returnTo });
          }
        }}
      >
        <div className={styles.header}>
          <span className={styles.label}>내 당도</span>
          <Target size={18} className={styles.icon} />
        </div>
        <div className={`${styles.content} ${styles.loginContent}`}>
          <div className={styles.loginHint}>
            <LogIn size={20} />
            <span>로그인이 필요합니다</span>
          </div>
        </div>
      </div>
    );
  }

  // 보조 처리
  // 보조 처리
  // 보조 처리
  // 보조 처리
  // 보조 처리

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.label}>내 정보</span>
        <Target size={18} className={styles.icon} />
      </div>
      <div className={styles.content}>
        <span className={styles.value}>{user.name}님</span>
        <p className={styles.subtext}>반가워요! 오늘도 힘내세요.</p>
      </div>
    </div>
  );
}
