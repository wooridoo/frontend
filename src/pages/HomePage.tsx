import { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import clsx from 'clsx';
import { CategoryIcon, type CategoryIconProps } from '@/components/ui/Icons';
import { ChallengeCard } from '@/components/domain';
import { Skeleton, EmptyState } from '@/components/feedback';
import { HeroAnimation } from '@/components/ui/Hero';
import styles from './HomePage.module.css';

interface CategoryItem {
  id: string;
  label: string;
  type: CategoryIconProps['type'];
}

interface MainLayoutContext {
  isLoggedIn: boolean;
}

const mockCategories: CategoryItem[] = [
  { id: 'all', label: '전체', type: 'all' },
  { id: 'savings', label: '저축', type: 'savings' },
  { id: 'exercise', label: '운동', type: 'exercise' },
  { id: 'reading', label: '독서', type: 'reading' },
  { id: 'diet', label: '식습관', type: 'diet' },
  { id: 'hobby', label: '취미', type: 'hobby' },
  { id: 'study', label: '학습', type: 'study' },
];

const myChallenges = [
  {
    id: '101',
    title: '아침 6시 기상하기',
    category: '생활습관',
    participantCount: 450,
    currentRound: 7,
    totalRounds: 21,
    thumbnailUrl: 'https://picsum.photos/400/300?random=101',
  }
];

const recommendedChallenges = [
  {
    id: '1',
    title: '한 달 10만원 저축 챌린지',
    category: '저축',
    participantCount: 128,
    currentRound: 3,
    totalRounds: 4,
    thumbnailUrl: 'https://picsum.photos/400/300?random=10',
  },
  {
    id: '2',
    title: '매일 30분 걷기',
    category: '운동',
    participantCount: 89,
    currentRound: 15,
    totalRounds: 30,
    thumbnailUrl: 'https://picsum.photos/400/300?random=11',
  },
  {
    id: '3',
    title: '매일 책 10페이지 읽기',
    category: '독서',
    participantCount: 56,
    currentRound: 2,
    totalRounds: 10,
    thumbnailUrl: 'https://picsum.photos/400/300?random=12',
  },
];

export function HomePage() {
  const navigate = useNavigate();
  const { isLoggedIn } = useOutletContext<MainLayoutContext>();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading] = useState(false);

  // Filter challenges by category
  const filteredChallenges =
    selectedCategory === 'all'
      ? recommendedChallenges
      : recommendedChallenges.filter(
        (c) =>
          c.category ===
          mockCategories.find((cat) => cat.id === selectedCategory)?.label
      );

  const handleCategorySelect = (id: string) => {
    setSelectedCategory(id);
  };

  const handleChallengeClick = (id: string) => {
    navigate(`/challenge/${id}`);
  };

  return (
    <div className={styles.pageContainer}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <HeroAnimation />
      </section>

      {/* Categories (Circular Icons) */}
      <section className={styles.categorySection}>
        <div className={styles.categoryList}>
          {mockCategories.map((cat) => (
            <button
              key={cat.id}
              className={clsx(styles.categoryItem, selectedCategory === cat.id && styles.active)}
              onClick={() => handleCategorySelect(cat.id)}
            >
              <CategoryIcon
                type={cat.type}
                isActive={selectedCategory === cat.id}
                size={56}
              />
              <span className={styles.categoryLabel}>{cat.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* My Challenges (Horizontal Scroll) */}
      {isLoggedIn && (
        <section className={styles.challengeSection}>
          <h2 className={styles.sectionTitle}>내 챌린지</h2>
          <div className={styles.scrollContainer}>
            {myChallenges.map((challenge) => (
              <div key={challenge.id} className={styles.scrollCardWrapper}>
                <ChallengeCard {...challenge} onClick={handleChallengeClick} />
              </div>
            ))}
            {/* Add 'Find More' card or similar here if needed */}
          </div>
        </section>
      )}

      {/* Recommended Challenges (Grid) */}
      <section className={styles.challengeSection}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
          <h2 className={styles.sectionTitle} style={{ marginBottom: 0 }}>추천 챌린지</h2>
          {/* Optional 'More' button */}
        </div>

        {isLoading ? (
          <div className={styles.grid}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={styles.skeletonCard}>
                <Skeleton variant="rounded" height={180} />
                <Skeleton variant="text" width="80%" height={20} />
                <Skeleton variant="text" width="60%" height={16} />
              </div>
            ))}
          </div>
        ) : filteredChallenges.length === 0 ? (
          <EmptyState
            icon="🔍"
            title="챌린지가 없어요"
            description="다른 카테고리를 선택해보세요"
          />
        ) : (
          <div className={styles.grid}>
            {filteredChallenges.map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                {...challenge}
                onClick={handleChallengeClick}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
