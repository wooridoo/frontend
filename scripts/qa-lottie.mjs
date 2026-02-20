import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const projectRoot = path.resolve(process.cwd());

const requiredAssets = [
  'src/assets/lottie/categories/category-culture.json',
  'src/assets/lottie/categories/category-exercise.json',
  'src/assets/lottie/categories/category-study.json',
  'src/assets/lottie/categories/category-hobby.json',
  'src/assets/lottie/categories/category-savings.json',
  'src/assets/lottie/categories/category-travel.json',
  'src/assets/lottie/categories/category-food.json',
  'src/assets/lottie/categories/category-other.json',
  'src/assets/lottie/brix/brix-badge.json',
];

const requiredRegistryKeys = [
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

const failures = [];
const hashToPaths = new Map();

for (const relativePath of requiredAssets) {
  const absolutePath = path.join(projectRoot, relativePath);
  if (!fs.existsSync(absolutePath)) {
    failures.push(`missing asset: ${relativePath}`);
    continue;
  }

  const source = fs.readFileSync(absolutePath, 'utf8');
  try {
    JSON.parse(source);
  } catch {
    failures.push(`invalid json: ${relativePath}`);
    continue;
  }

  const hash = crypto.createHash('sha256').update(source).digest('hex');
  const existing = hashToPaths.get(hash) ?? [];
  existing.push(relativePath);
  hashToPaths.set(hash, existing);
}

for (const paths of hashToPaths.values()) {
  if (paths.length > 1) {
    failures.push(`duplicate animation payload: ${paths.join(', ')}`);
  }
}

const registryPath = path.join(projectRoot, 'src/components/ui/Icon/lottieRegistry.ts');
if (!fs.existsSync(registryPath)) {
  failures.push('missing lottie registry');
} else {
  const registrySource = fs.readFileSync(registryPath, 'utf8');
  for (const key of requiredRegistryKeys) {
    const pattern = new RegExp(`\\b${key}\\s*:`);
    if (!pattern.test(registrySource)) {
      failures.push(`missing registry key: ${key}`);
    }
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
