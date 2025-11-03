# Clone Project Skill

A skill for creating new gallery projects for the personal portfolio website with automated scaffolding, template selection, and content syncing.

## What This Skill Does

Automates the complete workflow for adding new portfolio projects to the gallery, including:
- Interactive parameter collection
- Project scaffolding with template selection
- Metadata management in gallery.json
- Content syncing from Markdown to HTML

## When to Use

Trigger this skill when you want to:
- Create a new gallery/portfolio project
- Add a case study to the website
- Clone a project structure
- Set up a new project page

## Trigger Phrases

- "create gallery project"
- "clone project"
- "add portfolio project"
- "new case study"
- "create new project"

## Structure

```
clone-project/
├── SKILL.md                           # Main skill instructions
├── README.md                          # This file
├── scripts/
│   ├── new-gallery.js                 # Project scaffolding script
│   └── sync-gallery.js                # Content sync utility
├── assets/
│   └── templates/
│       ├── two-column/                # Two-column layout template
│       │   ├── index.html
│       │   └── text.md
│       └── stacked/                   # Stacked layout template
│           ├── index.html
│           └── text.md
└── references/
    └── GALLERY_GUIDE.md               # Complete workflow documentation
```

## Key Features

1. **Two Template Types:**
   - Two-column: For case studies and product narratives
   - Stacked: For art/visual projects

2. **Automated Workflow:**
   - Creates project directory structure
   - Generates HTML with metadata
   - Updates gallery.json with new entry
   - Auto-syncs Markdown content to HTML

3. **Flexible Date Formats:**
   - Accepts: YYYY-MM-DD, YYYY.MM, YYYY-MM, or YYYY
   - Stores as ISO format for sorting
   - Displays as YYYY.MM on pages

4. **Content Authoring:**
   - Write content in Markdown (text.md)
   - Automatic conversion to HTML
   - Support for sections, subsections, images, lists
   - Use the `.video-embed` wrapper with iframe embeds for any videos (see guide example)

## Usage Example

When Claude uses this skill, it will:
1. Ask user for project details (template, title, date, tags, etc.)
2. Validate inputs
3. Execute `node scripts/new-gallery.js` with parameters
4. Confirm creation and guide user on next steps

## Next Steps After Project Creation

1. Add `cover.png` to `gallery/<slug>/public/`
2. Edit `gallery/<slug>/text.md` with actual content
3. Add body images to `public/` directory
4. Preview the project in browser

## Dependencies

- Node.js (for running scripts)
- No external npm packages required

## Notes

- Scripts are self-contained with no external dependencies
- Templates use vanilla HTML/CSS/JavaScript
- All resources are bundled within the skill for portability
