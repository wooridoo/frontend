// import { useNavigate } from 'react-router-dom';
import { BentoGrid, BentoItem } from '@/components/domain/Home/Bento/BentoGrid';
import { HeroBlock } from '@/components/domain/Home/Bento/Blocks/HeroBlock';
import { StatusBlock } from '@/components/domain/Home/Bento/Blocks/StatusBlock';
import { ActiveChallengeBlock } from '@/components/domain/Home/Bento/Blocks/ActiveChallengeBlock';
import { CategoryBlock } from '@/components/domain/Home/Bento/Blocks/CategoryBlock';
import { FeedBlock } from '@/components/domain/Home/Bento/Blocks/FeedBlock';
import { PageContainer } from '@/components/layout';
import styles from './HomePage.module.css';

// Legacy components commented out for now
// import { HeroSection, GridCategory, ImageCard, StatusCard } from '@/components/domain/Home/index';
// import { Skeleton, EmptyState } from '@/components/feedback';

// interface MainLayoutContext {
//   isLoggedIn: boolean;
// }

export function HomePage() {
  // const navigate = useNavigate();
  // const { isLoggedIn } = useOutletContext<MainLayoutContext>();

  return (
    <PageContainer className={styles.pageContainer}>
      <BentoGrid>
        {/* Row 1 */}
        {/* Main Hero (3x2) - Expanded to 3 columns */}
        <BentoItem colSpan={3} rowSpan={2}>
          <HeroBlock />
        </BentoItem>

        {/* User Status (1x1) - Placed next to Hero */}
        <BentoItem colSpan={1} rowSpan={1}>
          <StatusBlock />
        </BentoItem>

        {/* Row 2 (Partial fill due to Hero rowSpan=2) */}
        {/* Active Challenge (1x2) - Vertical Poster, placed under Status */}
        <BentoItem colSpan={1} rowSpan={2}>
          <ActiveChallengeBlock />
        </BentoItem>

        {/* Row 3 */}
        {/* Categories (3x1) - Expanded to 3 columns, fills gap below Hero */}
        <BentoItem colSpan={3} rowSpan={1}>
          <CategoryBlock />
        </BentoItem>

        {/* Feed / Today's Challenge (4x2) - Full width grid */}
        <BentoItem colSpan={4} rowSpan={2}>
          <FeedBlock />
        </BentoItem>

      </BentoGrid>
    </PageContainer>
  );
}
