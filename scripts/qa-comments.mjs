import fs from 'node:fs';
import path from 'node:path';

const projectRoot = path.resolve(process.cwd());

const requiredDocFiles = [
  'src/components/ui/Icon/AnimatedIcon.tsx',
  'src/components/ui/Icon/lottieRemoteManifest.ts',
  'src/components/ui/Icon/lottieRegistry.ts',
  'src/components/domain/Auth/PasswordResetModal.tsx',
  'src/components/domain/BrixBadge/BrixBadge.tsx',
  'src/components/domain/BrixBadge/BrixBadgeLottie.tsx',
  'src/components/domain/Home/Hero/MainCarousel.tsx',
  'src/components/navigation/SideNav/SideNav.tsx',
  'src/components/navigation/TopNav/components/NavSearch.tsx',
  'src/components/ui/Overlay/ProfileMenuContent.tsx',
  'src/pages/CreateChallengePage.tsx',
  'src/components/domain/Notification/NotificationItem.tsx',
];

const failures = [];

function hasJsDocNear(lines, lineIndex) {
  const start = Math.max(0, lineIndex - 12);
  for (let i = start; i < lineIndex; i += 1) {
    if (lines[i].includes('/**')) {
      return true;
    }
  }
  return false;
}

for (const relativePath of requiredDocFiles) {
  const absolutePath = path.join(projectRoot, relativePath);
  if (!fs.existsSync(absolutePath)) {
    failures.push(`문서화 검사 파일 누락: ${relativePath}`);
    continue;
  }

  const source = fs.readFileSync(absolutePath, 'utf8');
  const lines = source.split(/\r?\n/);

  lines.forEach((line, index) => {
    const isExportDecl = /^\s*export\s+(function|class|const)\s+[A-Za-z0-9_]+/.test(line);
    if (!isExportDecl) return;

    if (!hasJsDocNear(lines, index)) {
      failures.push(`JSDoc 누락: ${relativePath}:${index + 1}`);
    }
  });
}

if (failures.length > 0) {
  console.error('[qa:comments] failed');
  failures.forEach(failure => console.error(` - ${failure}`));
  process.exit(1);
}

console.log('[qa:comments] pass');
