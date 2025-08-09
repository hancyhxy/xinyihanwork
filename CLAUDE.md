# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal portfolio website for Xinyi Han, a UX Designer. It's a static website built with vanilla HTML, CSS, and JavaScript featuring a modern, minimalist design with dual-view project presentation (Gallery and Index views).

## Architecture

### Core Components

- **PortfolioManager Class** (`script.js`): Main JavaScript controller that manages view switching, animations, event handling, and real-time features
- **CSS Custom Properties** (`styles.css`): Centralized design system using CSS variables for colors, typography, spacing, and animations
- **Dual View System**: Gallery view (card-based grid) and Index view (table-based list) with smooth transitions

### Key Design Patterns

- **Responsive-first**: Mobile-first CSS with progressive enhancement
- **Component-based styling**: Modular CSS with clear component boundaries
- **Animation system**: Uses CSS transitions with JavaScript-triggered state changes
- **Real-time features**: Live Sydney timezone clock using Intl.DateTimeFormat API

## File Structure Logic

- `index.html`: Single-page application with semantic HTML5 structure
- `styles.css`: Complete styling system with CSS Grid/Flexbox layouts and responsive breakpoints
- `script.js`: Object-oriented JavaScript with PortfolioManager class and utility functions
- `doc/reference/`: Contains original design mockups (`web.png`, `web-gallery.png`) that serve as visual reference
- `doc/resume/cv.md`: Source content for personal information integrated into the site

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
node -c script.js
```

### Asset Management
Personal content and project data are embedded directly in HTML. To update:
- Projects: Modify `.project-card` and `.project-row` elements in `index.html`
- Personal info: Update content in hero section and contact section
- Styling: Use CSS custom properties in `:root` for consistent theming

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

## Content Updates

Personal information is sourced from `doc/resume/cv.md`. When updating professional experience or projects:
1. Update the markdown file for documentation
2. Manually sync changes to HTML content sections
3. Add new project cards/rows following existing patterns
4. Update project data in JavaScript if dynamic features are needed

## Performance Considerations

- Uses `debounce` and `throttle` utilities for scroll and resize events
- Implements staggered animations to prevent jank
- Lazy-loads animations using `setTimeout` for performance
- Minimal external dependencies (only Google Fonts)