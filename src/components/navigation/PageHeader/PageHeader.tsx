import { type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import styles from './PageHeader.module.css';

interface PageHeaderProps {
  title: string;
  showBack?: boolean;
  action?: ReactNode;
}

export function PageHeader({ title, showBack = false, action }: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className={styles.header}>
      {showBack && (
        <button onClick={() => navigate(-1)} className={styles.backButton} aria-label="Go back">
          <ChevronLeft className={styles.icon} />
        </button>
      )}
      <h1 className={styles.title}>{title}</h1>
      {action && <div className={styles.action}>{action}</div>}
    </header>
  );
}

