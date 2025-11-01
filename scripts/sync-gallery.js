#!/usr/bin/env node
// Sync gallery index.html content from text.md using a lightweight Markdown parser (no external deps)
// Usage:
//   node scripts/sync-gallery.js --slug <folder-name>
//   node scripts/sync-gallery.js --dir gallery/<folder-name>
//   node scripts/sync-gallery.js --dir gallery/<folder-name> --type two-column|stacked
// Also usable as a module: const { syncGallery } = require('./scripts/sync-gallery');

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

function read(file) { return fs.readFileSync(file, 'utf8'); }
function write(file, content) { fs.writeFileSync(file, content, 'utf8'); }
function exists(p) { return fs.existsSync(p); }

function htmlEscape(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function normalizeHeaderTitle(title) {
  // Keep headings exactly as authored in Markdown (no auto-stripping)
  return String(title).trim();
}

function parseMarkdown(md) {
  const lines = md.replace(/\r\n?/g, '\n').split('\n');

  const sections = [];
  let current = null;
  let inBrief = false;
  let buffer = [];

  function flushParagraph() {
    if (buffer.length) {
      const text = buffer.join(' ').trim();
      if (text) current.content.push({ type: 'p', text });
      buffer = [];
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Skip cover image lines
    const imgMatch = /^!\[([^\]]*)\]\(([^)]+)\)\s*$/.exec(line.trim());
    if (imgMatch) {
      const alt = (imgMatch[1] || '').toLowerCase();
      const src = imgMatch[2] || '';
      if (/cover/i.test(alt) || /\/public\/cover\./i.test(src)) {
        continue; // ignore cover image in content
      }
    }

    // Top-level H1 (# ) is the page title; ignore
    if (/^#\s+/.test(line)) {
      continue;
    }

    // H3 as section header; also handle H2 if authors use it
    const h3 = /^###\s+(.+?)\s*$/.exec(line);
    const h2 = /^##\s+(.+?)\s*$/.exec(line);
    const heading = h3 || h2;
    if (heading) {
      const title = heading[1].trim();
      if (/^project\s+brief$/i.test(title)) {
        // Skip the whole Project Brief section content
        inBrief = true;
        current = null;
        continue;
      }
      inBrief = false;
      // Start a new section
      if (current) flushParagraph();
      current = { title: title, content: [] };
      sections.push(current);
      continue;
    }

    // End Project Brief on blank line followed by a new header OR when another header appears (handled above)
    if (inBrief) {
      // remain skipping until next heading
      continue;
    }

    // Lists
    const li = /^\s*[-\*]\s+(.+?)\s*$/.exec(line);
    if (li) {
      if (!current) {
        current = { title: 'Section', content: [] };
        sections.push(current);
      }
      flushParagraph();
      const last = current.content[current.content.length - 1];
      if (!last || last.type !== 'ul') {
        current.content.push({ type: 'ul', items: [] });
      }
      current.content[current.content.length - 1].items.push(li[1]);
      continue;
    }

    // Images
    if (imgMatch) {
      if (!current) {
        current = { title: 'Section', content: [] };
        sections.push(current);
      }
      flushParagraph();
      current.content.push({ type: 'img', alt: imgMatch[1] || '', src: imgMatch[2] || '' });
      continue;
    }

    // Horizontal rule or metadata dividers: ignore
    if (/^\s*---+\s*$/.test(line)) {
      flushParagraph();
      continue;
    }

    // Blank line => paragraph break
    if (/^\s*$/.test(line)) {
      flushParagraph();
      continue;
    }

    // Plain text => paragraph buffer
    if (!current) {
      current = { title: 'Section', content: [] };
      sections.push(current);
    }
    buffer.push(line.trim());
  }
  if (current) flushParagraph();
  return sections;
}

function renderTwoColumn(sections) {
  const out = [];
  for (const sec of sections) {
    const title = normalizeHeaderTitle(sec.title);
    out.push('<section class="two-column-section">');
    out.push(`  <div class="column-title">${htmlEscape(title)}</div>`);
    out.push('  <div class="column-content">');
    for (const item of sec.content) {
      if (item.type === 'p') out.push(`    <p class="content-text">${htmlEscape(item.text)}</p>`);
      else if (item.type === 'ul') {
        out.push('    <ul class="content-text">');
        for (const li of item.items) out.push(`      <li>${htmlEscape(li)}</li>`);
        out.push('    </ul>');
      } else if (item.type === 'img') out.push(`    <img class="project-image" src="${item.src}" alt="${htmlEscape(item.alt)}">`);
    }
    out.push('  </div>');
    out.push('</section>');
  }
  return out.join('\n');
}

function renderStacked(sections) {
  const out = [];
  for (const sec of sections) {
    const title = normalizeHeaderTitle(sec.title);
    out.push('<section class="content-section">');
    out.push(`  <h2 class="section-title">${htmlEscape(title)}</h2>`);
    for (const item of sec.content) {
      if (item.type === 'p') out.push(`  <p class="content-text">${htmlEscape(item.text)}</p>`);
      else if (item.type === 'ul') {
        out.push('  <ul class="content-text">');
        for (const li of item.items) out.push(`    <li>${htmlEscape(li)}</li>`);
        out.push('  </ul>');
      } else if (item.type === 'img') out.push(`  <img class="project-image" src="${item.src}" alt="${htmlEscape(item.alt)}">`);
    }
    out.push('</section>');
  }
  return out.join('\n');
}

function replaceBetweenMarkers(html, newContent) {
  const start = '<!-- SYNC:CONTENT-START -->';
  const end = '<!-- SYNC:CONTENT-END -->';
  const startIdx = html.indexOf(start);
  const endIdx = html.indexOf(end);
  if (startIdx === -1 || endIdx === -1 || endIdx < startIdx) {
    throw new Error('SYNC markers not found in index.html');
  }
  const before = html.slice(0, startIdx + start.length);
  const after = html.slice(endIdx);
  return `${before}\n${newContent}\n${after}`;
}

function detectLayout(html) {
  // Look for data-layout on project-content
  const m = /<div\s+class=\"project-content\"[^>]*data-layout=\"(two-column|stacked)\"/i.exec(html);
  if (m) return m[1];
  // Fallback: heuristics by presence of two-column-section
  if (/two-column-section/.test(html)) return 'two-column';
  return 'stacked';
}

function syncGallery(dir, type = null) {
  const textPath = path.join(dir, 'text.md');
  const htmlPath = path.join(dir, 'index.html');
  if (!exists(textPath)) throw new Error(`text.md not found: ${textPath}`);
  if (!exists(htmlPath)) throw new Error(`index.html not found: ${htmlPath}`);

  const md = read(textPath);
  const html = read(htmlPath);
  const layout = type || detectLayout(html);
  const sections = parseMarkdown(md);
  const body = layout === 'two-column' ? renderTwoColumn(sections) : renderStacked(sections);
  const replaced = replaceBetweenMarkers(html, body);
  write(htmlPath, replaced);
  return { layout, sections: sections.length };
}

if (require.main === module) {
  try {
    const args = parseArgs(process.argv);
    let dir = args.dir || null;
    if (!dir && args.slug) dir = path.join(__dirname, '..', 'gallery', String(args.slug));
    if (!dir) throw new Error('Provide --slug <name> or --dir gallery/<name>');
    const abs = path.isAbsolute(dir) ? dir : path.join(__dirname, '..', dir);
    const res = syncGallery(abs, args.type || null);
    console.log(`Synced ${abs} (${res.layout}) with ${res.sections} sections.`);
  } catch (e) {
    console.error('sync-gallery error:', e.message);
    process.exit(1);
  }
}

module.exports = { syncGallery, parseMarkdown };
