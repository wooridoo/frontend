const CODE_PATTERN = /^([A-Z]+_\d{3})(?::\s*(.*))?$/;

const CODE_PREFIX_MESSAGE: Record<string, string> = {
  AUTH: '인증이 필요합니다.',
  USER: '사용자 요청을 처리할 수 없습니다.',
  CHALLENGE: '챌린지 요청을 처리할 수 없습니다.',
  MEMBER: '멤버 요청을 처리할 수 없습니다.',
  MEETING: '모임 요청을 처리할 수 없습니다.',
  VOTE: '투표 요청을 처리할 수 없습니다.',
  EXPENSE: '지출 요청을 처리할 수 없습니다.',
  ACCOUNT: '계좌 요청을 처리할 수 없습니다.',
  NOTIFICATION: '알림 요청을 처리할 수 없습니다.',
  VALIDATION: '입력값을 확인해 주세요.',
};

export interface NormalizedApiError {
  code?: string;
  rawMessage: string;
  userMessage: string;
  isMojibake: boolean;
}

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
export function parseErrorCode(rawMessage?: string | null): { code?: string; detail?: string } {
  if (!rawMessage) return {};

  const trimmed = rawMessage.trim();
  const matched = trimmed.match(CODE_PATTERN);
  if (!matched) return {};

  return {
    code: matched[1],
    detail: matched[2]?.trim(),
  };
}

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
export function detectMojibake(message?: string | null): boolean {
  if (!message) return false;
  if (message.includes('\uFFFD')) return true;

  const questionMarks = (message.match(/\?/g) || []).length;
  if (questionMarks >= 2 && questionMarks / Math.max(message.length, 1) >= 0.08) {
    return true;
  }

  return false;
}

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
export function normalizeApiError(rawMessage?: string | null): NormalizedApiError {
  const fallback = '요청 처리 중 오류가 발생했습니다.';
  const safeRaw = rawMessage?.trim() || fallback;
  const { code, detail } = parseErrorCode(safeRaw);
  const isMojibake = detectMojibake(safeRaw) || detectMojibake(detail);

  if (!code) {
    return {
      rawMessage: safeRaw,
      userMessage: isMojibake ? fallback : safeRaw,
      isMojibake,
    };
  }

  const prefix = code.split('_')[0];
  const mapped = CODE_PREFIX_MESSAGE[prefix];
  const userMessage = !isMojibake && detail ? detail : (mapped || fallback);

  return {
    code,
    rawMessage: safeRaw,
    userMessage,
    isMojibake,
  };
}
