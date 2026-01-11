# Decap CMS Workflow Diagram

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           USER (iPhone/Desktop)                         │
│                                                                        │
│  1. Opens /admin/ URL in browser                                       │
│  2. Clicks "Login with GitHub"                                         │
│  3. Creates/Edits albums and categories                                 │
│  4. Uploads photos from camera roll or file system                     │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                                 │ HTTPS Request
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         GitHub OAuth Server                             │
│                                                                        │
│  5. Authenticates user                                                 │
│  6. Requests authorization for OAuth App                               │
│  7. Returns access token                                               │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                                 │ Token + Data
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         Decap CMS (Browser)                             │
│                                                                        │
│  8. Loads config.yml from public/admin/                                │
│  9. Displays UI for albums/categories                                   │
│  10. Creates JSON files in src/content/                                 │
│  11. Uploads images to src/assets/images/                               │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                                 │ GitHub API Commit
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           GitHub Repository                             │
│                                                                        │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │  src/content/albums/          ← Album JSON files                │  │
│  │  src/content/categories/      ← Category JSON files             │  │
│  │  src/assets/images/albums/    ← Uploaded photos                 │  │
│  │  src/assets/images/categories/← Category cover images           │  │
│  └─────────────────────────────────────────────────────────────────┘  │
│                                                                        │
│  12. New commit created with:                                          │
│      - Updated JSON files                                              │
│      - New image files                                                  │
│      - Commit message: "Create Album [title]"                          │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                                 │ Push to main
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        GitHub Actions (CI/CD)                          │
│                                                                        │
│  13. Triggered by push to main branch                                  │
│  14. Checkout repository                                               │
│  15. npm ci (install dependencies)                                      │
│  16. astro build (generate static site)                                │
│      - Reads src/content/albums/*.json                                 │
│      - Reads src/content/categories/*.json                             │
│      - Optimizes images from src/assets/images/                        │
│      - Generates HTML in dist/                                         │
│  17. Deploy to GitHub Pages                                            │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                                 │ Static Files
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         GitHub Pages (Hosting)                          │
│                                                                        │
│  URL: https://username.github.io/portfolio-site/                       │
│                                                                        │
│  Serves:                                                               │
│  - / (homepage with album grid)                                        │
│  - /album/[id] (individual album pages)                                │
│  - /category/[id] (category filtered pages)                            │
│  - /admin/ (Decap CMS interface)                                       │
│  - /assets/images/ (optimized images)                                  │
└─────────────────────────────────────────────────────────────────────────┘
                                 │
                                 │ HTTPS Response
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          Website Visitors                               │
│                                                                        │
│  - View photo galleries                                                 │
│  - Browse albums by category                                           │
│  - Click photos to view in lightbox                                    │
│  - Navigate between albums                                             │
└─────────────────────────────────────────────────────────────────────────┘
```

## File Flow

### Content Creation Flow

```
User Action (Decap CMS UI)
    │
    ├─→ Create Category
    │       └─→ src/content/categories/dogs.json
    │       └─→ src/assets/images/categories/dogs/cover.jpg
    │
    └─→ Create Album
            ├─→ src/content/albums/summer-2024.json
            ├─→ src/assets/images/albums/summer-2024/cover.jpg
            └─→ src/assets/images/albums/summer-2024/
                ├─ photo-001.jpg
                ├─ photo-002.jpg
                └─ photo-003.jpg
```

### Build Process Flow

```
GitHub Actions Trigger
    │
    ├─→ Read Content
    │       ├─→ src/content/albums/*.json
    │       └─→ src/content/categories/*.json
    │
    ├─→ Optimize Images
    │       ├─→ Resize to responsive sizes
    │       ├─→ Convert to AVIF/WebP
    │       └─→ Generate srcsets
    │
    ├─→ Generate Pages
    │       ├─→ index.html (album grid)
    │       ├─→ album/[id]/index.html
    │       └─→ category/[id]/index.html
    │
    └─→ Deploy to GitHub Pages
            └─→ dist/ → gh-pages branch
```

## Key Integration Points

### 1. Astro + Decap CMS

**astro.config.mjs**
```javascript
site: 'https://username.github.io'
base: '/portfolio-site'
```

**public/admin/config.yml**
```yaml
backend:
  name: github
  branch: main
  repo: username/portfolio-site
```

### 2. Content Structure

**JSON Files (CMS-created)**
```json
// src/content/albums/summer-2024.json
{
  "title": "Summer 2024",
  "category": "dogs",
  "date": "2024-06-15",
  "description": "Beach trip",
  "cover": "/assets/images/albums/summer-2024/cover.jpg",
  "photos": [
    "/assets/images/albums/summer-2024/001.jpg",
    "/assets/images/albums/summer-2024/002.jpg"
  ]
}
```

**Image Paths (CMS-managed)**
```
src/assets/images/albums/summer-2024/cover.jpg
    ↓ (Astro build optimization)
dist/_astro/cover.[hash].avif
dist/_astro/cover.[hash].webp
```

### 3. GitHub OAuth Flow

```
1. User clicks "Login" in CMS
2. Browser redirects to github.com/login/oauth/authorize
   ?client_id=YOUR_CLIENT_ID
   &redirect_uri=https://site.github.io/portfolio-site/admin/
   &scope=repo
3. User authorizes OAuth App
4. GitHub redirects back with code
5. CMS exchanges code for access token
6. CMS uses token for GitHub API calls
```

## Security Considerations

### Public Repository (Recommended)

```
┌─────────────────────────────────────────┐
│  GitHub OAuth (Standard Flow)           │
│  - Client ID in config.yml (public)     │
│  - Client Secret via env variable       │
│  - No personal access tokens needed     │
│  - User grants repo permissions         │
└─────────────────────────────────────────┘
```

### Private Repository (Alternative)

```
┌─────────────────────────────────────────┐
│  Personal Access Token (Classic)        │
│  - Generate token with 'repo' scope     │
│  - Store in environment variable        │
│  - Never commit to repository           │
│  - Rotate periodically                  │
└─────────────────────────────────────────┘
```

## Data Flow Summary

| Phase | Location | Action | Result |
|-------|----------|--------|--------|
| **Auth** | GitHub | User logs in | Access token granted |
| **Create** | CMS (Browser) | User creates content | JSON + images staged |
| **Commit** | GitHub API | CMS pushes changes | New commit on main |
| **Build** | GitHub Actions | Triggered by push | Static site generated |
| **Deploy** | GitHub Pages | Artifacts published | Live site updated |
| **View** | Visitor browser | Requests pages | Optimized HTML served |

## Performance Characteristics

### Content Creation (CMS Side)

- **Login**: 2-3 seconds (GitHub OAuth)
- **Create category**: ~5 seconds
- **Upload photo (2MB)**: 5-10 seconds (depends on connection)
- **Create album (10 photos)**: 1-2 minutes
- **Commit to GitHub**: 2-5 seconds

### Build & Deploy (CI/CD)

- **Build trigger**: Immediate (webhook)
- **Install deps**: 30-60 seconds (cached after first run)
- **Astro build**: 30-90 seconds (depends on image count)
- **Deploy to Pages**: 10-30 seconds
- **Total time**: 2-4 minutes for typical update

### Visitor Experience

- **Initial page load**: 1-2 seconds
- **Image loading**: Lazy load, prioritize above-fold
- **Navigation**: Instant (pre-rendered pages)
- **Lightbox**: <100ms (cached images)

---

**Last Updated**: 2025-01-11
