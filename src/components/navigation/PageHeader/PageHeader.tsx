import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import styles from './PageHeader.module.css';

interface PageHeaderProps {
  title: string;
  showBack?: boolean;
}

export function PageHeader({ title, showBack = false }: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className={styles.header}>
      {showBack && (
        <button onClick={() => navigate(-1)} className={styles.backButton} aria-label="Go back">
          <ChevronLeft className={styles.icon} />
        </button>
      )}
      <h1 className={styles.title}>{title}</h1>
    </header>
  );
}
