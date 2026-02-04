import { Crown } from 'lucide-react';
import type { ChallengeInfo } from '@/lib/api/challenge';
import { formatCurrency } from '@/utils/format';
import { Skeleton } from '@/components/feedback';
import { ChallengeStatus } from '@/types/enums';
import styles from './ChallengeHero.module.css';

interface ChallengeHeroProps {
  challenge: ChallengeInfo;
}

export function ChallengeHero({ challenge }: ChallengeHeroProps) {
  const {
    title,
    description,
    category,
    memberCount,
    supportAmount,
    leader,
    thumbnailUrl,
    status
  } = challenge;

  return (
    <div className={styles.hero}>
      {/* Background Cover */}
      <div className={styles.cover}>
        {thumbnailUrl ? (
          <img src={thumbnailUrl} alt="cover" className={styles.coverImage} />
        ) : (
          <div className={styles.coverOverlay} />
        )}
      </div>

      <div className={styles.content}>
        <div className={styles.iconWrapper}>
          <span className={styles.icon}>📚</span>
        </div>

        <div className={styles.info}>
          <div className={styles.badges}>
            <span className={styles.categoryBadge}>{category}</span>
            {status === ChallengeStatus.IN_PROGRESS && <span className={styles.certBadge}>✅ 진행중</span>}
          </div>

          <h1 className={styles.title}>{title}</h1>
          <p className={styles.subtitle}>{description || '설명이 없습니다.'}</p>

          <div className={styles.meta}>
            <div className={styles.participants}>
              👥 {memberCount.current}/{memberCount.max}명
            </div>
            <div className={styles.separator}>•</div>
            <div className={styles.fee}>
              월 서포트 {formatCurrency(supportAmount)}
            </div>

            <div className={styles.separator}>•</div>

            {/* Leader Badge */}
            <div className={styles.leaderBadge}>
              <div className={styles.leaderIcon}>
                <Crown size={12} className="text-white" />
              </div>
              <span className={styles.leaderLabel}>리더</span>
              <span className={styles.leaderName}>{leader.nickname}</span>
              <span className={styles.leaderScore}>🍬 {leader.brix}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ChallengeHeroSkeleton() {
  return (
    <div className={styles.hero}>
      <div className={styles.cover} />
      <div className={styles.content}>
        <div className={styles.iconWrapper}>
          <Skeleton width={40} height={40} />
        </div>
        <div className={styles.info}>
          <div style={{ marginBottom: 10 }}>
            <Skeleton width={200} height={32} />
          </div>
          <Skeleton width={300} height={20} />
        </div>
      </div>
    </div>
  );
}
