import { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import type { CategoryIconProps } from '@/components/ui/Icons';
import { HeroSection, GridCategory, ImageCard, StatusCard } from '@/components/domain/Home/index';
import { Skeleton, EmptyState } from '@/components/feedback';
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
  { id: 'miracle', label: '미라클모닝', type: 'miracle' },
];

const myChallenges = [
  {
    id: '101',
    title: '아침 6시 기상하기',
    progress: 33,
    dDay: 14,
    thumbnailUrl: 'https://images.unsplash.com/photo-1544367563-12123d8c56fa?q=80&w=200&auto=format&fit=crop',
  },
  {
    id: '102',
    title: '매일 물 2L 마시기',
    progress: 80,
    dDay: 3,
    thumbnailUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?q=80&w=200&auto=format&fit=crop',
  }
];

const recommendedChallenges = [
  {
    id: '1',
    title: '한 달 10만원 저축 챌린지',
    category: '저축',
    participantCount: 128,
    thumbnailUrl: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: '2',
    title: '매일 30분 걷기',
    category: '운동',
    participantCount: 89,
    thumbnailUrl: 'https://images.unsplash.com/photo-1552674605-4694c0cc5ce6?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: '3',
    title: '매일 책 10페이지 읽기',
    category: '독서',
    participantCount: 56,
    thumbnailUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: '4',
    title: '샐러드 먹기 인증',
    category: '식습관',
    participantCount: 210,
    thumbnailUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=600&auto=format&fit=crop',
  }
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
      {/* 1. Hero Section (Carousel + Banner) */}
      <HeroSection />

      {/* 2. Categories (Icon Grid) */}
      <section className={styles.categorySection}>
        <GridCategory
          categories={mockCategories}
          selectedCategory={selectedCategory}
          onSelect={handleCategorySelect}
        />
      </section>

      {/* 3. My Challenges (Horizontal Scroll) - Logged In Only */}
      {isLoggedIn && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>진행 중인 챌린지 🏃</h2>
            <button className={styles.moreLink} onClick={() => navigate('/my-challenges')}>더보기</button>
          </div>

          <div className={styles.scrollContainer}>
            {myChallenges.map((challenge) => (
              <StatusCard
                key={challenge.id}
                title={challenge.title}
                progress={challenge.progress}
                dDay={challenge.dDay}
                thumbnail={challenge.thumbnailUrl}
                onClick={() => handleChallengeClick(challenge.id)}
              />
            ))}
          </div>
        </section>
      )}

      {/* 4. Recommended Challenges (Grid) */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>오늘의 챌린지 🔥</h2>
        </div>

        {isLoading ? (
          <div className={styles.grid}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={styles.skeletonWrapper}>
                <Skeleton variant="rounded" height={200} />
                <Skeleton variant="text" width="60%" />
              </div>
            ))}
          </div>
        ) : filteredChallenges.length === 0 ? (
          <EmptyState
            icon="🔍"
            title="조건에 맞는 챌린지가 없어요"
            description="다른 카테고리를 선택해보세요"
          />
        ) : (
          <div className={styles.grid}>
            {filteredChallenges.map((challenge) => (
              <ImageCard
                key={challenge.id}
                title={challenge.title}
                category={challenge.category}
                thumbnail={challenge.thumbnailUrl}
                stats={{ type: 'participants', value: challenge.participantCount }}
                onClick={() => handleChallengeClick(challenge.id)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
