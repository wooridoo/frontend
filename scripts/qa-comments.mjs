import fs from 'node:fs';
import path from 'node:path';

const projectRoot = path.resolve(process.cwd());
const srcRoot = path.join(projectRoot, 'src');

const failures = [];

const commentExtensions = new Set(['.ts', '.tsx', '.css']);
const exportExtensions = new Set(['.ts', '.tsx']);

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

    const ext = path.extname(entry.name);
    if (!commentExtensions.has(ext)) continue;
    acc.push(fullPath);
  }
  return acc;
}

function isDocExcluded(relativePath) {
  return (
    relativePath.endsWith('.d.ts')
    || relativePath.endsWith('/index.ts')
    || relativePath.endsWith('vite-env.d.ts')
  );
}

function hasJsDocNear(lines, lineIndex) {
  const start = Math.max(0, lineIndex - 14);
  for (let i = lineIndex - 1; i >= start; i -= 1) {
    const trimmed = lines[i].trim();
    if (!trimmed) continue;
    if (trimmed.startsWith('/**') || trimmed.startsWith('*')) {
      return true;
    }
    if (trimmed.startsWith('//')) continue;
    break;
  }
  return false;
}

function shouldInspectEnglishComment(line) {
  const trimmed = line.trim();
  if (!trimmed) return false;
  if (trimmed.includes('eslint-disable') || trimmed.includes('@ts-ignore') || trimmed.includes('@ts-expect-error')) {
    return false;
  }
  if (trimmed.includes('http://') || trimmed.includes('https://')) return false;
  const isStarCommentLine = /^\*\s/.test(trimmed) || trimmed === '*';
  if (trimmed.startsWith('//') || trimmed.startsWith('/*') || isStarCommentLine || trimmed.includes('{/*')) {
    if (/[가-힣]/.test(trimmed)) return false;
    return /[A-Za-z]/.test(trimmed);
  }
  return false;
}

const files = collectFiles(srcRoot);

for (const absolutePath of files) {
  const relativePath = toPosixPath(path.relative(projectRoot, absolutePath));
  const source = fs.readFileSync(absolutePath, 'utf8');
  const lines = source.split(/\r?\n/);

  if (exportExtensions.has(path.extname(absolutePath)) && !isDocExcluded(relativePath)) {
    lines.forEach((line, index) => {
      const isExportDecl = /^\s*export\s+(function|class|const)\s+[A-Za-z0-9_]+/.test(line);
      if (!isExportDecl) return;

      if (!hasJsDocNear(lines, index)) {
        failures.push(`JSDoc 누락: ${relativePath}:${index + 1}`);
      }
    });
  }

  lines.forEach((line, index) => {
    if (shouldInspectEnglishComment(line)) {
      failures.push(`영문 주석 금지 위반: ${relativePath}:${index + 1}`);
    }
  });
}

if (failures.length > 0) {
  console.error('[qa:comments] failed');
  failures.forEach(failure => console.error(` - ${failure}`));
  process.exit(1);
}

console.log('[qa:comments] pass');
