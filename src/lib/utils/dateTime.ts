/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
export function formatUtcDateLabel(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';

  const formatter = new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'UTC',
  });

  const parts = formatter
    .formatToParts(date)
    .filter(part => part.type !== 'literal')
    .map(part => part.value);

  const [year, month, day, hour, minute] = parts;
  return `${year}.${month}.${day} ${hour}:${minute} UTC`;
}
