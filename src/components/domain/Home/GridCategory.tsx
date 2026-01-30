import clsx from 'clsx';
import { CategoryIcon, type CategoryIconProps } from '@/components/ui/Icons';
import styles from './GridCategory.module.css';

interface CategoryItem {
  id: string;
  label: string;
  type: CategoryIconProps['type'];
}

interface GridCategoryProps {
  categories: CategoryItem[];
  selectedCategory: string;
  onSelect: (id: string) => void;
  className?: string;
}

export function GridCategory({
  categories,
  selectedCategory,
  onSelect,
  className
}: GridCategoryProps) {
  return (
    <div className={clsx(styles.grid, className)}>
      {categories.map((cat) => (
        <button
          key={cat.id}
          className={clsx(
            styles.item,
            selectedCategory === cat.id && styles.active
          )}
          onClick={() => onSelect(cat.id)}
          aria-pressed={selectedCategory === cat.id}
        >
          <div className={styles.iconWrapper}>
            <CategoryIcon
              type={cat.type}
              isActive={selectedCategory === cat.id}
              size={32}
            />
          </div>
          <span className={styles.label}>{cat.label}</span>
        </button>
      ))}
    </div>
  );
}
