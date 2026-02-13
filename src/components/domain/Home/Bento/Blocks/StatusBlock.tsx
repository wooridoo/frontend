import { Target, LogIn } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useLoginModalStore } from '@/store/modal/useModalStore';
import styles from './StatusBlock.module.css';

export function StatusBlock() {
  const { user, isLoggedIn } = useAuthStore();
  const { onOpen: openLogin } = useLoginModalStore();

  if (!isLoggedIn || !user) {
    return (
      <div className={styles.container} onClick={() => openLogin()} style={{ cursor: 'pointer' }}>
        <div className={styles.header}>
          <span className={styles.label}>내 당도</span>
          <Target size={18} className={styles.icon} />
        </div>
        <div className={styles.content} style={{ alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-secondary)' }}>
            <LogIn size={20} />
            <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>로그인이 필요합니다</span>
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
        <p className={styles.subtext}>반가워요! 오늘도 힘내세요 💪</p>
      </div>
    </div>
  );
}
