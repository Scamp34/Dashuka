# Photo Portfolio Site - Project Index

## Architecture Overview

This is a static photo portfolio site built with Astro, managed through Decap CMS, and deployed via GitHub Pages. Content (albums, categories, photos) is stored as JSON in the repository and edited through a web-based CMS interface accessible from mobile devices.

```
User (iPhone) → Decap CMS → GitHub Commit → GitHub Actions → Build → GitHub Pages
```

## Project Files

| File | What | When to Read/Modify |
|------|------|-------------------|
| **Configuration** ||||
| `package.json` | Project dependencies and npm scripts (dev, build, preview) | Adding dependencies, updating versions |
| `astro.config.mjs` | Astro framework configuration (site URL, base path, integrations, image optimization) | Changing site URL, configuring build output, setting image service |
| `tailwind.config.mjs` | Tailwind CSS configuration (theme, dark mode, custom colors) | Customizing design system, adding colors/fonts |
| `tsconfig.json` | TypeScript configuration for Astro components | Type checking setup, adding path aliases |
| `.gitignore` | Git ignore patterns (node_modules, dist, .env) | Adding files to exclude from version control |
| **Deployment** ||||
| `.github/workflows/deploy.yml` | GitHub Actions CI/CD pipeline for automatic deployment | Modifying build steps, changing Node version, adding deployment stages |
| **CMS Configuration** ||||
| `admin/config.yml` | Decap CMS configuration (backend, collections, fields) | Adding CMS collections, customizing fields, configuring GitHub OAuth |
| `admin/config.example.yml` | Example configuration template for setup reference | Setting up CMS for new installation |
| `admin/index.html` | CMS entry point for development environment | Debugging CMS loading issues |
| `public/admin/config.yml` | Production CMS configuration (synced with admin/config.yml) | CMS settings for deployed site |
| `public/admin/index.html` | CMS entry point for production environment | Production CMS access |
| **Pages (Routes)** ||||
| `src/pages/index.astro` | Homepage - displays all albums in masonry grid with category filters | Modifying homepage layout, changing album display order, adding hero section |
| `src/pages/album/[id].astro` | Individual album page - shows all photos in an album with lightbox | Customizing album view, adding metadata display, changing photo grid layout |
| `src/pages/category/[id].astro` | Category page - shows all albums belonging to a category | Modifying category page layout, adding category description, changing album grouping |
| `src/pages/admin.astro` | CMS redirect page - forwards to admin interface | Customizing admin access page |
| **Components** ||||
| `src/components/AlbumCard.astro` | Album card component for homepage grid (cover image, title, date, hover effects) | Changing album card design, adding metadata fields, modifying hover animations |
| `src/components/PhotoGrid.astro` | Masonry grid layout for photos with lazy loading | Adjusting grid columns, changing image aspect ratios, customizing gap/spacing |
| `src/components/Lightbox.astro` | Full-screen photo viewer with keyboard/touch navigation | Modifying lightbox behavior, adding slideshow mode, customizing UI controls |
| `src/components/Navigation.astro` | Site navigation menu (categories, mobile hamburger menu, desktop horizontal links) | Changing navigation layout, adding external links, customizing mobile menu |
| **Layouts** ||||
| `src/layouts/Layout.astro` | Base HTML layout with dark theme, meta tags, fonts, footer | Modifying site-wide styling, adding analytics, changing theme colors |
| **Content - Categories** ||||
| `src/content/categories/dogs.json` | Dogs category metadata (title, description, cover image) | Editing category info, updating cover image |
| `src/content/categories/nature.json` | Nature category metadata | Editing category info, updating cover image |
| `src/content/categories/people.json` | People category metadata | Editing category info, updating cover image |
| **Content - Albums** ||||
| `src/content/albums/golden-retriever.json` | Golden Retriever album (title, date, description, photos array, cover) | Editing album info, adding/removing photos |
| `src/content/albums/husky-portrait.json` | Husky Portrait album | Editing album info, adding/removing photos |
| `src/content/albums/family-portrait.json` | Family Portrait album | Editing album info, adding/removing photos |
| `src/content/albums/friends-park.json` | Friends in the Park album | Editing album info, adding/removing photos |
| `src/content/albums/mountain-lake.json` | Mountain Lake album | Editing album info, adding/removing photos |
| `src/content/albums/sunset-beach.json` | Sunset Beach album | Editing album info, adding/removing photos |
| **Assets** ||||
| `src/assets/images/categories/*/cover.jpg` | Category cover images | Replacing category thumbnails |
| `src/assets/images/albums/*/` | Album photo directories (cover.jpg, 001.jpg, 002.jpg, etc.) | Adding photos, organizing album images |
| **Documentation** ||||
| `README.md` | Developer documentation (setup, commands, deployment, troubleshooting) | Onboarding new developers, referencing commands |
| `CLAUDE.md` | This file - project index with file descriptions | Understanding project structure, finding specific files |
| `INSTRUCTIONS.md` | Russian language user guide for managing site from iPhone | Teaching daughter how to use CMS |
| `DECAP_CMS_SETUP.md` | Complete Decap CMS and GitHub OAuth setup guide | Initial CMS configuration, OAuth troubleshooting |
| `ADMIN_QUICKSTART.md` | Quick reference guide for CMS usage | Fast lookup of common CMS tasks |
| `DECAP_CMS_WORKFLOW.md` | Detailed workflow for content management | Understanding end-to-end content creation process |
| `MILESTONE_3_SUMMARY.md` | Summary of Milestone 3 implementation | Reviewing CMS implementation decisions |

## Content Structure

### Categories
Located in `src/content/categories/`, each category JSON file contains:
- `id`: Unique identifier (used in URL)
- `title`: Display name
- `description`: Category description
- `cover`: Path to cover image

### Albums
Located in `src/content/albums/`, each album JSON file contains:
- `id`: Unique identifier (used in URL)
- `title`: Album title
- `category`: Category ID this album belongs to
- `date`: Publication date (ISO 8601 format)
- `description`: Album description
- `cover`: Path to cover image
- `photos`: Array of photo paths

## Image Storage

All images are stored in `src/assets/images/`:

```
src/assets/images/
├── categories/
│   ├── dogs/
│   │   └── cover.jpg
│   ├── nature/
│   │   └── cover.jpg
│   └── people/
│       └── cover.jpg
└── albums/
    ├── golden-retriever/
    │   ├── cover.jpg
    │   ├── 001.jpg
    │   ├── 002.jpg
    │   └── ...
    ├── husky-portrait/
    │   └── ...
    └── ...
```

Image paths in content files use absolute paths from `/assets/images/`.

## Build Output

Running `npm run build` generates static files in `dist/`:

```
dist/
├── index.html
├── album/
│   ├── golden-retriever/
│   │   └── index.html
│   └── ...
├── category/
│   ├── dogs/
│   │   └── index.html
│   └── ...
├── admin/
│   └── index.html
├── _astro/
│   ├── (optimized CSS/JS bundles)
│   └── (optimized images in AVIF/WebP formats)
└── assets/
    └── images/
        └── (copied from src/assets/images)
```

## Key Technologies

- **Astro**: Static site generator with island architecture for partial hydration
- **Decap CMS**: Git-based headless CMS with GitHub OAuth integration
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Sharp**: High-performance image processor for optimization
- **GitHub Actions**: CI/CD for automated testing and deployment
- **GitHub Pages**: Static site hosting with custom domain support

## Design Decisions

| Decision | Rationale |
|----------|-----------|
| Astro over Jekyll | Superior image optimization (AVIF/WebP), modern DX, faster builds |
| Decap CMS over database CMS | Git-based versioning, free hosting, no server costs, works on mobile |
| JSON content files | Simple to edit manually, easy to validate, CMS-compatible |
| Dark theme default | Photos stand out better, matches reference design |
| Masonry grid layout | Shows varied aspect ratios without cropping, modern portfolio aesthetic |
| Separate admin/public config | Supports different environments (dev vs production) |
| GitHub Actions deployment | Free, automated, integrates with existing repository |

## Common Tasks

### Add a new category
1. Create new JSON in `src/content/categories/{id}.json`
2. Add cover image to `src/assets/images/categories/{id}/cover.jpg`
3. Category automatically appears in navigation

### Add a new album
1. Create album directory in `src/assets/images/albums/{id}/`
2. Upload photos (cover.jpg, 001.jpg, 002.jpg, etc.)
3. Create JSON in `src/content/albums/{id}.json`
4. Album automatically appears on homepage and category page

### Change site colors
1. Edit `tailwind.config.mjs` to add custom colors
2. Update `src/layouts/Layout.astro` for global styles
3. Modify component files for specific element styling

### Customize navigation
1. Edit `src/components/Navigation.astro`
2. Categories are dynamically loaded from content files
3. Add external links or modify layout as needed

## Development Workflow

1. **Local development**: `npm run dev` → http://localhost:4321
2. **Edit content**: Use CMS at `/admin` or edit JSON files directly
3. **Test changes**: Check locally, run `npm run build` to verify
4. **Deploy**: Push to `main` branch → GitHub Actions auto-deploys
5. **Monitor**: Check GitHub Actions tab for build status

## Security Considerations

- OAuth tokens stored in GitHub Secrets (never in repository)
- CMS access requires GitHub authentication
- Public repository recommended for simpler OAuth flow
- CMS commits are traceable to GitHub user accounts
- Image uploads validated by CMS configuration
