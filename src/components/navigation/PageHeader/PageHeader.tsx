import { type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { IconButton } from '@/components/ui';
import styles from './PageHeader.module.css';

interface PageHeaderProps {
  title: string;
  showBack?: boolean;
  action?: ReactNode;
}

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
export function PageHeader({ title, showBack = false, action }: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className={styles.header}>
      {showBack && (
        <IconButton
          aria-label="뒤로 가기"
          className={styles.backButton}
          icon={<ChevronLeft className={styles.icon} />}
          onClick={() => navigate(-1)}
          size="md"
          variant="ghost"
        />
      )}
      <h1 className={styles.title}>{title}</h1>
      {action && <div className={styles.action}>{action}</div>}
    </header>
  );
}

