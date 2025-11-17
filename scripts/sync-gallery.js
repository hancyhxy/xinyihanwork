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

function htmlEscapeAttr(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/'/g, '&#39;');
}

function formatInlineText(text) {
  if (text === undefined || text === null) return '';
  const raw = String(text);

  // Use a placeholder system to protect markdown links during processing
  const linkPlaceholders = [];
  let workingText = raw;

  // Step 1: Extract and replace markdown links [text](url) with placeholders
  workingText = workingText.replace(/\[([^\]]*)\]\(([^)]+)\)/g, (match, linkText, url) => {
    const safeHref = htmlEscapeAttr(url.trim());
    const displayText = linkText.trim() || url.trim(); // Use URL if linkText is empty
    const safeText = htmlEscape(displayText);
    const placeholder = `__LINK_${linkPlaceholders.length}__`;
    linkPlaceholders.push(`<a href="${safeHref}" target="_blank" rel="noreferrer">${safeText}</a>`);
    return placeholder;
  });

  // Step 2: Process standalone URLs in remaining text
  const urlRegex = /(https?:\/\/[\w\-._~:/?#\[\]@!$&'()*+,;=%]+)/g;
  let lastIndex = 0;
  const parts = [];
  let match;

  while ((match = urlRegex.exec(workingText)) !== null) {
    if (match.index > lastIndex) {
      parts.push(htmlEscape(workingText.slice(lastIndex, match.index)));
    }

    let url = match[0];
    let trailing = '';
    const trailingMatch = /([)\],.?!]+)$/.exec(url);
    if (trailingMatch) {
      trailing = trailingMatch[1];
      url = url.slice(0, -trailing.length);
    }

    const safeHref = htmlEscapeAttr(url);
    const safeText = htmlEscape(url);
    parts.push(`<a href="${safeHref}" target="_blank" rel="noreferrer">${safeText}</a>${htmlEscape(trailing)}`);
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < workingText.length) {
    parts.push(htmlEscape(workingText.slice(lastIndex)));
  }

  let result = parts.length ? parts.join('') : htmlEscape(workingText);

  // Step 3: Restore markdown links from placeholders
  linkPlaceholders.forEach((link, index) => {
    result = result.replace(`__LINK_${index}__`, link);
  });

  return result;
}

function normalizeHeaderTitle(title) {
  // Keep headings exactly as authored in Markdown (no auto-stripping)
  return String(title).trim();
}

function normalizeImageScale(raw) {
  if (raw === null || raw === undefined || raw === '') return null;
  const num = typeof raw === 'number' ? raw : parseFloat(String(raw).trim());
  if (!Number.isFinite(num) || num <= 0) return null;
  const percent = num <= 1 ? num * 100 : num;
  return percent;
}

function formatScalePercent(value) {
  const num = Number(value);
  if (!Number.isFinite(num) || num <= 0) return null;
  const rounded = num % 1 === 0 ? num : Number(num.toFixed(2));
  return rounded;
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
    const trimmed = line.trim();

    let imageSpec = null;
    const scaledImgMatch = /^(\d*\.?\d+)\s+!\[([^\]]*)\]\(([^)]+)\)\s*$/.exec(trimmed);
    if (scaledImgMatch) {
      imageSpec = {
        alt: scaledImgMatch[2] || '',
        src: scaledImgMatch[3] || '',
        scale: normalizeImageScale(scaledImgMatch[1])
      };
    } else {
      const plainImgMatch = /^!\[([^\]]*)\]\(([^)]+)\)\s*$/.exec(trimmed);
      if (plainImgMatch) {
        imageSpec = {
          alt: plainImgMatch[1] || '',
          src: plainImgMatch[2] || '',
          scale: null
        };
      }
    }

    if (imageSpec) {
      const altLower = imageSpec.alt.toLowerCase();
      if (/cover/.test(altLower) || /\/public\/cover\./i.test(imageSpec.src)) {
        continue; // ignore cover image in content
      }
    }

    // Top-level H1 (# ) is the page title; ignore
    if (/^#\s+/.test(trimmed)) {
      continue;
    }

    // H3 as section header; also handle H2 if authors use it
    // Be forgiving about missing spaces after hashes, but ensure exact depth (no extra #)
    const h3 = /^###(?!#)\s*(.+?)\s*$/.exec(trimmed);
    const h2 = /^##(?!#)\s*(.+?)\s*$/.exec(trimmed);
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

    // H4 inside a section => styled subsection heading within current section
    const h4 = /^####(?!#)\s*(.+?)\s*$/.exec(trimmed);
    if (h4) {
      if (!current) {
        current = { title: 'Section', content: [] };
        sections.push(current);
      }
      flushParagraph();
      current.content.push({ type: 'h4', text: h4[1].trim() });
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
    if (imageSpec) {
      if (!current) {
        current = { title: 'Section', content: [] };
        sections.push(current);
      }
      flushParagraph();
      current.content.push({
        type: 'img',
        alt: imageSpec.alt,
        src: imageSpec.src,
        scale: imageSpec.scale
      });
      continue;
    }

    // Horizontal rule or metadata dividers: ignore
    if (/^\s*---+\s*$/.test(trimmed)) {
      flushParagraph();
      continue;
    }

    // Blank line => paragraph break
    if (/^\s*$/.test(trimmed)) {
      flushParagraph();
      continue;
    }

    // Plain text => paragraph buffer
    if (!current) {
      current = { title: 'Section', content: [] };
      sections.push(current);
    }
    buffer.push(trimmed);
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

    // Group content intelligently:
    // - Images stand alone
    // - H4 + following content (p/ul) are grouped together
    // - Consecutive p/ul without H4 are grouped together
    let i = 0;
    while (i < sec.content.length) {
      const item = sec.content[i];

      // Images always stand alone
      if (item.type === 'img') {
        if (item.scale) {
          const width = formatScalePercent(item.scale);
          const widthAttr = width !== null ? `${width}%` : '100%';
          out.push(`    <img class="project-image-scaled" style="width: ${widthAttr}" src="${item.src}" alt="${htmlEscape(item.alt)}">`);
        } else {
          out.push(`    <img class="project-image" src="${item.src}" alt="${htmlEscape(item.alt)}">`);
        }
        i++;
      } else {
        // Start a new group (may include H4 + content, or just content)
        out.push('    <div>');

        // If this starts with H4, include it in the group
        if (sec.content[i].type === 'h4') {
          out.push(`      <h4 class="subsection-title">${formatInlineText(sec.content[i].text)}</h4>`);
          i++;
        }

        // Add all following paragraphs and lists to this group
        while (i < sec.content.length && (sec.content[i].type === 'p' || sec.content[i].type === 'ul')) {
          const current = sec.content[i];
          if (current.type === 'p') {
            out.push(`      <p class="content-text">${formatInlineText(current.text)}</p>`);
          } else if (current.type === 'ul') {
            out.push('      <ul class="content-text">');
            for (const li of current.items) out.push(`        <li>${formatInlineText(li)}</li>`);
            out.push('      </ul>');
          }
          i++;
        }

        out.push('    </div>');
      }
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

    // Group content intelligently (same logic as two-column)
    let i = 0;
    while (i < sec.content.length) {
      const item = sec.content[i];

      // Images always stand alone
      if (item.type === 'img') {
        if (item.scale) {
          const width = formatScalePercent(item.scale);
          const widthAttr = width !== null ? `${width}%` : '100%';
          out.push(`  <img class="project-image-scaled" style="width: ${widthAttr}" src="${item.src}" alt="${htmlEscape(item.alt)}">`);
        } else {
          out.push(`  <img class="project-image" src="${item.src}" alt="${htmlEscape(item.alt)}">`);
        }
        i++;
      } else {
        // H4 + following content grouped together, or just content
        // Note: For stacked layout, we don't use wrapper divs, just sequence elements
        // H4's own margins handle spacing

        // If this starts with H4, render it
        if (sec.content[i].type === 'h4') {
          out.push(`  <h4 class="subsection-title">${formatInlineText(sec.content[i].text)}</h4>`);
          i++;
        }

        // Render all following paragraphs and lists
        while (i < sec.content.length && (sec.content[i].type === 'p' || sec.content[i].type === 'ul')) {
          const current = sec.content[i];
          if (current.type === 'p') {
            out.push(`  <p class="content-text">${formatInlineText(current.text)}</p>`);
          } else if (current.type === 'ul') {
            out.push('  <ul class="content-text">');
            for (const li of current.items) out.push(`    <li>${formatInlineText(li)}</li>`);
            out.push('  </ul>');
          }
          i++;
        }
      }
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
