/**
 * Formatter Utilities
 */

/**
 * 통화 포맷팅 (원화)
 * @example 10000 -> ₩10,000
 * @example 10000 -> 10,000원 (withSuffix: true)
 */
// options: withSuffix(원 접미사), symbol(기호 표시 여부, 기본값 true)
export function formatCurrency(amount: number, options?: { withSuffix?: boolean; symbol?: boolean }): string {
    const formatted = new Intl.NumberFormat('ko-KR').format(amount);
    if (options?.symbol === false) return formatted;
    return options?.withSuffix ? `${formatted}원` : `₩${formatted}`;
}

/**
 * 날짜 포맷팅 (YYYY-MM-DD)
 */
export function formatDate(dateStr: string): string {
    return new Date(dateStr).toISOString().split('T')[0];
}

/**
 * D-Day 계산
 */
export function getDDay(targetDateStr: string): string {
    const targetDate = new Date(targetDateStr);
    const now = new Date();

    // Reset time part for accurate date diff
    targetDate.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);

    const diffTime = targetDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'D-Day';
    if (diffDays > 0) return `D-${diffDays}`;
    return `D+${Math.abs(diffDays)}`;
}
