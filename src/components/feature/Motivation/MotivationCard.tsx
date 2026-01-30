import { useCompletion } from '@ai-sdk/react'; // Vercel AI SDK
import clsx from 'clsx';
import { Sparkles, RefreshCw } from 'lucide-react';
import styles from './MotivationCard.module.css';

interface MotivationCardProps {
  category?: string;
  className?: string;
}

export function MotivationCard({ category = '저축', className }: MotivationCardProps) {
  const { completion, complete, isLoading } = useCompletion({
    api: '/api/completion', // Endpoint managed by MSW or Spring
  });

  const handleGenerate = () => {
    complete(`Generate a short, encouraging motivation quote about ${category} in Korean.`);
  };

  return (
    <div className={clsx(styles.card, className)}>
      <div className={styles.header}>
        <div className={styles.title}>
          <span className={styles.icon}>💬</span>
          <span>오늘의 응원</span>
        </div>
      </div>

      <div className={styles.content}>
        {completion ? (
          <>
            {completion}
            {isLoading && <span className={styles.cursor} />}
          </>
        ) : (
          <span className={styles.placeholder}>
            {isLoading ? '응원 메시지를 적고 있어요...' : '버튼을 눌러 오늘의 힘이 되는 한마디를 받아보세요!'}
          </span>
        )}
      </div>

      <div className={styles.actions}>
        <button
          className={styles.generateButton}
          onClick={handleGenerate}
          disabled={isLoading}
        >
          {isLoading ? (
            <RefreshCw className="animate-spin" size={16} />
          ) : (
            <Sparkles size={16} />
          )}
          {isLoading ? '생성 중...' : '새로운 응원 받기'}
        </button>
      </div>
    </div>
  );
}
