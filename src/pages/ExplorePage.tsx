import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import styles from './ExplorePage.module.css';
import { PageContainer } from '@/components/layout';
import { PageHeader } from '@/components/navigation';
import { getChallenges, type ChallengeInfo } from '@/lib/api/challenge';
import { getCategoryLabel, CATEGORY_LABELS } from '@/lib/utils/categoryLabels';
import { Category } from '@/types/enums';
import { PATHS } from '@/routes/paths';

const CATEGORIES = ['전체', '건강', '역량', '취미', '자산', '생활'];

// UI Category -> API Category Enum Mapping
function mapCategoryToEnum(uiCategory: string): string | undefined {
  if (uiCategory === '전체') return undefined;
  switch (uiCategory) {
    case '건강': return Category.EXERCISE;
    case '역량': return Category.STUDY;
    case '자산': return Category.SAVINGS;
    case '취미': return Category.HOBBY;
    case '생활': return Category.OTHER; // 생활은 매핑이 모호하므로 OTHER로 (Legacy 로직 참고)
    default: return undefined;
  }
}

export function ExplorePage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category');

  // Initialize state from URL param if present, mapping Enum -> UI Label
  // default to '전체'
  const [selectedCategory, setSelectedCategory] = useState(() => {
    if (categoryParam && CATEGORY_LABELS[categoryParam]) {
      return CATEGORY_LABELS[categoryParam];
    }
    return '전체';
  });

  // Query Function
  const { data: challenges, isLoading } = useQuery({
    queryKey: ['challenges', 'explore', query, selectedCategory],
    queryFn: () => getChallenges({
      query: query || undefined,
      category: mapCategoryToEnum(selectedCategory)
    }),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const content = challenges || [];

  return (
    <PageContainer className={styles.page}>
      <PageHeader title="탐색" />

      {/* Category Filter */}
      <div className={styles.categorySection}>
        <div className={styles.categoryList}>
          {CATEGORIES.map(category => (
            <button
              key={category}
              className={`${styles.categoryChip} ${selectedCategory === category ? styles.active : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.contentContainer}>
        {/* 1. Search Results Section */}
        {query && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              '{query}' 검색결과 <span className={styles.count}>{content.length}</span>
            </h2>
            {isLoading ? (
              <div className={styles.emptyState}>검색 중...</div>
            ) : content.length > 0 ? (
              <div className={styles.grid}>
                {content.map(challenge => (
                  <ChallengeCard key={challenge.challengeId} challenge={challenge} />
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>검색 결과가 없습니다.</div>
            )}
          </section>
        )}

        {/* 2. Recommended / Category Section (Only show if not searching or separate logic) */}
        {!query && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              {selectedCategory === '전체' ? '전체 챌린지' : `${selectedCategory} 챌린지`}
            </h2>
            {isLoading ? (
              <div className={styles.emptyState}>로딩 중...</div>
            ) : (
              <div className={styles.grid}>
                {content.slice(0, 8).map(challenge => (
                  <ChallengeCard key={challenge.challengeId} challenge={challenge} />
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </PageContainer>
  );
}

function ChallengeCard({ challenge }: { challenge: ChallengeInfo }) {
  return (
    <Link to={PATHS.CHALLENGE.DETAIL(String(challenge.challengeId))} className={styles.card}>
      <div className={styles.imageWrapper}>
        <img
          src={challenge.thumbnailUrl || 'https://via.placeholder.com/300?text=No+Image'}
          alt={challenge.title}
          className={styles.image}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            // Prevent infinite loop if fallback image also fails
            if (target.src !== 'https://via.placeholder.com/300?text=No+Image') {
              target.src = 'https://via.placeholder.com/300?text=No+Image';
            }
          }}
        />
        <span className={styles.tag}>{getCategoryLabel(challenge.category)}</span>
      </div>
      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>{challenge.title}</h3>
        <div className={styles.cardFooter}>
          <span className={styles.participants}>{challenge.memberCount.current}명 참여 중</span>
        </div>
      </div>
    </Link>
  );
}
