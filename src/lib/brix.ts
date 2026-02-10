import type { BrixGrade, BrixConfig } from '@/types/brix';

export const GRADE_CONFIG: Record<BrixGrade, BrixConfig> = {
  HONEY: { label: '꿀', emoji: '🍯', brixVariant: 'honey' }, // 60+
  GRAPE: { label: '포도', emoji: '🍇', brixVariant: 'grape' }, // 40-60
  APPLE: { label: '사과', emoji: '🍎', brixVariant: 'apple' }, // 25-40
  TANGERINE: { label: '귤', emoji: '🍊', brixVariant: 'mandarin' }, // 12-25
  TOMATO: { label: '토마토', emoji: '🍅', brixVariant: 'tomato' }, // 0-12
  BITTER: { label: '쓴맛', emoji: '🥒', brixVariant: 'bitter' }, // < 0
};

/**
 * Get Brix Grade based on score
 * Based on USER_BRIX_SYSTEM.md Section 8
 */
export function getBrixGrade(score: number | undefined | null): BrixGrade {
  if (score === undefined || score === null) return 'TOMATO'; // Default grade
  if (score >= 60) return 'HONEY';
  if (score >= 40) return 'GRAPE';
  if (score >= 25) return 'APPLE';
  if (score >= 12) return 'TANGERINE';
  if (score >= 0) return 'TOMATO';
  return 'BITTER';
}

/**
 * Format Brix score to 1 decimal place
 */
export function formatBrix(score: number | undefined | null): string {
  return (score ?? 0).toFixed(1);
}

/**
 * Get Grade Config for a given score
 */
export function getBrixConfig(score: number): BrixConfig {
  const grade = getBrixGrade(score);
  return GRADE_CONFIG[grade];
}
