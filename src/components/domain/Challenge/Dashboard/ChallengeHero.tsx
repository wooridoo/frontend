import styles from './ChallengeHero.module.css';
import { Crown } from 'lucide-react';

interface ChallengeHeroProps {
  title: string;
  category: string;
  leaderName: string;
  leaderScore: number;
}

export function ChallengeHero({ title, category, leaderName, leaderScore }: ChallengeHeroProps) {
  return (
    <div className={styles.hero}>
      {/* Background Cover (Mock Gradient/Image) */}
      <div className={styles.cover}>
        {/* In real app, this would be an <img> or background-image */}
        <div className={styles.coverOverlay} />
      </div>

      <div className={styles.content}>
        <div className={styles.iconWrapper}>
          <span className={styles.icon}>📚</span>
        </div>

        <div className={styles.info}>
          <div className={styles.badges}>
            <span className={styles.categoryBadge}>{category}</span>
            <span className={styles.certBadge}>✅ 인증</span>
          </div>

          <h1 className={styles.title}>{title}</h1>
          <p className={styles.subtitle}>매주 함께 책 읽고 토론하는 모임</p>

          <div className={styles.meta}>
            <div className={styles.participants}>👥 10/15명</div>
            <div className={styles.separator}>•</div>
            <div className={styles.fee}>월 서포트 ₩50,000</div>
            <div className={styles.separator}>•</div>
            {/* Leader Badge */}
            <div className={styles.leaderBadge}>
              <div className={styles.leaderIcon}>
                <Crown size={12} color="#fff" />
              </div>
              <span className={styles.leaderLabel}>리더</span>
              <span className={styles.leaderName}>{leaderName}</span>
              <span className={styles.leaderScore}>🍬 {leaderScore}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
