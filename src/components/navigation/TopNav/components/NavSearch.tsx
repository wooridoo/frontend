import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { SearchIcon } from '@/components/ui/Icons';
import styles from './NavSearch.module.css';

interface NavSearchProps {
  className?: string;
}

export function NavSearch({ className }: NavSearchProps) {
  const navigate = useNavigate();

  return (
    <div className={clsx(styles.root, className)}>
      <div className={styles.searchWrapper}>
        <SearchIcon className={styles.searchIcon} size={20} color="var(--color-grey-500)" />
        <input
          type="text"
          placeholder="챌린지를 검색하세요"
          className={styles.searchInput}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const target = e.target as HTMLInputElement;
              navigate(`/explore?q=${target.value}`);
            }
          }}
        />
      </div>
    </div>
  );
}
