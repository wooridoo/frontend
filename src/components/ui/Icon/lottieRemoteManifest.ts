import type { IconName } from './iconRegistry';

export interface RemoteLottieEntry {
  url: string;
  timeoutMs?: number;
  fallbackName: IconName;
  renderScale?: number;
  preload?: boolean;
}

/**
    * 동작 설명은 추후 세분화 예정입니다.
    * 동작 설명은 추후 세분화 예정입니다.
 */
export const lottieRemoteManifest: Partial<Record<IconName, RemoteLottieEntry>> = {
  action: {
    url: 'https://assets10.lottiefiles.com/packages/lf20_touohxv0.json',
    fallbackName: 'action',
  },
  empty: {
    url: 'https://assets9.lottiefiles.com/packages/lf20_jcikwtux.json',
    fallbackName: 'empty',
  },
  feed: {
    url: 'https://assets5.lottiefiles.com/packages/lf20_t24tpvcu.json',
    fallbackName: 'feed',
  },
  hero: {
    url: 'https://assets7.lottiefiles.com/packages/lf20_7fCbvNSmFD.json',
    fallbackName: 'hero',
  },
  heroCreate: {
    url: 'https://assets7.lottiefiles.com/packages/lf20_ydo1amjm.json',
    fallbackName: 'heroCreate',
    renderScale: 1.6,
    preload: true,
  },
  heroExplore: {
    url: 'https://assets4.lottiefiles.com/packages/lf20_4kx2q32n.json',
    fallbackName: 'heroExplore',
    renderScale: 1.6,
    preload: true,
  },
  ledger: {
    url: 'https://assets3.lottiefiles.com/packages/lf20_x62chJ.json',
    fallbackName: 'ledger',
  },
  meeting: {
    url: 'https://assets6.lottiefiles.com/packages/lf20_iwmd6pyr.json',
    fallbackName: 'meeting',
  },
  member: {
    url: 'https://assets8.lottiefiles.com/packages/lf20_puciaact.json',
    fallbackName: 'member',
  },
  success: {
    url: 'https://assets1.lottiefiles.com/packages/lf20_kkflmtur.json',
    fallbackName: 'success',
  },
  vote: {
    url: 'https://assets2.lottiefiles.com/private_files/lf30_t26law.json',
    fallbackName: 'vote',
  },
  wallet: {
    url: 'https://assets3.lottiefiles.com/packages/lf20_xlkxtmul.json',
    fallbackName: 'wallet',
  },
  warning: {
    url: 'https://assets5.lottiefiles.com/packages/lf20_jbrw3hcz.json',
    fallbackName: 'warning',
  },
  brixBadge: {
    url: 'https://lottie.host/753efe02-9bf9-43f7-8560-8e2ad1978b6c/JOcswhdJsa.json',
    fallbackName: 'brixBadge',
    renderScale: 2.1,
    preload: true,
  },
  categoryCulture: {
    url: 'https://assets2.lottiefiles.com/packages/lf20_j1adxtyb.json',
    fallbackName: 'categoryCulture',
    renderScale: 1.6,
    preload: true,
  },
  categoryExercise: {
    url: 'https://assets2.lottiefiles.com/packages/lf20_u4yrau.json',
    fallbackName: 'categoryExercise',
    renderScale: 1.6,
    preload: true,
  },
  categoryStudy: {
    url: 'https://assets2.lottiefiles.com/packages/lf20_ysas4vcp.json',
    fallbackName: 'categoryStudy',
    renderScale: 1.6,
    preload: true,
  },
  categoryHobby: {
    url: 'https://assets2.lottiefiles.com/packages/lf20_2LdLki.json',
    fallbackName: 'categoryHobby',
    renderScale: 1.6,
    preload: true,
  },
  categorySavings: {
    url: 'https://assets3.lottiefiles.com/packages/lf20_2ks3pjua.json',
    fallbackName: 'categorySavings',
    renderScale: 1.6,
    preload: true,
  },
  categoryTravel: {
    url: 'https://assets3.lottiefiles.com/packages/lf20_2cwDXD.json',
    fallbackName: 'categoryTravel',
    renderScale: 1.6,
    preload: true,
  },
  categoryFood: {
    url: 'https://assets3.lottiefiles.com/packages/lf20_jtbfg2nb.json',
    fallbackName: 'categoryFood',
    renderScale: 1.6,
    preload: true,
  },
  categoryOther: {
    url: 'https://assets4.lottiefiles.com/packages/lf20_zrqthn6o.json',
    fallbackName: 'categoryOther',
    renderScale: 1.6,
    preload: true,
  },
};
