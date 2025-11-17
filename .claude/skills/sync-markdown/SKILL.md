---
name: sync-markdown
description: This skill should be used when users want to sync content from text.md files to gallery project index.html files. Trigger phrases include "sync markdown", "sync text.md", "update gallery content", or when users need to update HTML content from markdown source files following GALLERY_GUIDE.md formatting rules.
---

# Sync Markdown

## Overview

This skill automates synchronization of content from `text.md` markdown files to gallery project `index.html` files, following the formatting rules in `/.claude/references/GALLERY_GUIDE.md`.

## When to Use

- User wants to sync `text.md` to `index.html` in gallery projects
- User says "sync markdown", "sync text.md", "update gallery content"
- User needs to refresh HTML after editing markdown files

## Workflow

### 1. Identify Target Project

Determine which project(s) to sync:
- Single project: user provides project name or slug
- Multiple projects: sync all gallery projects with `text.md` files
- Specific path: user provides directory like `gallery/project-name/`

### 2. Validate Files

Check required files exist:
- `gallery/<slug>/text.md` - source content
- `gallery/<slug>/index.html` - target HTML
- SYNC markers: `<!-- SYNC:CONTENT-START -->` and `<!-- SYNC:CONTENT-END -->` in HTML

### 3. Execute Sync

Run from project root:

```bash
# Single project
node scripts/sync-gallery.js --slug <project-slug>

# Specific directory
node scripts/sync-gallery.js --dir gallery/<project-name>

# Override layout type
node scripts/sync-gallery.js --slug <project-slug> --type two-column|stacked
```

The script:
- Parses markdown following GALLERY_GUIDE.md rules
- Auto-detects layout (two-column or stacked) from HTML
- Renders content into proper HTML structure
- Replaces content between SYNC markers
- Preserves metadata, hero, header, footer

### 4. Verify Results

Check script output:
```
Synced <path> (<layout-type>) with <N> sections.
```

Verify:
- Section count matches expected
- Layout type is correct
- Images display with proper paths
- Text formatting preserved

### 5. Common Issues

**SYNC markers not found:**
- Add markers to `index.html` if missing

**Images not showing:**
- Check paths use `./public/<name>.ext` format
- Verify images exist in `public/` directory

**Wrong layout:**
- Use `--type two-column` or `--type stacked` to override

## Content Format

Markdown syntax supported (see `/.claude/references/GALLERY_GUIDE.md` for details):
- `##` or `###` - Section headers
- `####` - Subsection headers
- `**bold**`, `*italic*` - Text formatting
- `- item` - Bullet lists
- `![alt](./public/img.png)` - Images
- `0.8 ![alt](src)` - Scaled images (80% width)

Special rules:
- `#` page title is ignored
- "Project Brief" section is skipped
- Cover images are excluded from body
- URLs auto-convert to links

## Batch Sync

Sync all projects:

```bash
for dir in gallery/*/; do
  [ -f "$dir/text.md" ] && node scripts/sync-gallery.js --dir "$dir"
done
```

## Resources

### scripts/sync-gallery.js
Main sync script. Key functions:
- `parseMarkdown(md)` - Parse markdown to sections
- `renderTwoColumn(sections)` - Render two-column layout
- `renderStacked(sections)` - Render stacked layout
- `syncGallery(dir, type)` - Main sync function

### Global references
- `/.claude/references/GALLERY_GUIDE.md` - Complete formatting rules and content authoring guide. Reference when:
  - User asks about markdown format
  - User needs spacing/formatting details
  - User wants video embed examples
