/**
    * 동작 설명은 추후 세분화 예정입니다.
    * 동작 설명은 추후 세분화 예정입니다.
 */

export const CATEGORY_LABELS: Record<string, string> = {
  HOBBY: '취미',
  STUDY: '학습',
  EXERCISE: '운동',
  SAVINGS: '저축',
  TRAVEL: '여행',
  FOOD: '음식',
  CULTURE: '문화',
  OTHER: '기타',
};

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
export function getCategoryLabel(category: string): string {
  return CATEGORY_LABELS[category] || category;
}
