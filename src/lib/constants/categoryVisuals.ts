import { Category } from '@/types/enums';

export type CategoryVisualIconName =
  | 'categoryCulture'
  | 'categoryExercise'
  | 'categoryStudy'
  | 'categoryHobby'
  | 'categorySavings'
  | 'categoryTravel'
  | 'categoryFood'
  | 'categoryOther';

export interface CategoryVisual {
  label: string;
  iconName: CategoryVisualIconName;
}

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
export const CATEGORY_VISUALS: Record<Category, CategoryVisual> = {
  [Category.CULTURE]: { label: '생활습관', iconName: 'categoryCulture' },
  [Category.EXERCISE]: { label: '운동', iconName: 'categoryExercise' },
  [Category.STUDY]: { label: '공부', iconName: 'categoryStudy' },
  [Category.HOBBY]: { label: '취미', iconName: 'categoryHobby' },
  [Category.SAVINGS]: { label: '재테크', iconName: 'categorySavings' },
  [Category.TRAVEL]: { label: '여행', iconName: 'categoryTravel' },
  [Category.FOOD]: { label: '음식', iconName: 'categoryFood' },
  [Category.OTHER]: { label: '기타', iconName: 'categoryOther' },
};

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
export function getCategoryVisual(category: Category): CategoryVisual {
  return CATEGORY_VISUALS[category] ?? CATEGORY_VISUALS[Category.OTHER];
}
