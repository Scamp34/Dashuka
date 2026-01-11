# Decap CMS Configuration

## Overview

Decap CMS provides a web-based interface for managing site content (albums, categories) through GitHub. All CMS operations create commits directly to the repository, enabling content updates from mobile devices without requiring development tools.

## Architecture

```
User (iPhone) → Decap CMS UI → GitHub OAuth → Git Commit → Repository
                                                      ↓
                                              GitHub Actions Build
                                                      ↓
                                                  GitHub Pages
```

### Key CMS Settings

Decap CMS uses two critical folder settings that serve different purposes:

| Setting | Purpose | Example |
|---------|---------|---------|
| `media_folder` | Filesystem location where CMS saves uploaded files | `src/assets/images` |
| `public_folder` | URL path that CMS writes to JSON files for image references | `/images` |

**Critical**: These paths are intentionally different. CMS uploads to `src/assets/images` but writes `/images` to JSON because Astro serves files from `public/` at the base URL path.

### Why This Structure

1. **Static file serving**: Astro serves files from `public/` directly at the root URL (`/images/file.jpg`)
2. **Build processing**: Files in `src/` are processed by Astro bundler; files in `public/` are copied as-is
3. **CMS limitation**: CMS cannot write directly to `public/` during development
4. **URL correctness**: JSON files must reference `/images/` to match what Astro serves

### Path Mismatch Prevention

The CMS `public_folder` setting must always match Astro's actual static file serving path:

```
CMS Configuration:
  media_folder: "src/assets/images"  # Where uploads go (filesystem)
  public_folder: "/images"           # What gets written to JSON (URLs)

Astro serves from: public/images/    # Actual file location
JSON references: /images/             # URL path in JSON files
```

**Common failure mode**: If `public_folder` is set to `/assets/images`, JSON files will contain broken paths because Astro serves from `public/`, not `src/`. This causes all album and category images to return 404.

**Fix**: Update `public_folder` to `/images` and correct all existing JSON paths via mass-replace (`/assets/images/` → `/images/`).

### Invariants

- `media_folder` must match actual filesystem location where CMS can write
- `public_folder` must match URL path that Astro serves images from
- After uploading via CMS, images must be moved from `src/assets/images/` to `public/images/`
- JSON files always contain paths starting with `/images/`, never `/assets/images/`

## File Structure

```
admin/
├── config.yml          # Development CMS configuration
├── config.example.yml  # Template for new installations
└── index.html          # CMS entry point (development)
```

The production CMS uses copies in `public/admin/` to ensure consistency across environments.

## Configuration Collections

CMS config defines content collections that map to JSON files:

- **albums**: Edits `src/content/albums/{id}.json` with cover, photos array, metadata
- **categories**: Edits `src/content/categories/{id}.json` with cover, description

Each collection defines fields that match the JSON schema used by Astro components.

## Common Tasks

### Add a new CMS collection

1. Add collection entry to `config.yml` with:
   - `name`: Internal identifier
   - `label`: Display name in CMS UI
   - `folder`: Path to JSON files (relative to project root)
   - `create`: Boolean to allow new entries
   - `fields`: Array matching JSON schema
2. Corresponding JSON files become editable in CMS

### Change image upload location

Update both `media_folder` and ensure moved images end up in `public/images/`:
- CMS uploads to `media_folder` location
- Manual or automated step moves files to `public/`
- JSON files reference via `public_folder` path

## Troubleshooting

### Images return 404 errors

**Symptoms**: All album/category images broken, browser DevTools shows 404 for image requests

**Root cause**: `public_folder` in `config.yml` doesn't match Astro's actual serving path

**Verification**:
```bash
# Check what CMS is writing to JSON
grep -r "public_folder" admin/config.yml

# Check what paths exist in JSON files
grep -o '"/[^"]*"' src/content/albums/*.json | head -5

# Check where images actually exist
ls public/images/albums/
```

**Fix**:
1. Update `public_folder` in `admin/config.yml` to `/images`
2. Mass-replace incorrect paths in all JSON files:
   ```bash
   find src/content -name "*.json" -exec sed -i '' 's|/assets/images/|/images/|g' {} +
   ```
3. Sync `public/admin/config.yml` with development config
4. Restart dev server and verify images load
