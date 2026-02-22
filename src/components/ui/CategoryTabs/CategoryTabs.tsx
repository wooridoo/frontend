import { useRef } from 'react';
import clsx from 'clsx';
import styles from './CategoryTabs.module.css';

interface Category {
  id: string;
  label: string;
  icon?: string;
}

interface CategoryTabsProps {
  className?: string;
  categories: Category[];
  selectedId?: string;
  onSelect?: (category: Category) => void;
}

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
export function CategoryTabs({
  className,
  categories,
  selectedId,
  onSelect,
}: CategoryTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className={clsx(styles.wrapper, className)}>
      <button
        type="button"
        className={clsx(styles.scrollButton, styles.left)}
        onClick={() => handleScroll('left')}
        aria-label="이전 카테고리"
      >
        ◀
      </button>

      <div ref={scrollRef} className={styles.tabList}>
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            className={clsx(
              styles.tab,
              selectedId === category.id && styles.selected
            )}
            onClick={() => onSelect?.(category)}
          >
            {category.icon && <span className={styles.icon}>{category.icon}</span>}
            <span className={styles.label}>{category.label}</span>
          </button>
        ))}
      </div>

      <button
        type="button"
        className={clsx(styles.scrollButton, styles.right)}
        onClick={() => handleScroll('right')}
        aria-label="다음 카테고리"
      >
        ▶
      </button>
    </div>
  );
}

export type { CategoryTabsProps, Category };
