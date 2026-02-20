import fs from 'node:fs';
import path from 'node:path';

const projectRoot = path.resolve(process.cwd());
const srcRoot = path.join(projectRoot, 'src');

const allowList = new Set([
  path.normalize('src/components/ui/Button.tsx'),
  path.normalize('src/components/ui/FAB/FAB.tsx'),
  path.normalize('src/components/ui/CategoryTabs/CategoryTabs.tsx'),
  path.normalize('src/components/domain/Challenge/Feed/PostCard.tsx'),
  path.normalize('src/components/domain/Challenge/Dashboard/ChallengeHero.tsx'),
  path.normalize('src/components/domain/Challenge/DelegateLeaderModal.tsx'),
  path.normalize('src/components/domain/Comment/CommentSection.tsx'),
  path.normalize('src/components/domain/Home/Hero/MainCarousel.tsx'),
  path.normalize('src/components/domain/Home/Bento/Blocks/FeedBlock.tsx'),
  path.normalize('src/components/domain/Home/Bento/Blocks/CategoryBlock.tsx'),
  path.normalize('src/components/domain/Home/Bento/Blocks/ActionBlock.tsx'),
  path.normalize('src/components/domain/Challenge/Ledger/ExpenseList.tsx'),
  path.normalize('src/pages/SettingsPage.tsx'),
  path.normalize('src/pages/CreateChallengePage.tsx'),
  path.normalize('src/components/ui/Overlay/ResponsiveOverlay.tsx'),
]);

const tsxFiles = [];

function collectFiles(dirPath) {
  for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
    const absolutePath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      collectFiles(absolutePath);
      continue;
    }

    if (absolutePath.endsWith('.tsx')) {
      tsxFiles.push(absolutePath);
    }
  }
}

collectFiles(srcRoot);

const violations = [];

for (const filePath of tsxFiles) {
  const relativePath = path.normalize(path.relative(projectRoot, filePath));
  if (allowList.has(relativePath)) {
    continue;
  }

  const source = fs.readFileSync(filePath, 'utf8');
  if (source.includes('<button')) {
    violations.push(relativePath);
  }
}

if (violations.length > 0) {
  console.error('[qa:buttons] raw <button> detected outside allow list:');
  for (const file of violations) {
    console.error(` - ${file}`);
  }
  process.exit(1);
}

console.log('[qa:buttons] pass');
