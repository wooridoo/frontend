import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { Icon } from '@/components/ui';
import { PATHS } from '@/routes/paths';
import styles from './NavSearch.module.css';

interface NavSearchProps {
  className?: string;
}

/**
 * 상단 검색 입력 컴포넌트입니다.
 * Enter 입력 시 탐색 페이지로 검색어를 전달합니다.
 */
export function NavSearch({ className }: NavSearchProps) {
  const navigate = useNavigate();

  return (
    <div className={clsx(styles.root, className)}>
      <div className={styles.searchWrapper}>
        <Icon className={styles.searchIcon} name="search" size={20} />
        <input
          type="text"
          placeholder="챌린지를 검색하세요"
          className={styles.searchInput}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const target = e.target as HTMLInputElement;
              const query = target.value.trim();
              if (!query) {
                navigate(PATHS.EXPLORE);
                return;
              }
              navigate(`${PATHS.EXPLORE}?q=${encodeURIComponent(query)}`);
            }
          }}
        />
      </div>
    </div>
  );
}
