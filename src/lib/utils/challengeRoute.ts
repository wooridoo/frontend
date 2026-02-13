export const CHALLENGE_SLUG_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const CHALLENGE_SEGMENT_SEPARATOR = '--';
const CHALLENGE_ROUTE_MAP_STORAGE_KEY = 'challenge-route-map-v1';

const fromBase64Url = (value: string): string => {
  if (typeof atob !== 'function') return value;
  const padded = value.replace(/-/g, '+').replace(/_/g, '/');
  const normalized = padded + '='.repeat((4 - (padded.length % 4)) % 4);
  try {
    return atob(normalized);
  } catch {
    return value;
  }
};

const isUuid = (value: string): boolean => CHALLENGE_SLUG_REGEX.test(value);
const isNumericId = (value: string): boolean => /^\d+$/.test(value);
const isChallengeId = (value: string): boolean => isUuid(value) || isNumericId(value);

const extractChallengeToken = (value: string): string => {
  if (!value) return value;
  const segments = value.split(CHALLENGE_SEGMENT_SEPARATOR);
  return segments[segments.length - 1];
};

const readRouteMap = (): Record<string, string> => {
  if (typeof window === 'undefined') return {};

  try {
    const raw = window.localStorage.getItem(CHALLENGE_ROUTE_MAP_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object') return {};
    return parsed as Record<string, string>;
  } catch {
    return {};
  }
};

const writeRouteMap = (routeMap: Record<string, string>): void => {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(CHALLENGE_ROUTE_MAP_STORAGE_KEY, JSON.stringify(routeMap));
  } catch {
    // Ignore storage failures (quota/private mode).
  }
};

const resolveLegacyChallengeId = (value: string): string => {
  const raw = String(value || '').trim();
  if (!raw) return raw;
  if (isChallengeId(raw)) return raw;

  const token = extractChallengeToken(raw);
  if (isChallengeId(token)) return token;

  const decoded = fromBase64Url(token);
  if (isChallengeId(decoded)) return decoded;

  return raw;
};

const findSlugById = (challengeId: string): string | null => {
  const routeMap = readRouteMap();
  for (const [slug, mappedId] of Object.entries(routeMap)) {
    if (mappedId === challengeId) return slug;
  }
  return null;
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

export function rememberChallengeRoute(challengeRef: string | number, challengeTitle?: string): void {
  const titleSlug = toChallengeTitleSlug(challengeTitle);
  const challengeId = resolveLegacyChallengeId(String(challengeRef));

  if (!titleSlug || !isChallengeId(challengeId)) return;

  const routeMap = readRouteMap();
  if (routeMap[titleSlug] === challengeId) return;

  routeMap[titleSlug] = challengeId;
  writeRouteMap(routeMap);
}

export function toChallengeSlug(challengeRef: string, challengeTitle?: string): string {
  const raw = String(challengeRef || '').trim();
  if (!raw) return raw;

  const titleSlug = toChallengeTitleSlug(challengeTitle);
  const legacyResolved = resolveLegacyChallengeId(raw);

  // Canonical URL format: /{title-slug}/challenge
  if (titleSlug) {
    rememberChallengeRoute(legacyResolved, challengeTitle);
    return titleSlug;
  }

  // Legacy URL format compatibility: {title}--{token}
  if (raw.includes(CHALLENGE_SEGMENT_SEPARATOR)) {
    const [legacyTitle] = raw.split(CHALLENGE_SEGMENT_SEPARATOR);
    if (legacyTitle) {
      const legacyTitleSlug = toChallengeTitleSlug(legacyTitle);
      if (legacyTitleSlug && isChallengeId(legacyResolved)) {
        rememberChallengeRoute(legacyResolved, legacyTitleSlug);
        return legacyTitleSlug;
      }
    }
  }

  // If only challengeId is available, reuse remembered slug if possible.
  if (isChallengeId(legacyResolved)) {
    const rememberedSlug = findSlugById(legacyResolved);
    if (rememberedSlug) return rememberedSlug;
    return legacyResolved;
  }

  return raw;
}

export function resolveChallengeId(slugOrId: string | undefined | null): string {
  const raw = String(slugOrId || '').trim();
  if (!raw) return raw;

  const legacyResolved = resolveLegacyChallengeId(raw);
  if (isChallengeId(legacyResolved)) return legacyResolved;

  // Slug-only route: resolve from cached map first.
  const routeMap = readRouteMap();
  const mappedId = routeMap[raw];
  if (mappedId) return mappedId;

  return raw;
}
