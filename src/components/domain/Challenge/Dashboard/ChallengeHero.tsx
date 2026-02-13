import { Crown } from 'lucide-react';
import type { ChallengeInfo } from '@/lib/api/challenge';
import { formatCurrency } from '@/utils/format';
import { Skeleton } from '@/components/feedback';
import { ChallengeStatus } from '@/types/enums';
import { getCategoryLabel } from '@/lib/utils/categoryLabels';
import { SemanticIcon } from '@/components/ui';
import styles from './ChallengeHero.module.css';

interface ChallengeHeroProps {
  challenge: ChallengeInfo;
}

const CHALLENGE_FALLBACK_IMAGE = '/images/challenge-fallback.svg';

export function ChallengeHero({ challenge }: ChallengeHeroProps) {
  const { title, description, category, memberCount, supportAmount, leader, thumbnailUrl, status } = challenge;

  return (
    <div className={styles.hero}>
      <div className={styles.cover}>
        <img
          alt="challenge cover"
          className={styles.coverImage}
          onError={e => {
            (e.target as HTMLImageElement).src = CHALLENGE_FALLBACK_IMAGE;
          }}
          src={thumbnailUrl || CHALLENGE_FALLBACK_IMAGE}
        />
      </div>

      <div className={styles.content}>
        <div className={styles.iconWrapper}>
          <SemanticIcon name="challenge" size={28} />
        </div>

        <div className={styles.info}>
          <div className={styles.badges}>
            <span className={styles.categoryBadge}>{getCategoryLabel(category)}</span>
            {status === ChallengeStatus.IN_PROGRESS ? <span className={styles.certBadge}>진행중</span> : null}
          </div>

          <h1 className={styles.title}>{title}</h1>
          <p className={styles.subtitle}>{description || '챌린지 소개가 없습니다.'}</p>

          <div className={styles.meta}>
            <div className={styles.participants}>
              <SemanticIcon animated={false} name="member" size={14} /> {memberCount.current}/{memberCount.max}명
            </div>
            <div className={styles.separator}>·</div>
            <div className={styles.fee}>월 서포트 {formatCurrency(supportAmount)}</div>
            <div className={styles.separator}>·</div>

            <div className={styles.leaderBadge}>
              <div className={styles.leaderIcon}>
                <Crown className="text-white" size={12} />
              </div>
              <span className={styles.leaderLabel}>리더</span>
              <span className={styles.leaderName}>{leader.nickname}</span>
              <span className={styles.leaderScore}>
                <SemanticIcon animated={false} name="success" size={12} /> {leader.brix}
              </span>
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
          <Skeleton height={40} width={40} />
        </div>
        <div className={styles.info}>
          <div style={{ marginBottom: 10 }}>
            <Skeleton height={32} width={200} />
          </div>
          <Skeleton height={20} width={300} />
        </div>
      </div>
    </div>
  );
}
