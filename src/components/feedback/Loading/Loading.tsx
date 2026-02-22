import { Loader2 } from 'lucide-react';
import styles from './Loading.module.css';

/**
 * 페이지 단위 비동기 로딩 상태를 표시하는 공통 컴포넌트입니다.
 */
export function Loading() {
  return (
    <div className={styles.container}>
      <Loader2 className={styles.spinner} />
      <p className={styles.message}>로딩 중입니다...</p>
    </div>
  );
}
