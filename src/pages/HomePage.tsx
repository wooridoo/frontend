import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SideNav } from '@/components/navigation';
import { HeroBanner, CategoryTabs, SearchBar, type Category, type BannerSlide } from '@/components/ui';
import { ChallengeCard } from '@/components/domain';
import { Skeleton, EmptyState } from '@/components/feedback';
import styles from './HomePage.module.css';

// Mock data - replace with API calls
const mockBanners: BannerSlide[] = [
  {
    id: '1',
    imageUrl: 'https://picsum.photos/1200/400?random=1',
    title: '함께하면 더 쉬운 저축',
    subtitle: '월 10만원 저축 챌린지에 참여해보세요!',
  },
  {
    id: '2',
    imageUrl: 'https://picsum.photos/1200/400?random=2',
    title: '새해 목표 달성하기',
    subtitle: '친구들과 함께라면 가능해요',
  },
];

const mockCategories: Category[] = [
  { id: 'all', label: '전체', icon: '🌟' },
  { id: 'savings', label: '저축', icon: '💰' },
  { id: 'exercise', label: '운동', icon: '🏃' },
  { id: 'reading', label: '독서', icon: '📚' },
  { id: 'diet', label: '다이어트', icon: '🥗' },
  { id: 'hobby', label: '취미', icon: '🎨' },
  { id: 'study', label: '학습', icon: '📝' },
];

const mockChallenges = [
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
    title: '한 달 4권 읽기',
    category: '독서',
    participantCount: 56,
    currentRound: 2,
    totalRounds: 4,
    thumbnailUrl: 'https://picsum.photos/400/300?random=12',
  },
  {
    id: '4',
    title: '간헐적 단식 16:8',
    category: '다이어트',
    participantCount: 234,
    currentRound: 7,
    totalRounds: 14,
    thumbnailUrl: 'https://picsum.photos/400/300?random=13',
  },
];

export function HomePage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter challenges by category
  const filteredChallenges =
    selectedCategory === 'all'
      ? mockChallenges
      : mockChallenges.filter(
        (c) =>
          c.category ===
          mockCategories.find((cat) => cat.id === selectedCategory)?.label
      );

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category.id);
  };

  const handleChallengeClick = (id: string) => {
    navigate(`/challenge/${id}`);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // TODO: Implement search
  };

  const handleBannerClick = (slide: BannerSlide) => {
    // TODO: Navigate to banner link
  };

  return (
    <div className={styles.layout}>
      {/* Side Navigation */}
      <SideNav
        isLoggedIn={false}
        onLogout={() => { }}
      />

      {/* Main Content */}
      <main className={styles.main}>
        {/* Header with Search */}
        <header className={styles.header}>
          <SearchBar onSearch={handleSearch} />
        </header>

        {/* Hero Banner */}
        <section className={styles.bannerSection}>
          <HeroBanner slides={mockBanners} onSlideClick={handleBannerClick} />
        </section>

        {/* Category Tabs */}
        <section className={styles.categorySection}>
          <CategoryTabs
            categories={mockCategories}
            selectedId={selectedCategory}
            onSelect={handleCategorySelect}
          />
        </section>

        {/* Challenge Grid */}
        <section className={styles.challengeSection}>
          <h2 className={styles.sectionTitle}>인기 챌린지</h2>

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
      </main>
    </div>
  );
}

export default HomePage;
