# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal portfolio website for Xinyi Han, a UX Designer. It's a static website built with vanilla HTML, CSS, and JavaScript featuring a modern, minimalist design with dual-view project presentation (Gallery and Index views).

## Architecture

### Core Components

- **PortfolioManager Class** (`style/script.js`): Main JavaScript controller that manages view switching, animations, event handling, and real-time features
- **CSS Custom Properties** (`style/styles.css`): Centralized design system using CSS variables for colors, typography, spacing, and animations  
- **JSON-Based Project System** (`content/gallery.json`): Dynamic project loading system that feeds both Gallery and Index views
- **Dual View System**: Gallery view (card-based grid) and Index view (table-based list) with smooth transitions
- **Individual Project Pages**: Each project has its own directory under `gallery/` with dedicated HTML pages

### Key Design Patterns

- **Responsive-first**: Mobile-first CSS with progressive enhancement
- **Component-based styling**: Modular CSS with clear component boundaries
- **Animation system**: Uses CSS transitions with JavaScript-triggered state changes
- **Real-time features**: Live Sydney timezone clock using Intl.DateTimeFormat API
- **Dynamic content loading**: Projects are loaded asynchronously from JSON and rendered dynamically

## File Structure Logic

- `index.html`: Single-page application with semantic HTML5 structure
- `style/styles.css`: Complete styling system with CSS Grid/Flexbox layouts and responsive breakpoints
- `style/script.js`: Object-oriented JavaScript with PortfolioManager class and utility functions
- `content/gallery.json`: Project data source containing all portfolio projects with metadata
- `gallery/[project-name]/`: Individual project directories with dedicated pages and assets
- `doc/reference/`: Contains original design mockups (`web.png`, `web-gallery.png`) that serve as visual reference
- `doc/resume/cv.md`: Source content for personal information integrated into the site
- `logo/`: Website favicon and branding assets

## Development Commands

### Preview Website
```bash
open index.html  # Opens in default browser
```

### Syntax Validation
```bash
# HTML validation
python3 -c "import html.parser; ..."  # Custom validation script

# CSS validation  
python3 -c "# Check bracket matching and core rules"

# JavaScript validation
node -c style/script.js
```

### Adding New Projects
Projects are managed through the JSON-based system:
1. Add project data to `content/gallery.json` with required fields (date, project name, tag, classification, coverImageUrl, projectUrl, company)
2. Create project directory under `gallery/[project-name]/` with `index.html` and assets
3. Projects will automatically appear in both Gallery and Index views

### Content Updates
- Personal info: Update content in hero section and contact section in `index.html`
- Styling: Use CSS custom properties in `:root` for consistent theming in `style/styles.css`

## Important Implementation Details

### Interactive Features
- **View Switching**: Managed by `switchView()` method with opacity transitions and display toggling
- **Keyboard Shortcuts**: `g` (Gallery), `i` (Index), `Esc` (reset to Gallery)
- **Animation Queue**: Uses `AnimationManager` class with `requestAnimationFrame` for performance
- **Real-time Clock**: Updates every second using `setInterval` with timezone formatting

### Styling System
- **CSS Variables**: All design tokens centralized in `:root` selector
- **Responsive Breakpoints**: 768px and 480px with mobile-first approach
- **Grid Layout**: `auto-fit` with `minmax()` for responsive project cards
- **Animation Timing**: Uses `cubic-bezier(0.4, 0, 0.2, 1)` for consistent easing

### Browser Compatibility
Targets modern browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+) with CSS Grid, Flexbox, and ES6+ features.

## JSON Project Data Structure

Each project in `content/gallery.json` requires these fields:
```json
{
  "date": "YYYY-MM-DD",
  "project name": "Project Title",
  "tag": "Tag1, Tag2",
  "classification": "Category",
  "coverImageUrl": "./gallery/project-name/public/cover.png",
  "projectUrl": "./gallery/project-name/index.html",
  "company": "Company Name or -"
}
```

Personal information updates should be made directly in `index.html`. Reference `doc/resume/cv.md` for source content but sync changes manually to the HTML.

## Performance Considerations

- Uses `debounce` and `throttle` utilities for scroll and resize events
- Implements staggered animations to prevent jank
- Lazy-loads animations using `setTimeout` for performance
- Minimal external dependencies (only Google Fonts)