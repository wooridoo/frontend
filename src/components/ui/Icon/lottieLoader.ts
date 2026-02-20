import type { RemoteLottieEntry } from './lottieRemoteManifest';

const DEFAULT_TIMEOUT_MS = 2200;
const ALLOWED_HOST_SUFFIXES = ['.lottiefiles.com'];
const ALLOWED_HOSTS = new Set(['lottie.host']);

const loadedCache = new Map<string, object>();
const failedCache = new Set<string>();
const inflightCache = new Map<string, Promise<object | null>>();
const warnedKeys = new Set<string>();

function isAllowedHost(hostname: string) {
  if (ALLOWED_HOSTS.has(hostname)) return true;
  return ALLOWED_HOST_SUFFIXES.some(suffix => hostname.endsWith(suffix));
}

function warnOnce(key: string, message: string) {
  if (warnedKeys.has(key)) return;
  warnedKeys.add(key);
  console.warn(message);
}

async function fetchAnimationJson(url: string, timeoutMs: number) {
  const controller = new AbortController();
  const timeoutId = globalThis.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      method: 'GET',
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`lottie fetch failed (${response.status})`);
    }

    const payload: unknown = await response.json();
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
      throw new Error('invalid lottie payload');
    }

    return payload as object;
  } finally {
    globalThis.clearTimeout(timeoutId);
  }
}

export async function loadRemoteLottie(entry: RemoteLottieEntry): Promise<object | null> {
  if (typeof fetch !== 'function') {
    warnOnce(entry.url, '[lottie] fetch api unavailable');
    failedCache.add(entry.url);
    return null;
  }

  let parsedUrl: URL;

  try {
    parsedUrl = new URL(entry.url);
  } catch {
    warnOnce(entry.url, `[lottie] invalid url "${entry.url}"`);
    failedCache.add(entry.url);
    return null;
  }

  if (parsedUrl.protocol !== 'https:') {
    warnOnce(entry.url, `[lottie] blocked non-https url "${entry.url}"`);
    failedCache.add(entry.url);
    return null;
  }

  if (!isAllowedHost(parsedUrl.hostname)) {
    warnOnce(entry.url, `[lottie] blocked host "${parsedUrl.hostname}"`);
    failedCache.add(entry.url);
    return null;
  }

  if (loadedCache.has(entry.url)) {
    return loadedCache.get(entry.url) ?? null;
  }

  if (failedCache.has(entry.url)) {
    return null;
  }

  const inflight = inflightCache.get(entry.url);
  if (inflight) return inflight;

  const request = fetchAnimationJson(entry.url, entry.timeoutMs ?? DEFAULT_TIMEOUT_MS)
    .then(payload => {
      loadedCache.set(entry.url, payload);
      return payload;
    })
    .catch(error => {
      failedCache.add(entry.url);
      warnOnce(entry.url, `[lottie] failed to load "${entry.url}": ${String(error)}`);
      return null;
    })
    .finally(() => {
      inflightCache.delete(entry.url);
    });

  inflightCache.set(entry.url, request);
  return request;
}
