import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom'; // Link added
import styles from './ExplorePage.module.css';
import { PageContainer } from '@/components/layout';
import { PageHeader } from '@/components/navigation';

const CATEGORIES = ['전체', '건강', '역량', '취미', '자산', '생활'];

const MOCK_CHALLENGES = [
  { id: 1, title: '하루 물 2L 마시기', participants: 120, tag: '건강', image: 'https://picsum.photos/seed/water/300/200' },
  { id: 2, title: '영어 단어 50개 암기', participants: 85, tag: '역량', image: 'https://picsum.photos/seed/eng/300/200' },
  { id: 3, title: '매일 1만원 저축하기', participants: 230, tag: '자산', image: 'https://picsum.photos/seed/money/300/200' },
  { id: 4, title: '아침 6시 기상하기', participants: 50, tag: '생활', image: 'https://picsum.photos/seed/morning/300/200' },
  { id: 5, title: '매일 30분 독서', participants: 42, tag: '역량', image: 'https://picsum.photos/seed/read/300/200' },
  { id: 6, title: '주 3회 러닝', participants: 156, tag: '건강', image: 'https://picsum.photos/seed/run/300/200' },
  { id: 7, title: '가계부 쓰기', participants: 98, tag: '자산', image: 'https://picsum.photos/seed/account/300/200' },
  { id: 8, title: '필사하기', participants: 34, tag: '취미', image: 'https://picsum.photos/seed/write/300/200' },
];

export function ExplorePage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [selectedCategory, setSelectedCategory] = useState('전체');

  // Filter for Search Results
  const searchResults = query
    ? MOCK_CHALLENGES.filter(c => c.title.toLowerCase().includes(query.toLowerCase()))
    : [];

  // Filter for Category (Recommended Section or Main View)
  const categoryResults = MOCK_CHALLENGES.filter(challenge => {
    return selectedCategory === '전체' || challenge.tag === selectedCategory;
  });

  return (
    <PageContainer className={styles.page}>
      {/* 
         The user requested to remove the search bar from within the page 
         because TopNav already has one. 
      */}
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
        {/* 1. Search Results Section (Only if query exists) */}
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
            {/* If searching, show random recommendations over pure category filter? 
                 For simplicity, showing category results here. */}
            {categoryResults.slice(0, 8).map(challenge => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </div>
        </section>
      </div>
    </PageContainer>
  );
}

function ChallengeCard({ challenge }: { challenge: typeof MOCK_CHALLENGES[0] }) {
  return (
    <Link to={`/challenges/${challenge.id}`} className={styles.card}>
      <div className={styles.imageWrapper}>
        <img src={challenge.image} alt={challenge.title} className={styles.image} />
        <span className={styles.tag}>{challenge.tag}</span>
      </div>
      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>{challenge.title}</h3>
        <div className={styles.cardFooter}>
          <span className={styles.participants}>{challenge.participants}명 참여 중</span>
        </div>
      </div>
    </Link>
  );
}
