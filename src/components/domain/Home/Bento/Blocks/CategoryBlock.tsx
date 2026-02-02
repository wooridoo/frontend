import styles from './CategoryBlock.module.css';
import { LayoutGrid, BookOpen, Dumbbell, Wallet, Palette, Coffee, Apple, MoreHorizontal } from 'lucide-react';

const categories = [
  { id: 'all', label: '전체', icon: LayoutGrid },
  { id: 'exercise', label: '운동', icon: Dumbbell },
  { id: 'study', label: '학습', icon: BookOpen },
  { id: 'finance', label: '재테크', icon: Wallet },
  { id: 'hobby', label: '취미', icon: Palette },
  { id: 'life', label: '생활', icon: Coffee },
  { id: 'diet', label: '식단', icon: Apple },
  { id: 'etc', label: '기타', icon: MoreHorizontal },
];

export function CategoryBlock() {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>카테고리</h3>
      <div className={styles.grid}>
        {categories.map((cat) => (
          <button key={cat.id} className={styles.item}>
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
