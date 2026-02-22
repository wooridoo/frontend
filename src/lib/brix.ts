import type { BrixGrade, BrixConfig } from '@/types/brix';

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
export const GRADE_CONFIG: Record<BrixGrade, BrixConfig> = {
  HONEY: { label: '꿀', emoji: '🍯', brixVariant: 'honey' }, // ?? ??
  GRAPE: { label: '포도', emoji: '🍇', brixVariant: 'grape' }, // ?? ??
  APPLE: { label: '사과', emoji: '🍎', brixVariant: 'apple' }, // ?? ??
  TANGERINE: { label: '귤', emoji: '🍊', brixVariant: 'mandarin' }, // ?? ??
  TOMATO: { label: '토마토', emoji: '🍅', brixVariant: 'tomato' }, // ?? ??
  BITTER: { label: '쓴맛', emoji: '🥒', brixVariant: 'bitter' }, // ?? ??
};

/**
    * 동작 설명은 추후 세분화 예정입니다.
    * 동작 설명은 추후 세분화 예정입니다.
 */
export function getBrixGrade(score: number | undefined | null): BrixGrade {
  if (score === undefined || score === null) return 'TOMATO'; // ?? ??
  if (score >= 60) return 'HONEY';
  if (score >= 40) return 'GRAPE';
  if (score >= 25) return 'APPLE';
  if (score >= 12) return 'TANGERINE';
  if (score >= 0) return 'TOMATO';
  return 'BITTER';
}

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
export function formatBrix(score: number | undefined | null): string {
  return (score ?? 0).toFixed(1);
}

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
export function getBrixConfig(score: number): BrixConfig {
  const grade = getBrixGrade(score);
  return GRADE_CONFIG[grade];
}
