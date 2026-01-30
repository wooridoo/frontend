import clsx from 'clsx';
import styles from './StatusCard.module.css';

interface StatusCardProps {
  title: string;
  progress: number;
  dDay?: number;
  thumbnail?: string;
  onClick?: () => void;
  className?: string;
}

export function StatusCard({
  title,
  progress,
  dDay,
  thumbnail,
  onClick,
  className
}: StatusCardProps) {
  return (
    <div className={clsx(styles.card, className)} onClick={onClick}>
      <div className={styles.thumbnailWrapper}>
        {/* Small Thumbnail */}
        {thumbnail ? (
          <img src={thumbnail} alt={title} className={styles.image} />
        ) : (
          <div className={styles.placeholder} />
        )}
      </div>

      <div className={styles.info}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.progressWrapper}>
          <div className={styles.progressTrack}>
            <div
              className={styles.progressBar}
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
          <span className={styles.progressText}>{progress}% 달성</span>
        </div>
        {dDay !== undefined && (
          <span className={styles.dDay}>
            D{dDay >= 0 ? '-' : '+'}{Math.abs(dDay)}
          </span>
        )}
      </div>
    </div>
  );
}
