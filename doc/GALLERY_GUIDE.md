# Gallery Project Workflow and Templates

This guide standardizes how to add new gallery projects with two templates and consistent image behavior.

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
- `index.html` — page markup using one of the templates.
- `public/` — images (`cover.png` for hero/OG if needed, plus body images).
- `text.md` — source content in the agreed format to replace into `index.html`.

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

### Option B: Manual copy
- Copy a template folder from `gallery/_templates/<type>/` into `gallery/<slug>/`.
- Update metadata (title, brief, meta tags) in `index.html`.
- Replace `text.md` with your content and add images under `public/`.

## Content Authoring (text.md format)
Use YAML frontmatter for metadata and Markdown for content:

```
---
title: Project Title
date: 2024.10
tag: Localization Strategy, Information Architecture
company: Alibaba
description: One-line SEO description for meta.
hero: ./public/cover.png
---

# Sections

## 1. Section Title
Paragraph text here.

![Alt text](./public/image1.png)

## 2. Another Section
More text.
```

Note: The site does not auto-parse `text.md`. Use it as the source of truth to paste into `index.html`, or extend the tooling to generate HTML from Markdown if needed.

## Hero Image
- Templates include a hero image with an automatic fallback: if `./public/cover.png` is missing, a gradient placeholder renders instead.
- Default hero uses `aspect-ratio: 2/1; object-fit: cover;` controlled per-page CSS.

## Body Images
- Use `<img class="project-image" src="..." alt="...">` inside content.
- Body images automatically keep their intrinsic ratio and resize responsively.
- Homepage cards have an image onerror fallback that shows a placeholder if the file is missing.

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
