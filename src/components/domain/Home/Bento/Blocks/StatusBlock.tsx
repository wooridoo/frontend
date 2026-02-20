import { Target, LogIn } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useLoginModalStore } from '@/store/modal/useModalStore';
import { PATHS } from '@/routes/paths';
import { sanitizeReturnToPath } from '@/lib/utils/authNavigation';
import styles from './StatusBlock.module.css';

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

  // Calculate progress to next grade (simplified logic for now)
  // const currentBrix = user.brix;
  // const nextGradeBrix = Math.ceil(currentBrix / 10) * 10; // Assuming 10-step grades
  // const progress = (currentBrix % 10) * 10; // 0-100% within the 10-point range
  // const remaining = (nextGradeBrix - currentBrix).toFixed(1);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.label}>내 정보</span>
        <Target size={18} className={styles.icon} />
      </div>
      <div className={styles.content}>
        <span className={styles.value}>{user.name}님</span>
        {/* <div className={styles.progressTrack}>
          <div className={styles.progressBar} style={{ width: `${progress}%` }}></div>
        </div> */}
        <p className={styles.subtext}>반가워요! 오늘도 힘내세요.</p>
      </div>
    </div>
  );
}
