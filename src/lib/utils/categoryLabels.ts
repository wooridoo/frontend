/**
 * Category Labels Utility
 * 카테고리 enum → 한글 라벨 매핑 (공통 사용)
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
 * 카테고리 enum 값을 한글 라벨로 변환
 */
export function getCategoryLabel(category: string): string {
  return CATEGORY_LABELS[category] || category;
}
