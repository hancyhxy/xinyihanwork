# Gallery Project Workflow and Templates

This guide standardizes how to add new gallery projects with two templates and consistent image behavior. Now `text.md` is the single source of truth for page content and can be synced into `index.html` automatically.

## Goals
- Two templates:
  - 左右结构 (two-column) — like the Alibaba case study.
  - 上下结构 (stacked) — like the art project layout.
- Body images keep their natural aspect ratio by default (no fixed ratio). Hero can be configured per page.
- Homepage gallery cards keep their fixed preview frame; project pages are unaffected.

## Global Image Rules (already configured)
- Homepage cards only: `.gallery-view .project-image` uses a fixed container for previews.
- Project pages: `.project-content img.project-image { width: 100%; height: auto; aspect-ratio: auto; }` so body images preserve intrinsic ratios.

## Folder Structure
Each project lives under `gallery/<slug>/` with:
- `index.html` — page markup using one of the templates (contains sync markers).
- `public/` — images (`cover.png` for hero/OG, plus body images).
- `text.md` — source content in the agreed Markdown format. Use the sync script to inject into `index.html`.

## Choosing a Template
- Two-column (左右结构): use for case studies and product/design narratives with sticky left titles and right content.
- Stacked (上下结构): use for art/visual projects with a vertical flow of text and images.

## How to Create a New Project

### Option A: Use the scaffolding script
```
node scripts/new-gallery.js \
  --type two-column|stacked \
  --slug your-project-slug \
  --title "Project Title" \
  --date "YYYY-MM-DD | YYYY.MM | YYYY-MM | YYYY" \
  --tag "Tag(s)" \
  --company "Company" \
  --classification "UX/Product|Experiential|Content|Visual" \
  --update-json true
```
- JSON 保存日期为 ISO（YYYY-MM-DD），用于排序；
- 页面显示为 YYYY.MM；
- `text.md` frontmatter 的 `date` 也会写入 YYYY.MM；
- 脚手架会自动在 `content/gallery.json` 追加并按日期倒序排序。

Then replace `gallery/<slug>/text.md` with your content and add images under `gallery/<slug>/public/`.
If you pass `--sync` (default), content from `text.md` will be injected into `index.html` automatically.

### Option B: Manual copy
- Copy a template folder from `gallery/_templates/<type>/` into `gallery/<slug>/`.
- Update metadata (title, brief, meta tags) in `index.html`.
- Replace `text.md` with your content and add images under `public/`.
- Run: `node scripts/sync-gallery.js --slug <slug>` to inject content into `index.html` (between the SYNC markers).

## Content Authoring (text.md format)
Use the following format (no YAML frontmatter), aligned with existing projects in `gallery/`:

```
![cover](./public/cover.png)

# Project Title

### Project Brief
- Date: YYYY.MM
- Project Name: Project Title
- Tag: Tag 1, Tag 2
- Company: Company Name

### Section Title
Paragraph text here.

![Alt text](./public/image1.png)

### Another Section
More text or bullet points:
- Point A
- Point B
```

Notes:
- Keep images in `public/` and reference as `./public/<name>.<ext>`.
- The "Project Brief" section is ignored by the sync script (the brief at the top of the page comes from `content/gallery.json`).

### Text Formatting
- **Bold text**: Use `**text**` in markdown → renders as `<strong>text</strong>` in HTML.
- *Italic text*: Use `*text*` in markdown → renders as `<em>text</em>` in HTML.
- Example: `**For Users — Zero Friction Adoption**` becomes `<strong>For Users — Zero Friction Adoption</strong>`.

### Headings and Subheadings Support
- Sections: use `##` or `###` for section headers. Exactly two or three `#` are recognized (e.g., `## Overview` or `### Overview`).
- Subsections: use `####` within a section to create a styled subsection heading. These render as `<h4 class="subsection-title">…</h4>` inside the section.
- Spacing: a space after the hashes is recommended (e.g., `### Overview`), and the parser is forgiving if the space is omitted (e.g., `###Overview`).
- The `#` page title is ignored by the sync (the title at the top of the page is controlled by the template and metadata).

## Hero Image
- Templates include a hero image with an automatic fallback: if `./public/cover.png` is missing, it switches to a fixed placeholder image at `../../logo/hero-placeholder.svg`.
- Default hero uses `aspect-ratio: 2/1; object-fit: cover;` controlled per-page CSS.

## Body Images
- Use `<img class="project-image" src="..." alt="...">` inside content.
- Body images automatically keep their intrinsic ratio and resize responsively.
- Homepage cards have an image onerror fallback that shows a placeholder if the file is missing.

## Content Spacing Rules

### Paragraph and Content Spacing
- **Manual spacing control**: Set `.column-content { gap: 0; }` and `.content-text { margin-bottom: 0; }` to remove automatic spacing.
- All spacing between paragraphs, lists, and images is controlled manually in the markdown file.
- To add spacing, use blank lines in `text.md` or add `<br>` tags in HTML.

### Subsection Title Spacing (####)
- Subsection titles (`<h4 class="subsection-title">`) have built-in spacing:
  ```css
  .subsection-title {
      margin: var(--spacing-md) 0 var(--spacing-sm) 0;
  }
  ```
- **Top margin**: 24px (spacing-md) - separates subsection from content above
- **Bottom margin**: 16px (spacing-sm) - creates space between title and following content
- This ensures visual hierarchy and readability for section breaks.

### Bullet Points Styling
- Lists should use the `content-text` class: `<ul class="content-text">`.
- Left alignment: Apply `padding-left: 1.2em;` to align bullet points properly with surrounding text.
- Example CSS rule:
  ```css
  /* Bullet point left alignment fix */
  ul.content-text {
      padding-left: 1.2em;
  }
  ```
- This ensures bullet points are visually aligned with paragraph content and don't appear too far left.

## Video Embeds
- Embed videos inside a `<div class="video-embed">` wrapper to maintain the responsive 16:9 aspect ratio defined by the global CSS.
- Use `<iframe>` embeds (YouTube/Vimeo) with `loading="lazy"`, `allowfullscreen`, and the allow attributes used in `gallery/my-friends-are-my-power-station/index.html`.
- Example:
  ```html
  <div class="video-embed">
    <iframe
      src="https://www.youtube.com/embed/VIDEO_ID?rel=0"
      title="Descriptive video title"
      loading="lazy"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowfullscreen
      referrerpolicy="strict-origin-when-cross-origin"></iframe>
  </div>
  ```
- Provide descriptive titles for accessibility and keep the `.video-embed` div inside the synced content region.

## Syncing Content
- Automatic (via scaffolder): `--sync` is on by default in `scripts/new-gallery.js`.
- Manual: `node scripts/sync-gallery.js --slug <slug>` or `node scripts/sync-gallery.js --dir gallery/<slug> --type two-column|stacked`.
- The script replaces the HTML between `<!-- SYNC:CONTENT-START -->` and `<!-- SYNC:CONTENT-END -->` in `index.html`.

## Tips
- Use `kebab-case` for the `<slug>` folder names (the script auto-slugifies and removes spaces/illegal chars).
- Keep images in `public/` and reference them as `./public/<name>.<ext>`.
- Prefer PNG/JPG; optimize image sizes before adding.

## Data Model (content/gallery.json)
- Required fields per project:
  - `date` — ISO `YYYY-MM-DD` (used for sorting)
  - `project name` — text
  - `tag` — text
  - `classification` — one of `UX/Product | Experiential | Content | Visual`
  - `coverImageUrl` — `gallery/<slug>/public/cover.png`
  - `projectUrl` — `gallery/<slug>/index.html`
  - `company` — text
- Sorting: newest first by `date`.
