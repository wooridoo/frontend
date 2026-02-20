import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const projectRoot = path.resolve(process.cwd());

const requiredRegistryKeys = [
  'action',
  'empty',
  'feed',
  'hero',
  'heroCreate',
  'heroExplore',
  'ledger',
  'meeting',
  'member',
  'success',
  'vote',
  'wallet',
  'warning',
  'brixBadge',
  'categoryCulture',
  'categoryExercise',
  'categoryStudy',
  'categoryHobby',
  'categorySavings',
  'categoryTravel',
  'categoryFood',
  'categoryOther',
];

const allowedHosts = new Set(['lottie.host']);
const allowedHostSuffixes = ['.lottiefiles.com'];
const denylistUrls = new Set([
  'https://assets2.lottiefiles.com/packages/lf20_vfvvjgoc.json',
  'https://assets4.lottiefiles.com/packages/lf20_q5pk6p1k.json',
  'https://assets9.lottiefiles.com/packages/lf20_r6ahj0ua.json',
  'https://assets9.lottiefiles.com/packages/lf20_cg7f6h9r.json',
]);
const denylistUrlHashes = new Set([
  '36d1d5f13a7ce80ef6afdac940c7e0e9d470a0445395726c90708b29447fcada',
  'd217ed68439472559b68eccdd0e63f428a0bc1ccb2fcc6b486ecb0cba22ae7da',
  '2c4158fa068f622e54a5939cf706ecdd81ccbffce63b6637530892aea251fefc',
  '5b9ec349e064ecd25f8e09797f01b08d1e6b091cf14b86bd5e2643bc63dad197',
]);

const failures = [];
const manifestPath = path.join(projectRoot, 'src/components/ui/Icon/lottieRemoteManifest.ts');
const iconRegistryPath = path.join(projectRoot, 'src/components/ui/Icon/iconRegistry.tsx');
const lottieRegistryPath = path.join(projectRoot, 'src/components/ui/Icon/lottieRegistry.ts');

if (!fs.existsSync(manifestPath)) {
  failures.push('missing lottie remote manifest');
}
if (!fs.existsSync(iconRegistryPath)) {
  failures.push('missing icon registry');
}
if (!fs.existsSync(lottieRegistryPath)) {
  failures.push('missing lottie registry file');
}

const manifestSource = fs.existsSync(manifestPath) ? fs.readFileSync(manifestPath, 'utf8') : '';
const iconRegistrySource = fs.existsSync(iconRegistryPath) ? fs.readFileSync(iconRegistryPath, 'utf8') : '';

const iconRegistryMatch = iconRegistrySource.match(
  /export const iconRegistry:[\s\S]*?=\s*\{([\s\S]*?)\}\s*;/
);
const iconRegistryKeys = new Set();
if (iconRegistryMatch) {
  const keyRegex = /^\s*([A-Za-z][A-Za-z0-9_]*)\s*:/gm;
  for (const match of iconRegistryMatch[1].matchAll(keyRegex)) {
    iconRegistryKeys.add(match[1]);
  }
}

const manifestEntries = new Map();
const entryRegex = /^\s*([A-Za-z][A-Za-z0-9_]*)\s*:\s*\{([\s\S]*?)^\s*},\s*$/gm;
for (const match of manifestSource.matchAll(entryRegex)) {
  const key = match[1];
  const block = match[2];
  const urlMatch = block.match(/url:\s*'([^']+)'/);
  const fallbackMatch = block.match(/fallbackName:\s*'([^']+)'/);
  manifestEntries.set(key, {
    url: urlMatch?.[1] ?? null,
    fallbackName: fallbackMatch?.[1] ?? null,
  });
}

const urlToKeys = new Map();

for (const key of requiredRegistryKeys) {
  const entry = manifestEntries.get(key);
  if (!entry) {
    failures.push(`missing manifest key: ${key}`);
    continue;
  }

  if (!entry.url) {
    failures.push(`missing url: ${key}`);
    continue;
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(entry.url);
  } catch {
    failures.push(`invalid url: ${key}`);
    continue;
  }

  if (parsedUrl.protocol !== 'https:') {
    failures.push(`non-https url: ${key}`);
  }

  const isAllowedHost =
    allowedHosts.has(parsedUrl.hostname) ||
    allowedHostSuffixes.some(suffix => parsedUrl.hostname.endsWith(suffix));
  if (!isAllowedHost) {
    failures.push(`blocked host: ${key} -> ${parsedUrl.hostname}`);
  }

  const urlHash = crypto.createHash('sha256').update(entry.url).digest('hex');
  if (denylistUrls.has(entry.url) || denylistUrlHashes.has(urlHash)) {
    failures.push(`denylisted lottie url: ${key}`);
  }

  const keys = urlToKeys.get(entry.url) ?? [];
  keys.push(key);
  urlToKeys.set(entry.url, keys);

  if (!entry.fallbackName) {
    failures.push(`missing fallbackName: ${key}`);
    continue;
  }

  if (!iconRegistryKeys.has(entry.fallbackName)) {
    failures.push(`invalid fallbackName: ${key} -> ${entry.fallbackName}`);
  }

}

for (const [url, keys] of urlToKeys.entries()) {
  if (keys.length > 1) {
    failures.push(`duplicate lottie url: ${url} (${keys.join(', ')})`);
  }
}

if (failures.length > 0) {
  console.error('[qa:lottie] failed');
  for (const failure of failures) {
    console.error(` - ${failure}`);
  }
  process.exit(1);
}

console.log('[qa:lottie] pass');
