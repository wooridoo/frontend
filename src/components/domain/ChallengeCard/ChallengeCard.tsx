import clsx from 'clsx';
import { Badge } from '@/components/ui';
import { Category } from '@/types/enums';
import styles from './ChallengeCard.module.css';

interface ChallengeCardProps {
  className?: string;
  id: string;
  title: string;
  thumbnailUrl?: string;
  category: Category;
  participantCount: number;
  currentRound: number;
  totalRounds: number;
  onClick?: (id: string) => void;
}

export function ChallengeCard({
  className,
  id,
  title,
  thumbnailUrl,
  category,
  participantCount,
  currentRound,
  totalRounds,
  onClick,
}: ChallengeCardProps) {
  const progressPercent = totalRounds > 0 ? (currentRound / totalRounds) * 100 : 0;

  const handleClick = () => {
    onClick?.(id);
  };

  return (
    <article
      className={clsx(styles.card, className)}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
    >
      {/* Thumbnail */}
      <div className={styles.thumbnail}>
        {thumbnailUrl ? (
          <img src={thumbnailUrl} alt={title} />
        ) : (
          <div className={styles.placeholder}>
            <span>🎯</span>
          </div>
        )}
        <Badge className={styles.categoryBadge} variant="default" size="sm">
          {category}
        </Badge>
      </div>

      {/* Content */}
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>

        <div className={styles.meta}>
          <span className={styles.participants}>
            👥 {participantCount}명 참여 중
          </span>
        </div>

        {/* Progress */}
        <div className={styles.progress}>
          <div className={styles.progressInfo}>
            <span className={styles.progressLabel}>진행률</span>
            <span className={styles.progressText}>
              {currentRound}/{totalRounds} 회차
            </span>
          </div>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>
    </article>
  );
}

export type { ChallengeCardProps };
