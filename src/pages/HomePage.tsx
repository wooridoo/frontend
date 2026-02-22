import { useNavigate } from 'react-router-dom';
import { BentoGrid, BentoItem } from '@/components/domain/Home/Bento/BentoGrid';
import { HeroBlock } from '@/components/domain/Home/Bento/Blocks/HeroBlock';
import { StatusBlock } from '@/components/domain/Home/Bento/Blocks/StatusBlock';
import { ActiveChallengeBlock } from '@/components/domain/Home/Bento/Blocks/ActiveChallengeBlock';
import { CategoryBlock } from '@/components/domain/Home/Bento/Blocks/CategoryBlock';
import { FeedBlock } from '@/components/domain/Home/Bento/Blocks/FeedBlock';
import { PageContainer } from '@/components/layout';
import { FAB } from '@/components/ui';
import { CHALLENGE_ROUTES } from '@/routes/challengePaths';
import styles from './HomePage.module.css';

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
export function HomePage() {
  const navigate = useNavigate();

  const handleCreateChallenge = () => {
    navigate(CHALLENGE_ROUTES.NEW);
  };

  return (
    <PageContainer variant="content" contentWidth="full" className={styles.pageContainer}>
      <BentoGrid>
        {/* 보조 설명 */}
        {/* 보조 설명 */}
        <BentoItem colSpan={3} rowSpan={2}>
          <HeroBlock />
        </BentoItem>

        {/* 보조 설명 */}
        <BentoItem colSpan={1} rowSpan={1}>
          <StatusBlock />
        </BentoItem>

        {/* 보조 설명 */}
        {/* 보조 설명 */}
        <BentoItem colSpan={1} rowSpan={2}>
          <ActiveChallengeBlock />
        </BentoItem>

        {/* 보조 설명 */}
        {/* 보조 설명 */}
        <BentoItem colSpan={3} rowSpan={1}>
          <CategoryBlock />
        </BentoItem>

        {/* 보조 설명 */}
        <BentoItem colSpan={4} rowSpan={2}>
          <FeedBlock />
        </BentoItem>

      </BentoGrid>

      {/* 보조 설명 */}
      <FAB
        variant="primary"
        size="lg"
        position="bottomRight"
        onClick={handleCreateChallenge}
        aria-label="새 챌린지 만들기"
      />
    </PageContainer>
  );
}
