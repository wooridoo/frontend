import fs from 'node:fs';
import path from 'node:path';

const projectRoot = path.resolve(process.cwd());
const srcRoot = path.join(projectRoot, 'src');

const codeExtensions = new Set(['.ts', '.tsx', '.css']);

const inlineStyleAllowlist = new Set([
  'src/components/domain/BrixBadge/BrixBadgeLottie.tsx',
  'src/components/domain/Challenge/Ledger/ChallengeLedgerPage.tsx',
  'src/components/domain/Challenge/Vote/VoteDetail.tsx',
  'src/components/domain/Challenge/Vote/VoteItem.tsx',
  'src/components/domain/ChallengeCard/ChallengeCard.tsx',
  'src/components/domain/Comment/CommentSection.tsx',
  'src/components/domain/Home/Bento/Blocks/StatusBlock.tsx',
  'src/components/feedback/Skeleton/Skeleton.tsx',
  'src/components/ui/Avatar/Avatar.tsx',
  'src/components/ui/Card/Card.tsx',
  'src/components/ui/Icon/AnimatedIcon.tsx',
  'src/components/ui/Icon/Icon.tsx',
]);

const hrefAssignmentAllowlist = new Set([
  'src/pages/ChargePage.tsx',
]);

const failures = [];

function toPosixPath(filePath) {
  return filePath.split(path.sep).join('/');
}

function collectFiles(dirPath, acc = []) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      collectFiles(fullPath, acc);
      continue;
    }

    if (!codeExtensions.has(path.extname(entry.name))) continue;
    acc.push(fullPath);
  }
  return acc;
}

const files = collectFiles(srcRoot);

for (const absoluteFilePath of files) {
  const relativePath = toPosixPath(path.relative(projectRoot, absoluteFilePath));
  const source = fs.readFileSync(absoluteFilePath, 'utf8');

  if (relativePath.endsWith('.tsx')) {
    if (source.includes('style={{') && !inlineStyleAllowlist.has(relativePath)) {
      failures.push(`inline style 금지 위반: ${relativePath}`);
    }
  }

  const isTokenSource =
    relativePath.endsWith('src/styles/tokens.css') || relativePath.endsWith('src/styles/tokens.ts');
  if (!isTokenSource) {
    const hexMatches = source.match(/#[0-9A-Fa-f]{3,8}\b/g);
    if (hexMatches && hexMatches.length > 0) {
      failures.push(`hex 하드코딩 금지 위반: ${relativePath}`);
    }
  }

  if (source.includes(`from '@/components/ui/Icons'`) || source.includes(`from "@/components/ui/Icons"`)) {
    failures.push(`금지된 import 사용: ${relativePath} (@/components/ui/Icons)`);
  }

  if (source.includes('window.location.href')) {
    if (!hrefAssignmentAllowlist.has(relativePath)) {
      failures.push(`window.location.href 사용 금지 위반: ${relativePath}`);
    } else {
      const literalInternalHrefRegex = /window\.location\.href\s*=\s*(['"`])\/[^'"`]*\1/g;
      if (literalInternalHrefRegex.test(source)) {
        failures.push(`내부 경로 window.location.href 금지 위반: ${relativePath}`);
      }
    }
  }
}

if (failures.length > 0) {
  console.error('[qa:style] failed');
  failures.forEach(failure => console.error(` - ${failure}`));
  process.exit(1);
}

console.log('[qa:style] pass');
