# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal portfolio website for Xinyi Han, a UX Designer. It's a static website built with vanilla HTML, CSS, and JavaScript featuring a modern, minimalist design with dual-view project presentation (Gallery and Index views).

## Architecture

### Core Components

- **PortfolioManager Class** (`style/script.js`): Main JavaScript controller that manages view switching, animations, event handling, and real-time features
- **ComponentLoader System** (`components/component-loader.js`): Dynamic component loading for header/footer with automatic path detection for root vs. gallery pages
- **CSS Custom Properties** (`style/styles.css`): Centralized design system using CSS variables for colors, typography, spacing, and animations
- **JSON-Based Project System** (`content/gallery.json`): Single source of truth for all portfolio projects that dynamically populates both views
- **Dual View System**: Gallery view (card-based grid) and Index view (table-based list) with smooth transitions
- **Individual Project Pages**: Each project has its own directory under `gallery/` with dedicated HTML pages using shared components

### Key Design Patterns

- **Component-based architecture**: Reusable HTML components (header, footer) loaded dynamically with path-aware placeholder replacement
- **Path-aware loading**: ComponentLoader automatically detects page depth and adjusts relative paths for assets/navigation
- **Responsive-first**: Mobile-first CSS with progressive enhancement at 768px and 480px breakpoints
- **Animation system**: CSS transitions with JavaScript-triggered state changes using cubic-bezier easing
- **Real-time features**: Live Sydney timezone clock using Intl.DateTimeFormat API
- **Dynamic content loading**: Projects are loaded asynchronously from JSON and rendered dynamically with error handling

## File Structure Logic

- `index.html`: Main portfolio page with semantic HTML5 structure and component loading placeholders
- `style/styles.css`: Complete styling system with CSS Grid/Flexbox layouts and responsive breakpoints
- `style/script.js`: PortfolioManager class and utility functions for homepage interactivity
- `components/`: Shared HTML components and loading system
  - `component-loader.js`: Dynamic component loader with path detection
  - `header.html`, `footer.html`: Reusable page components with placeholder variables
  - `media-embeds.js`, `project-info.js`: Gallery page utilities for media and metadata display
- `content/gallery.json`: Project data source (single source of truth for all portfolio projects)
- `gallery/[project-name]/`: Individual project directories with `index.html`, assets, and `text.md` content
- `scripts/`: Automation utilities
  - `new-gallery.js`: CLI tool for scaffolding new gallery projects
  - `sync-gallery.js`: Syncs gallery.json with actual gallery directories
- `doc/`: Documentation and reference materials
  - `reference/`: Original design mockups (`web.png`, `web-gallery.png`)
  - `CV_XinyiHan.pdf`: Resume file linked in navigation
- `logo/`: Website favicon and branding assets
- `.claude/skills/clone-project/`: Claude Code skill for automated project creation

## Development Commands

### Preview Website
Use Live Server or similar local development server to preview changes. Do NOT use Python's simple HTTP server.

```bash
# Open with Live Server extension in VS Code
# Right-click index.html → "Open with Live Server"
```

### Adding New Projects

**Recommended: Use the clone-project skill**
The easiest way to add a new project is to use the built-in skill, which handles all scaffolding automatically:
- Simply ask: "create a new gallery project" or "add a portfolio project"
- The skill will guide you through template selection and metadata collection

**Manual method using CLI:**
```bash
# From project root
node scripts/new-gallery.js \
  --slug "project-slug" \
  --title "Project Title" \
  --template "two-column" \
  --date "2024-08-01" \
  --tags "Tag1, Tag2" \
  --company "Company Name" \
  --classification "UX/Product"

# Sync gallery.json with actual directories
node scripts/sync-gallery.js
```

**Manual method (not recommended):**
1. Create directory under `gallery/[project-slug]/`
2. Copy template HTML from `.claude/skills/clone-project/assets/templates/`
3. Add project metadata to `content/gallery.json`
4. Create `public/` folder and add cover image
5. Run `node scripts/sync-gallery.js` to validate

### Project Templates
- **two-column**: For case studies with sticky left titles and right content scrolling (best for UX/Product work)
- **stacked**: For visual/art projects with vertical flow of images and text

### Syncing Gallery Data
```bash
# Validates gallery.json against actual directories
node scripts/sync-gallery.js
```

### Content Updates
- **Personal info**: Update hero section and contact section in `index.html`
- **Styling**: Modify CSS custom properties in `:root` selector in `style/styles.css`
- **Navigation links**: Update `components/header.html` (changes apply site-wide)

## Important Implementation Details

### Component Loading System
- **Path Detection**: `ComponentLoader.detectPathLevel()` checks if page is in `/gallery/` subfolder
- **Placeholder Replacement**: Template variables like `{{HOME_LINK}}` are replaced with path-aware URLs
- **Component Injection**: Components loaded via `data-component="header"` attributes in HTML
- **Example placeholders**: `{{HOME_LINK}}`, `{{INFO_LINK}}`, `{{CONTACT_LINK}}`, `{{RESUME_LINK}}`

### Interactive Features (Homepage)
- **View Switching**: `PortfolioManager.switchView()` toggles between gallery-grid and index-table with opacity transitions
- **Keyboard Shortcuts**: `g` (Gallery), `i` (Index), `Esc` (reset to Gallery)
- **Real-time Clock**: Updates every second using `setInterval` with Sydney timezone (Intl.DateTimeFormat)
- **Dynamic Project Rendering**: Projects loaded from `gallery.json` and rendered into both view templates

### Gallery Page Features
- **Media Embeds**: `media-embeds.js` handles YouTube, Vimeo, and image galleries
- **Project Metadata**: `project-info.js` displays project details (date, tags, company) from metadata
- **Sticky Navigation**: Left-column titles in two-column layout remain visible while right content scrolls

### Styling System
- **CSS Variables**: All design tokens centralized in `:root` selector (colors, typography, spacing, animations)
- **Responsive Breakpoints**: 768px (tablet) and 480px (mobile) with mobile-first approach
- **Grid Layout**: Uses `auto-fit` with `minmax()` for responsive project cards
- **Animation Timing**: Consistent `cubic-bezier(0.4, 0, 0.2, 1)` easing across transitions

### Browser Compatibility
Targets modern browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+) with CSS Grid, Flexbox, and ES6+ features.

## JSON Project Data Structure

Each project in `content/gallery.json` must include these exact field names:

```json
{
  "date": "YYYY-MM-DD",
  "project name": "Project Title",
  "tag": "Tag1, Tag2, Tag3",
  "classification": "UX/Product",
  "coverImageUrl": "gallery/project-slug/public/cover.png",
  "projectUrl": "gallery/project-slug/index.html",
  "company": "Company Name"
}
```

**Field requirements:**
- `date`: ISO format (YYYY-MM-DD). Will be displayed as YYYY.MM on pages
- `project name`: Full display title
- `tag`: Comma-separated tags for filtering/display
- `classification`: Must be one of: `UX/Product`, `Experiential`, `Content`, `Visual`
- `coverImageUrl`: Relative path from root (no leading `./`)
- `projectUrl`: Relative path from root (no leading `./`)
- `company`: Organization name, or use `"-"` if not applicable

**Important:** The field names use spaces (`"project name"`, not `"projectName"`). This is the established convention in the codebase.

## Data Flow and Updates

### Updating Personal Information
- **Source**: `doc/resume/cv.md` contains original content
- **Implementation**: Manually sync changes to `index.html` hero and contact sections
- **Navigation**: Update `components/header.html` for site-wide changes

### Cache Busting
- `index.html` includes a fetch wrapper that adds timestamp query params to `gallery.json` requests
- Ensures homepage always shows latest projects without hard refresh
- Other static assets rely on browser cache

## Performance Considerations

- Staggered animations using `setTimeout` to prevent layout thrashing
- Minimal external dependencies (only Google Fonts via preconnect)
- Component-based architecture reduces duplication across gallery pages
- JSON preloading with `<link rel="preload">` for faster initial render
