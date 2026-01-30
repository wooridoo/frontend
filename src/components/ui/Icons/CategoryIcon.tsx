import clsx from 'clsx';
import styles from './Icons.module.css';

export interface CategoryIconProps {
  type: 'savings' | 'exercise' | 'reading' | 'diet' | 'hobby' | 'study' | 'miracle' | 'all';
  className?: string;
  size?: number;
  isActive?: boolean;
}

export function CategoryIcon({ type, className, size = 48, isActive = false }: CategoryIconProps) {
  // Define icons or paths based on type
  // For now, using simple shapes/emojis as placeholders or simple paths
  // In a real scenario, these would be complex paths matching the wireframe

  const getIconContent = () => {
    switch (type) {
      case 'savings': // Piggy Bank-ish
        return <path d="M19 14c1.1 0 2 .9 2 2 0 2.2-1.8 4-4 4H8c-2.2 0-4-1.8-4-4 0-1.1.9-2 2-2h13zM12 2a4 4 0 014 4h-2a2 2 0 00-4 0H8a4 4 0 014-4z" fill="currentColor" />;
      case 'exercise': // Dumbbell
        return <path d="M6 5h12v2H6V5zm0 12h12v2H6v-2zm-3-8h18v6H3V9z" fill="currentColor" />;
      case 'miracle': // Sun
        return <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 9c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.93c.39-.39.39-1.02 0-1.41-.39-.39-1.02-.39-1.41 0l-1.42 1.42c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l1.42-1.42zm12.37 12.37c.39-.39.39-1.02 0-1.41-.39-.39-1.02-.39-1.41 0l-1.42 1.42c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l1.42-1.42zm1.41-10.95c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41l-1.42-1.42c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41l1.42 1.42zM4.93 19.07c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41l-1.42-1.42c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41l1.42 1.42z" fill="currentColor" />;
      default: // Star for 'all' or others
        return <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor" />;
    }
  };

  return (
    <div
      className={clsx(styles.categoryIconRoot, isActive && styles.active, className)}
      style={{ width: size, height: size }}
    >
      <svg
        width={size * 0.6}
        height={size * 0.6}
        viewBox="0 0 24 24"
        fill={isActive ? 'white' : 'var(--color-grey-600)'}
        xmlns="http://www.w3.org/2000/svg"
      >
        {getIconContent()}
      </svg>
    </div>
  );
}
