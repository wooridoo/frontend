#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = process.cwd();
let failCount = 0;

function parseJsonWithBom(raw) {
  return JSON.parse(raw.replace(/^\uFEFF/, ''));
}

function logCheck(ok, label, detail = '') {
  const status = ok ? 'PASS' : 'FAIL';
  const suffix = detail ? ` - ${detail}` : '';
  console.log(`[${status}] ${label}${suffix}`);
  if (!ok) {
    failCount += 1;
  }
}

function existsDirectory(relPath) {
  const fullPath = path.join(ROOT, relPath);
  return fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory();
}

function collectPathRefs(config) {
  const refs = new Set();
  const profiles = config.profiles || {};
  const triggers = (config.triggers && config.triggers.keywords) || {};

  Object.values(profiles).forEach((items) => {
    if (!Array.isArray(items)) return;
    items.forEach((item) => {
      if (typeof item === 'string') refs.add(item);
    });
  });

  Object.values(triggers).forEach((items) => {
    if (!Array.isArray(items)) return;
    items.forEach((item) => {
      if (typeof item === 'string') refs.add(item);
    });
  });

  return Array.from(refs).sort();
}

function runNodeCheck(scriptPath) {
  return spawnSync(process.execPath, ['--check', scriptPath], {
    cwd: ROOT,
    encoding: 'utf8'
  });
}

function runNodeScript(scriptPath, args = [], extraEnv = {}) {
  return spawnSync(process.execPath, [scriptPath, ...args], {
    cwd: ROOT,
    encoding: 'utf8',
    env: { ...process.env, ...extraEnv }
  });
}

console.log('WooriDo Skills QA');
console.log('='.repeat(20));

const requiredDirs = [
  '.woorido',
  '.woorido/agents',
  '.woorido/hooks',
  '.woorido/scripts',
  '.claude/skills/woorido',
  '.agent/workflows'
];

requiredDirs.forEach((dir) => {
  logCheck(existsDirectory(dir), `dir:${dir}`);
});

const configPath = path.join(ROOT, '.woorido/config/woorido.config.json');
if (!fs.existsSync(configPath)) {
  logCheck(false, 'config', 'missing .woorido/config/woorido.config.json');
} else {
  try {
    const config = parseJsonWithBom(fs.readFileSync(configPath, 'utf8'));
    logCheck(true, 'config', 'json parse');

    const refs = collectPathRefs(config);
    refs.forEach((ref) => {
      const refPath = path.join(ROOT, '.woorido', ref);
      const ok = fs.existsSync(refPath);
      logCheck(ok, `config-ref:${ref}`);
    });
  } catch (error) {
    logCheck(false, 'config', `json parse failed: ${error.message}`);
  }
}

const scriptDir = path.join(ROOT, '.woorido/scripts');
if (fs.existsSync(scriptDir)) {
  const scriptFiles = fs.readdirSync(scriptDir)
    .filter((name) => name.endsWith('.js'))
    .filter((name) => name !== 'qa-runner.js')
    .sort();

  scriptFiles.forEach((name) => {
    const fullPath = path.join(scriptDir, name);
    const checkResult = runNodeCheck(fullPath);
    const detail = checkResult.status === 0
      ? ''
      : (checkResult.stderr || checkResult.stdout || '').trim().split('\n')[0];
    logCheck(checkResult.status === 0, `syntax:${name}`, detail);
  });

  const smokeCases = [
    { name: 'session-start.js', args: [], env: {} },
    {
      name: 'pre-tool-use.js',
      args: [],
      env: {
        TOOL_INPUT: JSON.stringify({
          tool_name: 'Edit',
          file_path: 'src/mock.ts',
          content: 'pay money brix'
        })
      }
    },
    {
      name: 'post-tool-use.js',
      args: [],
      env: {
        TOOL_INPUT: JSON.stringify({
          tool_name: 'Edit',
          file_path: 'src/mock.css',
          content: '.x{color:#fff;}'
        })
      }
    },
    { name: 'prompt_handler.js', args: ['default', 'money pay'], env: {} }
  ];

  smokeCases.forEach((testCase) => {
    const fullPath = path.join(scriptDir, testCase.name);
    const runResult = runNodeScript(fullPath, testCase.args, testCase.env);
    const detail = runResult.status === 0
      ? ''
      : (runResult.stderr || runResult.stdout || '').trim().split('\n')[0];
    logCheck(runResult.status === 0, `runtime:${testCase.name}`, detail);
  });
}

if (failCount > 0) {
  console.error(`\nResult: FAILED (${failCount} checks)`);
  process.exit(1);
}

console.log('\nResult: PASSED');
