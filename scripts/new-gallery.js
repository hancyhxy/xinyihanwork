#!/usr/bin/env node
// Lightweight scaffolder for new gallery projects (no external deps)

const fs = require('fs');
const path = require('path');

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i++) {
    const key = argv[i];
    if (key.startsWith('--')) {
      const name = key.slice(2);
      const val = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true;
      args[name] = val;
    }
  }
  return args;
}

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function copyFile(src, dest) {
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
}

function read(file) { return fs.readFileSync(file, 'utf8'); }
function write(file, content) { ensureDir(path.dirname(file)); fs.writeFileSync(file, content, 'utf8'); }

function substitute(content, map) {
  return content.replace(/\{\{(.*?)\}\}/g, (_, key) => (map[key.trim()] ?? ''));
}

function main() {
  const args = parseArgs(process.argv);
  const type = (args.type || 'two-column').toLowerCase();
  const slug = args.slug;
  const title = args.title || 'Untitled Project';
  const date = args.date || '';
  const tag = args.tag || '';
  const company = args.company || '';
  const description = args.description || '';

  if (!slug) {
    console.error('Error: --slug is required');
    process.exit(1);
  }
  if (!['two-column','stacked'].includes(type)) {
    console.error('Error: --type must be one of two-column|stacked');
    process.exit(1);
  }

  const tplDir = path.join(__dirname, '..', 'gallery', '_templates', type);
  const outDir = path.join(__dirname, '..', 'gallery', slug);

  if (!fs.existsSync(tplDir)) {
    console.error('Error: template not found at', tplDir);
    process.exit(1);
  }
  if (fs.existsSync(outDir)) {
    console.error('Error: output directory already exists:', outDir);
    process.exit(1);
  }

  ensureDir(outDir);
  ensureDir(path.join(outDir, 'public'));

  const tokens = { TITLE: title, DATE: date, TAG: tag, COMPANY: company, DESCRIPTION: description };

  // Process template index.html and text.md with token substitution
  const indexSrc = path.join(tplDir, 'index.html');
  const textSrc = path.join(tplDir, 'text.md');

  const indexOut = path.join(outDir, 'index.html');
  const textOut = path.join(outDir, 'text.md');

  write(indexOut, substitute(read(indexSrc), tokens));
  write(textOut, substitute(read(textSrc), tokens));

  // Create a simple placeholder note in public/
  write(path.join(outDir, 'public', 'README.txt'), 'Place cover.png and body images here.');

  console.log('Created new gallery project at', outDir);
}

main();

