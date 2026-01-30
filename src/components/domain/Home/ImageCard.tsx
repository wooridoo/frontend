import clsx from 'clsx';
import { SidebarIcon } from '@/components/ui/Icons';
import styles from './ImageCard.module.css';

interface ImageCardProps {
  title: string;
  category: string;
  thumbnail?: string;
  stats?: {
    type: 'participants' | 'brix';
    value: string | number;
  };
  onClick?: () => void;
  className?: string;
}

export function ImageCard({
  title,
  category,
  thumbnail,
  stats,
  onClick,
  className
}: ImageCardProps) {
  return (
    <div className={clsx(styles.card, className)} onClick={onClick}>
      <div className={styles.imageWrapper}>
        {thumbnail ? (
          <img src={thumbnail} alt={title} className={styles.image} />
        ) : (
          <div className={styles.placeholder} />
        )}
        {stats && (
          <div className={styles.badge}>
            {stats.type === 'participants' && (
              <SidebarIcon type="members" size={12} color="white" />
            )}
            {stats.type === 'brix' && (
              <span>🍬</span>
            )}
            <span className={styles.badgeText}>{stats.value}</span>
          </div>
        )}
      </div>
      <div className={styles.content}>
        <span className={styles.category}>{category}</span>
        <h3 className={styles.title}>{title}</h3>
      </div>
    </div>
  );
}
