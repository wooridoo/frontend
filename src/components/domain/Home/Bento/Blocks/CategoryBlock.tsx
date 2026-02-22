import styles from './CategoryBlock.module.css';
import { LayoutGrid, BookOpen, Dumbbell, Wallet, Palette, Coffee, Apple, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '@/routes/paths';

const categories = [
  { id: 'ALL', label: '전체', icon: LayoutGrid },
  { id: 'EXERCISE', label: '운동', icon: Dumbbell },
  { id: 'STUDY', label: '학습', icon: BookOpen },
  { id: 'SAVINGS', label: '재테크', icon: Wallet },
  { id: 'HOBBY', label: '취미', icon: Palette },
  { id: 'CULTURE', label: '생활', icon: Coffee },
  { id: 'FOOD', label: '식습관', icon: Apple },
  { id: 'OTHER', label: '기타', icon: MoreHorizontal },
];

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
export function CategoryBlock() {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryId: string) => {
    if (categoryId === 'ALL') {
      navigate(PATHS.EXPLORE);
    } else {
      navigate(`${PATHS.EXPLORE}?category=${categoryId}`);
    }
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>카테고리</h3>
      <div className={styles.grid}>
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={styles.item}
            onClick={() => handleCategoryClick(cat.id)}
          >
            <div className={styles.iconWrapper}>
              <cat.icon size={28} />
            </div>
            <span className={styles.label}>{cat.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
