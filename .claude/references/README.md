# Shared References

This directory contains reference documentation shared across multiple Claude Code skills.

## Purpose

Instead of duplicating reference files in each skill's `references/` directory, shared documentation is centralized here and accessed via symbolic links.

## Current Shared References

### GALLERY_GUIDE.md
Complete documentation of the gallery project workflow, content authoring format, and styling rules.

**Used by:**
- `skills/clone-project` - References formatting rules when creating new projects
- `skills/sync-markdown` - References formatting rules when syncing markdown to HTML

**Location:** `/.claude/references/GALLERY_GUIDE.md`

**Symlinks:**
- `skills/clone-project/references/GALLERY_GUIDE.md` → `../../../references/GALLERY_GUIDE.md`
- `skills/sync-markdown/references/GALLERY_GUIDE.md` → `../../../references/GALLERY_GUIDE.md`

## Benefits

1. **Single Source of Truth**: One file to maintain, changes propagate to all skills
2. **Consistency**: All skills reference identical documentation
3. **Easier Maintenance**: Update once, apply everywhere
4. **Reduced Duplication**: Saves disk space and reduces confusion

## Adding New Shared References

To add a new shared reference:

1. Place the file in `/.claude/references/`
2. Create symbolic links in each skill that needs it:
   ```bash
   ln -s ../../../references/<filename> .claude/skills/<skill-name>/references/<filename>
   ```
3. Update this README to document the new shared reference

## Updating Shared References

To update a shared reference:

1. Edit the file in `/.claude/references/`
2. Changes automatically apply to all skills via symlinks
3. No need to update individual skill directories
