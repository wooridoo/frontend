export const CHALLENGE_SLUG_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

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

export function toChallengeSlug(challengeId: string): string {
  const raw = String(challengeId || '').trim();
  if (!raw) return raw;
  if (!isUuid(raw)) return raw;
  return toBase64Url(raw);
}

export function resolveChallengeId(slugOrId: string | undefined | null): string {
  const raw = String(slugOrId || '').trim();
  if (!raw) return raw;
  if (isUuid(raw)) return raw;

  const decoded = fromBase64Url(raw);
  return isUuid(decoded) ? decoded : raw;
}


