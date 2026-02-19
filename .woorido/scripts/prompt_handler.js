const fs = require('fs');
const path = require('path');
const { compileMarkdown } = require('./compiler');

/**
 * Prompt Handler (Trigger Engine)
 * Analyzes user input and assembles the final prompt based on profiles and triggers.
 */

const CONFIG_PATH = path.join(__dirname, '../config/woorido.config.json');
const BASE_DIR = path.resolve(__dirname, '..');

function loadConfig() {
  if (fs.existsSync(CONFIG_PATH)) {
    const raw = fs.readFileSync(CONFIG_PATH, 'utf8').replace(/^\uFEFF/, '');
    return JSON.parse(raw);
  }
  return { profiles: {}, triggers: { keywords: {} } };
}

function detectTriggers(userInput, config) {
  const triggeredFiles = new Set();
  const keywords = config.triggers.keywords || {};

  for (const [pattern, files] of Object.entries(keywords)) {
    let isMatch = false;

    try {
      const regex = new RegExp(pattern, 'i');
      isMatch = regex.test(userInput);
    } catch {
      const tokens = String(pattern)
        .split('|')
        .map(token => token.trim())
        .filter(Boolean);
      const lowerInput = String(userInput).toLowerCase();
      isMatch = tokens.some(token => lowerInput.includes(token.toLowerCase()));
    }

    if (isMatch) {
      files.forEach(f => triggeredFiles.add(f));
    }
  }
  return Array.from(triggeredFiles);
}

function generateSystemPrompt(profileName, userInput) {
  const config = loadConfig();
  const profile = config.profiles[profileName] || config.profiles['default'] || [];

  // 1. Static Profile
  let fileList = [...profile];

  // 2. Dynamic Triggers
  if (userInput) {
    const dynamicFiles = detectTriggers(userInput, config);
    fileList = [...fileList, ...dynamicFiles];
  }

  // 3. Compile Content
  let finalContent = "";

  // Deduplicate files
  fileList = [...new Set(fileList)];

  fileList.forEach(filePath => {
    let fullPath = path.join(BASE_DIR, filePath);

    if (!fs.existsSync(fullPath) && !filePath.endsWith('.md')) {
      if (fs.existsSync(fullPath + '.md')) {
        fullPath += '.md';
      }
    }

    if (!fs.existsSync(fullPath)) {
      return;
    }

    const stat = fs.lstatSync(fullPath);
    if (stat.isDirectory()) {
      // Keep deterministic order so generated prompts are stable.
      const mdFiles = fs.readdirSync(fullPath)
        .filter(name => name.endsWith('.md'))
        .sort()
        .map(name => path.join(fullPath, name));

      mdFiles.forEach(mdFile => {
        finalContent += compileMarkdown(mdFile) + "\n\n";
      });
      return;
    }

    if (stat.isFile()) {
      finalContent += compileMarkdown(fullPath) + "\n\n";
    }
  });

  // 4. Optimization (Minify)
  if (config.performance && config.performance.removeComments) {
    finalContent = finalContent.replace(/<!--[\s\S]*?-->/g, "");
  }
  if (config.performance && config.performance.minifyMarkdown) {
    finalContent = finalContent.replace(/\n\s*\n/g, "\n\n"); // Collapse multiple newlines
  }

  return finalContent.trim();
}

module.exports = { generateSystemPrompt };

// CLI support
if (require.main === module) {
  const profile = process.argv[2] || 'default';
  const input = process.argv[3] || '';
  console.log(generateSystemPrompt(profile, input));
}
