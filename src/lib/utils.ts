import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { ClassValue } from 'clsx';

/**
 * 동적 클래스 조합을 병합해 중복 클래스를 정리합니다.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 원화 금액 문자열을 포맷합니다.
    * 동작 설명은 추후 세분화 예정입니다.
    * 동작 설명은 추후 세분화 예정입니다.
 */
export function formatCurrency(amount: number, options?: { withSuffix?: boolean; symbol?: boolean }): string {
  const formatted = new Intl.NumberFormat('ko-KR').format(amount);
  const useSuffix = options?.withSuffix ?? true;
  if (options?.symbol === false) return formatted;
  return useSuffix ? `${formatted}원` : `₩${formatted}`;
}

/**
 * 숫자를 천 단위 콤마 형식으로 변환합니다.
 */
export function formatNumber(amount: number): string {
  return new Intl.NumberFormat('ko-KR').format(amount);
}

/**
 * 기준 시간 대비 상대 시간을 한국어 문자열로 반환합니다.
 */
export function formatDistanceToNow(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return '방금 전';
  if (diffMin < 60) return `${diffMin}분 전`;
  if (diffHour < 24) return `${diffHour}시간 전`;
  if (diffDay < 7) return `${diffDay}일 전`;
  if (diffDay < 30) return `${Math.floor(diffDay / 7)}주 전`;
  if (diffDay < 365) return `${Math.floor(diffDay / 30)}개월 전`;
  return `${Math.floor(diffDay / 365)}년 전`;
}

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toISOString().split('T')[0];
}

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
export function getDDay(targetDateStr: string): string {
  const targetDate = new Date(targetDateStr);
  const now = new Date();

  // 날짜 비교 오차를 방지하기 위해 시/분/초를 제거합니다.
  targetDate.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);

  const diffTime = targetDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'D-Day';
  if (diffDays > 0) return `D-${diffDays}`;
  return `D+${Math.abs(diffDays)}`;
}
