export const CHALLENGE_SLUG_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const CHALLENGE_SEGMENT_SEPARATOR = '--';

const toBase64Url = (value: string): string =>
  btoa(value)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');

const fromBase64Url = (value: string): string => {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/');
  const normalized = padded + '='.repeat((4 - (padded.length % 4)) % 4);
  try {
    return atob(normalized);
  } catch {
    return value;
  }
};

const isUuid = (value: string): boolean => CHALLENGE_SLUG_REGEX.test(value);

const extractChallengeToken = (value: string): string => {
  if (!value) return value;
  const segments = value.split(CHALLENGE_SEGMENT_SEPARATOR);
  return segments[segments.length - 1];
};

export function toChallengeTitleSlug(title: string | undefined | null): string {
  const raw = String(title || '').trim().toLowerCase();
  if (!raw) return '';

  return raw
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9\uac00-\ud7a3-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function toChallengeSlug(challengeRef: string, challengeTitle?: string): string {
  const raw = String(challengeRef || '').trim();
  if (!raw) return raw;

  const token = isUuid(raw) ? toBase64Url(raw) : raw;
  const titleSlug = toChallengeTitleSlug(challengeTitle);

  if (!titleSlug) return token;

  const alreadySlug = raw.includes(CHALLENGE_SEGMENT_SEPARATOR)
    && (isUuid(resolveChallengeId(raw)) || /^\d+$/.test(extractChallengeToken(raw)));

  if (alreadySlug) return raw;

  return `${titleSlug}${CHALLENGE_SEGMENT_SEPARATOR}${token}`;
}

export function resolveChallengeId(slugOrId: string | undefined | null): string {
  const raw = String(slugOrId || '').trim();
  if (!raw) return raw;
  if (isUuid(raw)) return raw;

  const token = extractChallengeToken(raw);
  if (isUuid(token)) return token;

  const decoded = fromBase64Url(token);
  if (isUuid(decoded)) return decoded;
  if (/^\d+$/.test(token)) return token;
  return raw;
}


