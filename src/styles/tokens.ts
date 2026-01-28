/**
 * WDS TypeScript Design Tokens
 * Mirror of CSS tokens for JS usage
 */

export const colors = {
  // Primary (Mandarin Orange)
  orange500: '#E9481E',
  orange600: '#D43D16',
  orange50: '#FFF7ED',

  // Grey Scale
  grey900: '#1C1917',
  grey700: '#44403C',
  grey500: '#78716C',
  grey300: '#D6D3D1',
  grey100: '#F5F5F4',
  grey50: '#FAFAF9',

  // Semantic
  income: '#F59E0B',
  expense: '#1C1917',
  locked: '#78716C',
  success: '#16A34A',
  error: '#DC2626',
  warning: '#F59E0B',
  info: '#E9481E',

  // Brix Scale
  brixHoney: '#F59E0B',
  brixGrape: '#9333EA',
  brixApple: '#F43F5E',
  brixMandarin: '#E9481E',
  brixTomato: '#FCA5A5',
  brixBitter: '#14532D',
} as const;

export const spacing = {
  0: '0px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
} as const;

export const radius = {
  sm: '8px',
  md: '12px',
  lg: '20px',
  xl: '24px',
  full: '9999px',
} as const;

export const fontSize = {
  xs: '11px',
  sm: '13px',
  base: '15px',
  md: '17px',
  lg: '20px',
  xl: '24px',
  '2xl': '28px',
} as const;

export const fontWeight = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

export const motion = {
  durationFast: '150ms',
  durationNormal: '250ms',
  durationSlow: '400ms',
  easeStandard: 'cubic-bezier(0.4, 0, 0.2, 1)',
  easeDecelerate: 'cubic-bezier(0, 0, 0.2, 1)',
  easeAccelerate: 'cubic-bezier(0.4, 0, 1, 1)',
} as const;

export const zIndex = {
  dropdown: 100,
  sticky: 200,
  modal: 300,
  toast: 400,
  tooltip: 500,
} as const;

// Brix Level Helper
export type BrixLevel = 'honey' | 'grape' | 'apple' | 'mandarin' | 'tomato' | 'bitter';

export const getBrixColor = (score: number): string => {
  if (score >= 60) return colors.brixHoney;
  if (score >= 40) return colors.brixGrape;
  if (score >= 25) return colors.brixApple;
  if (score >= 12) return colors.brixMandarin;
  if (score >= 0) return colors.brixTomato;
  return colors.brixBitter;
};

export const getBrixEmoji = (score: number): string => {
  if (score >= 60) return '🍯';
  if (score >= 40) return '🍇';
  if (score >= 25) return '🍎';
  if (score >= 12) return '🍊';
  if (score >= 0) return '🍅';
  return '🥒';
};
