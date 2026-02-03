import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui';
import { AlertCircle } from 'lucide-react';
import styles from './NotFoundPage.module.css';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.iconWrapper}>
          <AlertCircle size={64} className={styles.icon} />
        </div>
        <h1 className={styles.title}>페이지를 찾을 수 없습니다</h1>
        <p className={styles.description}>
          요청하신 페이지가 존재하지 않거나,<br />
          이동되었을 수 있습니다.
        </p>
        <div className={styles.actions}>
          <Button onClick={() => navigate('/')} variant="primary" size="lg">
            홈으로 돌아가기
          </Button>
          <Button onClick={() => navigate(-1)} variant="secondary" size="lg">
            이전 페이지
          </Button>
        </div>
      </div>
    </div>
  );
}
