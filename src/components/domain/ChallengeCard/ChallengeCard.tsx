import clsx from 'clsx';
import { Badge, SemanticIcon } from '@/components/ui';
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

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
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
      {/* 보조 설명 */}
      <div className={styles.thumbnail}>
        {thumbnailUrl ? (
          <img src={thumbnailUrl} alt={title} />
        ) : (
          <div className={styles.placeholder}>
            <SemanticIcon name="challenge" size={22} />
          </div>
        )}
        <Badge className={styles.categoryBadge} variant="default" size="sm">
          {category}
        </Badge>
      </div>

      {/* 보조 설명 */}
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>

        <div className={styles.meta}>
          <span className={styles.participants}>
            <SemanticIcon animated={false} name="member" size={14} /> {participantCount}명 참여 중
          </span>
        </div>

        {/* 보조 설명 */}
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
