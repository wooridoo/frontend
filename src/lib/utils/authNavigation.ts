export function isSafeInternalPath(target: string | null | undefined): target is string {
  if (!target || typeof target !== 'string') return false;
  if (!target.startsWith('/')) return false;
  if (target.startsWith('//')) return false;

  try {
    const resolved = new URL(target, window.location.origin);
    return resolved.origin === window.location.origin;
  } catch {
    return false;
  }
}

export function sanitizeReturnToPath(
  target: string | null | undefined,
  fallback: string = '/',
): string {
  return isSafeInternalPath(target) ? target : fallback;
}
