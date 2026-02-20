import type { IconName } from './iconRegistry';

type LottieModule = { default: object };
type LottieLoader = () => Promise<LottieModule>;

export const lottieRegistry: Partial<Record<IconName, LottieLoader>> = {
  action: () => import('@/assets/lottie/icons/action.json'),
  empty: () => import('@/assets/lottie/icons/empty.json'),
  feed: () => import('@/assets/lottie/icons/feed.json'),
  hero: () => import('@/assets/lottie/icons/hero.json'),
  ledger: () => import('@/assets/lottie/icons/ledger.json'),
  meeting: () => import('@/assets/lottie/icons/meeting.json'),
  member: () => import('@/assets/lottie/icons/member.json'),
  success: () => import('@/assets/lottie/icons/success.json'),
  vote: () => import('@/assets/lottie/icons/vote.json'),
  wallet: () => import('@/assets/lottie/icons/wallet.json'),
  warning: () => import('@/assets/lottie/icons/warning.json'),
  brixBadge: () => import('@/assets/lottie/brix/brix-badge.json'),
  categoryCulture: () => import('@/assets/lottie/categories/category-culture.json'),
  categoryExercise: () => import('@/assets/lottie/categories/category-exercise.json'),
  categoryStudy: () => import('@/assets/lottie/categories/category-study.json'),
  categoryHobby: () => import('@/assets/lottie/categories/category-hobby.json'),
  categorySavings: () => import('@/assets/lottie/categories/category-savings.json'),
  categoryTravel: () => import('@/assets/lottie/categories/category-travel.json'),
  categoryFood: () => import('@/assets/lottie/categories/category-food.json'),
  categoryOther: () => import('@/assets/lottie/categories/category-other.json'),
};
