import type { IconName } from './iconRegistry';
import { loadRemoteLottie } from './lottieLoader';
import { lottieRemoteManifest } from './lottieRemoteManifest';

type LottieModule = { default: object };
export type LottieLoader = () => Promise<LottieModule>;

function toLottieLoader(name: IconName): LottieLoader | undefined {
  const entry = lottieRemoteManifest[name];
  if (!entry) return undefined;

  return async () => {
    const payload = await loadRemoteLottie(entry);
    if (!payload) {
      throw new Error(`lottie load failed: ${name}`);
    }
    return { default: payload };
  };
}

const names = Object.keys(lottieRemoteManifest) as IconName[];

/**
 * 원격 매니페스트 기반 Lottie 로더 레지스트리입니다.
 */
export const lottieRegistry: Partial<Record<IconName, LottieLoader>> = names.reduce(
  (acc, name) => {
    const loader = toLottieLoader(name);
    if (loader) {
      acc[name] = loader;
    }
    return acc;
  },
  {} as Partial<Record<IconName, LottieLoader>>
);

/**
 * 단일 Lottie 키를 사전 로드합니다.
 */
export async function preloadLottie(name: IconName) {
  const loader = lottieRegistry[name];
  if (!loader) return;
  await loader().catch(() => undefined);
}

/**
 * preload 플래그가 지정된 Lottie들을 선로딩합니다.
 */
export function preloadConfiguredLotties() {
  const namesToPreload = (Object.keys(lottieRemoteManifest) as IconName[]).filter(name => {
    const entry = lottieRemoteManifest[name];
    return Boolean(entry?.preload);
  });

  namesToPreload.forEach(name => {
    void preloadLottie(name);
  });
}
