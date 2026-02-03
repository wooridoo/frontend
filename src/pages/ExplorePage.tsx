import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import styles from './ExplorePage.module.css';
import { PageContainer } from '@/components/layout';
import { PageHeader } from '@/components/navigation';
import { MOCK_CHALLENGES } from '@/lib/api/mocks/challenges';
import { Category } from '@/types/enums';
import type { Challenge } from '@/types/domain';
import { PATHS } from '@/routes/paths';

const CATEGORIES = ['전체', '건강', '역량', '취미', '자산', '생활'];

// Helper to map UI Category strings to Enum or filter logic
function matchCategory(uiCategory: string, challengeCategory: Category): boolean {
  if (uiCategory === '전체') return true;

  // Mapping logic
  switch (uiCategory) {
    case '건강': return challengeCategory === Category.EXERCISE;
    case '역량': return challengeCategory === Category.STUDY;
    case '자산': return challengeCategory === Category.SAVINGS;
    case '취미': return challengeCategory === Category.HOBBY;
    case '생활': return challengeCategory === Category.OTHER || challengeCategory === Category.CULTURE || challengeCategory === Category.FOOD || challengeCategory === Category.TRAVEL;
    default: return false;
  }
}

export function ExplorePage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [selectedCategory, setSelectedCategory] = useState('전체');

  // Filter for Search Results
  const searchResults = query
    ? MOCK_CHALLENGES.filter(c => c.name.toLowerCase().includes(query.toLowerCase()))
    : [];

  // Filter for Category
  const categoryResults = MOCK_CHALLENGES.filter(challenge => {
    return matchCategory(selectedCategory, challenge.category);
  });

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
              '{query}' 검색결과 <span className={styles.count}>{searchResults.length}</span>
            </h2>
            {searchResults.length > 0 ? (
              <div className={styles.grid}>
                {searchResults.map(challenge => (
                  <ChallengeCard key={challenge.id} challenge={challenge} />
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>검색 결과가 없습니다.</div>
            )}
          </section>
        )}

        {/* 2. Recommended / Category Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            {query ? '이런 챌린지는 어때요?' : (selectedCategory === '전체' ? '추천 챌린지' : `${selectedCategory} 챌린지`)}
          </h2>
          <div className={styles.grid}>
            {categoryResults.slice(0, 8).map(challenge => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </div>
        </section>
      </div>
    </PageContainer>
  );
}

function ChallengeCard({ challenge }: { challenge: Challenge }) {
  // Map Category Enum back to display string if needed, or use directly
  // For now simple display
  return (
    <Link to={PATHS.CHALLENGE.DETAIL(challenge.id)} className={styles.card}>
      <div className={styles.imageWrapper}>
        <img src={challenge.thumbnailUrl || 'https://via.placeholder.com/300'} alt={challenge.name} className={styles.image} />
        <span className={styles.tag}>{challenge.category}</span>
      </div>
      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>{challenge.name}</h3>
        <div className={styles.cardFooter}>
          <span className={styles.participants}>{challenge.currentMembers}명 참여 중</span>
        </div>
      </div>
    </Link>
  );
}
