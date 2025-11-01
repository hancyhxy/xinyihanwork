#!/usr/bin/env node
// Lightweight scaffolder for new gallery projects (no external deps)

const fs = require('fs');
const path = require('path');
let syncModule = null;

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

function slugify(input) {
  return String(input || '')
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, '-')
    .replace(/[^a-z0-9\-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function toISODate(input) {
  if (!input) return '';
  const s = String(input).trim();
  // Accept YYYY-MM-DD or YYYY/MM/DD
  if (/^\d{4}[-\/]\d{2}[-\/]\d{2}$/.test(s)) {
    return s.replace(/\//g, '-');
  }
  // Accept YYYY.MM -> use first day of month
  if (/^\d{4}\.\d{2}$/.test(s)) {
    const [y, m] = s.split('.');
    return `${y}-${m}-01`;
  }
  // Accept YYYY-MM (month only)
  if (/^\d{4}-\d{2}$/.test(s)) {
    return `${s}-01`;
  }
  // Accept YYYY
  if (/^\d{4}$/.test(s)) {
    return `${s}-01-01`;
  }
  // Fallback to Date parsing
  const d = new Date(s);
  if (!isNaN(d.getTime())) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }
  return '';
}

function toDisplayYYYYMM(iso) {
  if (!iso) return '';
  const m = /^([0-9]{4})-([0-9]{2})-([0-9]{2})$/.exec(iso);
  if (m) return `${m[1]}.${m[2]}`;
  const d = new Date(iso);
  if (!isNaN(d.getTime())) {
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}`;
  }
  return iso;
}

function main() {
  const args = parseArgs(process.argv);
  const type = (args.type || 'two-column').toLowerCase();
  const slug = slugify(args.slug);
  const title = args.title || 'Untitled Project';
  const inputDate = args.date || '';
  const tag = args.tag || '';
  const company = args.company || '';
  const description = args.description || '';
  const classification = args.classification || 'UX/Product';
  const updateJson = args['update-json'] !== 'false';
  const doSync = args['sync'] !== 'false';

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

  // Normalize and prepare dates
  const isoDate = toISODate(inputDate);
  const displayDate = toDisplayYYYYMM(isoDate);

  const tokens = { TITLE: title, DATE: displayDate, TAG: tag, COMPANY: company, DESCRIPTION: description };

  // Process template index.html and text.md with token substitution
  const indexSrc = path.join(tplDir, 'index.html');
  const textSrc = path.join(tplDir, 'text.md');

  const indexOut = path.join(outDir, 'index.html');
  const textOut = path.join(outDir, 'text.md');

  write(indexOut, substitute(read(indexSrc), tokens));
  write(textOut, substitute(read(textSrc), tokens));

  // Create a simple placeholder note in public/
  write(path.join(outDir, 'public', 'README.txt'), 'Place cover.png and body images here.\nRecommended: cover.png (hero), body-1.png ...');

  // Optionally update content/gallery.json
  if (updateJson) {
    const jsonPath = path.join(__dirname, '..', 'content', 'gallery.json');
    try {
      const raw = read(jsonPath);
      const data = JSON.parse(raw);
      if (!Array.isArray(data)) throw new Error('gallery.json is not an array');

      const entry = {
        date: isoDate || '',
        'project name': title,
        tag,
        classification,
        coverImageUrl: `gallery/${slug}/public/cover.png`,
        projectUrl: `gallery/${slug}/index.html`,
        company
      };

      // Check duplicate by projectUrl or project name
      const exists = data.some(p => (p.projectUrl || '') === entry.projectUrl || (p['project name'] || '') === title);
      if (exists) {
        console.error('Error: Duplicate project (by name or URL) in gallery.json');
        process.exit(1);
      }

      data.push(entry);
      // Sort newest first if dates are present
      data.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
      write(jsonPath, JSON.stringify(data, null, 2) + '\n');
      console.log('Updated', jsonPath);
    } catch (e) {
      console.error('Failed to update content/gallery.json:', e.message);
      process.exit(1);
    }
  }

  // Optionally sync content from text.md into index.html
  if (doSync) {
    try {
      if (!syncModule) syncModule = require(path.join(__dirname, 'sync-gallery.js'));
      const res = syncModule.syncGallery(outDir, type);
      console.log(`Synced content into index.html (${res.layout}) with ${res.sections} sections.`);
    } catch (e) {
      console.error('Warning: Failed to sync content into index.html:', e.message);
    }
  }

  console.log('Created new gallery project at', outDir);
}

main();
