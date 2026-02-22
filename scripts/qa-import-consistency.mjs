import fs from 'node:fs';
import path from 'node:path';

const projectRoot = path.resolve(process.cwd());
const srcRoot = path.join(projectRoot, 'src');
const failures = [];

function toPosixPath(filePath) {
  return filePath.split(path.sep).join('/');
}

function collectFiles(dirPath, acc = []) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      if (['dist', 'generated', '__generated__'].includes(entry.name)) continue;
      collectFiles(fullPath, acc);
      continue;
    }
    if (!fullPath.endsWith('.ts') && !fullPath.endsWith('.tsx')) continue;
    if (fullPath.endsWith('.d.ts')) continue;
    acc.push(fullPath);
  }
  return acc;
}

const files = collectFiles(srcRoot);

for (const absolutePath of files) {
  const relativePath = toPosixPath(path.relative(projectRoot, absolutePath));
  const source = fs.readFileSync(absolutePath, 'utf8');

  if (source.includes(`from '@/components/common'`) || source.includes('from "@/components/common"')) {
    failures.push(`components/common import 금지 위반: ${relativePath}`);
  }

  if (source.includes(`from '@/utils/format'`) || source.includes('from "@/utils/format"')) {
    failures.push(`중복 포맷 유틸 import 금지 위반: ${relativePath}`);
  }

  const deepRelativeRegex = /from\s+['"](?:\.\.\/){3,}[^'"]*['"]/g;
  if (deepRelativeRegex.test(source)) {
    failures.push(`깊은 상대경로 import 금지 위반: ${relativePath}`);
  }
}

if (failures.length > 0) {
  console.error('[qa:imports] failed');
  failures.forEach(failure => console.error(` - ${failure}`));
  process.exit(1);
}

console.log('[qa:imports] pass');
