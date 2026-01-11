# Fix Image Path Resolution for Nested URLs

## Overview

Images display correctly on the homepage (`/Dashuka/`) but break on nested pages (`/Dashuka/category/dogs/`, `/Dashuka/album/darcy/`) because relative paths in `src` attributes resolve differently depending on URL depth. The solution adds a centralized `imagePath()` helper function in `urls.ts` and updates all image-rendering components to use it.

## Planning Context

### Decision Log

| Decision | Reasoning Chain |
| ---------- | --------------- |
| Helper function over inline "/" prefix | Centralized URL management exists in `urls.ts` with `withBase()` for routes -> Using this pattern maintains consistency across the codebase -> Single source of truth for base path configuration reduces future maintenance |
| Separate `imagePath()` from `withBase()` | `withBase()` is designed for route URLs (always starts with "/") -> Image paths in JSON are relative without leading slash -> Separate function prevents confusion and allows different behavior if needed |
| Relative paths in JSON files | Absolute paths with "/" would break without helper -> Relative paths work naturally when base path is prepended -> Consistent with existing content structure |

### Rejected Alternatives

| Alternative | Why Rejected |
| ------------ | ------------- |
| Inline string concatenation in components | Duplicates logic across 3+ files -> Violates DRY principle -> Harder to maintain if base path changes |
| Absolute paths with "/" in JSON files | Require stripping leading "/" before prepending base path -> Adds unnecessary complexity to helper function |

### Constraints & Assumptions

- **Technical**: Astro `base: '/Dashuka'` configuration in `astro.config.mjs`
- **Existing patterns**: `urls.ts` contains `basePath` constant and `withBase()` helper for routes
- **Backward compatibility**: Must not break existing JSON content files
- **Default conventions**: Follow DRY principle (default-conventions domain='duplicate-logic')

### Known Risks

| Risk | Mitigation | Anchor |
| ------------ | ------------- | -------- |
| Double base path prefix | Invariant: JSON files always contain relative paths without leading "/" -> CMS controls content creation -> Manual edits must follow same convention | `src/lib/urls.ts:6` - basePath already has "/" |
| Astro image optimization breaks | Paths remain relative in JSON, only HTML output changes | `astro.config.mjs:20-26` - Sharp service works with resolved paths |

## Invisible Knowledge

### Architecture

```
Browser requests image at /Dashuka/album/darcy/
                        |
                        v
              AlbumCard.astro / PhotoGrid.astro
                        |
                        v
              src={imagePath(album.cover)}
                        |
                        v
              imagePath() prepends "/Dashuka/"
                        |
                        v
              HTML: src="/Dashuka/images/albums/darcy/cover.jpg"
                        |
                        v
              Browser requests: /Dashuka/images/albums/darcy/cover.jpg
                        |
                        v
              Astro serves: public/images/albums/darcy/cover.jpg
```

### Why This Structure

The `urls.ts` module serves as the single source of truth for URL construction in this project. All page navigation URLs (`albumUrl`, `categoryUrl`) already use the `withBase()` helper. Adding `imagePath()` extends this pattern to static assets, ensuring that:

1. Base path configuration changes only require editing one file
2. URL construction logic is tested and auditable in one place
3. Future developers can understand URL handling by reading a single module

### Invariants

- All image paths in JSON files are relative (no leading "/") - **precondition for `imagePath()` function**
- All `imagePath()` calls produce absolute paths from domain root (including base path)
- Base path always starts with "/" and includes the `base` value from `astro.config.mjs`
- **Precondition**: `imagePath()` expects valid string input - missing/undefined fields indicate malformed JSON

### Tradeoffs

- **Consistency vs. verbosity**: Helper function adds a function call overhead in templates, but this is negligible compared to network I/O for images
- **Centralization vs. simplicity**: Helper function requires importing and calling, but eliminates duplicated string concatenation logic

## Milestones

### Milestone 1: Add `imagePath()` Helper Function

**Files**: `src/lib/urls.ts`

**Requirements**:

- Add `imagePath()` function that prepends `basePath + "/"` to relative image paths
- Export function for use in components

**Acceptance Criteria**:

- `imagePath("images/albums/darcy/cover.jpg")` returns `/Dashuka/images/albums/darcy/cover.jpg`
- Function is exported and importable in `.astro` components

**Tests**:

- **Test files**: None (manual verification in browser)
- **Test type**: Skip - pure function with deterministic behavior verified manually
- **Backing**: user-specified
- **Skip reason**: Simple string concatenation, verified by manual browser testing

**Code Intent**:

- Add new function `imagePath(path: string): string` after existing `withBase()` function
- Function should concatenate `basePath + "/" + path` to create absolute image URLs
- Export the function for use in Astro components

**Code Changes** (filled by Developer):

```diff
--- a/src/lib/urls.ts
+++ b/src/lib/urls.ts
@@ -7,6 +7,18 @@ export const basePath = '/Dashuka';
 export function withBase(path: string): string {
   return basePath + path;
 }

+// Image path helper: prepends base path to static asset URLs
+// Image resolution works across all URL depth levels (homepage, category, album)
+// Validates input to prevent silent 404 errors from malformed data
+export function imagePath(path: string): string {
+  if (!path || typeof path !== 'string') {
+    throw new Error(`imagePath requires non-empty string, got: ${path}`);
+  }
+  if (path.startsWith('/')) {
+    throw new Error(`imagePath requires relative path without leading "/", got: ${path}`);
+  }
+  return basePath + '/' + path;
+}
+
 // Remove base path from a full URL
```

### Milestone 2: Update AlbumCard Component

**Files**: `src/components/AlbumCard.astro`

**Requirements**:

- Import `imagePath` from `../lib/urls`
- Replace `src={album.cover}` with `src={imagePath(album.cover)}`

**Acceptance Criteria**:

- Album cover images load correctly on homepage (`/Dashuka/`)
- Album cover images load correctly on category pages (`/Dashuka/category/dogs/`)

**Tests**:

- **Test files**: None (manual verification in browser)
- **Test type**: Skip - visual component requiring browser render
- **Backing**: user-specified
- **Skip reason**: Static site with no test framework, manual browser verification

**Code Intent**:

- Add import for `imagePath` from `../lib/urls`
- Modify `<img>` tag to use `imagePath(album.cover)` instead of `album.cover`

**Code Changes** (filled by Developer):

```diff
--- a/src/components/AlbumCard.astro
+++ b/src/components/AlbumCard.astro
@@ -3,6 +3,7 @@
 // WHY hover effects: Enhances UX, provides visual feedback, matches reference portfolio design

 import { albumUrl } from '../lib/urls';
+import { imagePath } from '../lib/urls';

 interface Album {
 	id: string;
@@ -29,7 +30,7 @@ const { album } = Astro.props;
 				WHY group-hover:scale-105: Slight zoom on hover for visual feedback
 				WHY transition-transform duration-300: Smooth animation, not jarring
 			-->
-			<img
-				src={album.cover}
+			<img src={imagePath(album.cover)}
 				alt={album.title}
 				class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
 			/>
```

### Milestone 3: Update PhotoGrid Component

**Files**: `src/components/PhotoGrid.astro`

**Requirements**:

- Import `imagePath` from `../lib/urls`
- Replace `src={photo}` with `src={imagePath(photo)}`

**Acceptance Criteria**:

- Photos load correctly on album detail pages (`/Dashuka/album/darcy/`)

**Tests**:

- **Test files**: None (manual verification in browser)
- **Test type**: Skip - visual component requiring browser render
- **Backing**: user-specified
- **Skip reason**: Static site with no test framework, manual browser verification

**Code Intent**:

- Add import for `imagePath` from `../lib/urls`
- Modify `<img>` tag in map function to use `imagePath(photo)` instead of `photo`

**Code Changes** (filled by Developer):

```diff
--- a/src/components/PhotoGrid.astro
+++ b/src/components/PhotoGrid.astro
@@ -1,5 +1,8 @@
 ---
+// Base path prefix required for correct image resolution on nested URLs
+import { imagePath } from '../lib/urls';
+
 // WHY PhotoGrid.astro: Masonry-style photo grid layout with lazy loading for album pages
 // WHY CSS columns: True masonry layout where items flow vertically like Pinterest
 // WHY lazy loading: Reduces initial page load, defers offscreen images until needed
@@ -23,7 +26,7 @@ const { photos, albumTitle } = Astro.props;
 			<div class="break-inside-avoid group relative overflow-hidden rounded-lg bg-white/5">
 				<!-- WHY loading="lazy": Defer loading offscreen images -->
 				<!-- WHY decoding="async": Prevents blocking main thread -->
-				<img
-					src={photo}
+				<img src={imagePath(photo)}
 					alt={`${albumTitle} - фото ${index + 1}`}
 					loading="lazy"
 					decoding="async"
```

### Milestone 4: Update Category Page Inline Images

**Files**: `src/pages/category/[id].astro`

**Requirements**:

- Import `imagePath` from `../../lib/urls`
- Replace `src={album.cover}` with `src={imagePath(album.cover)}`

**Acceptance Criteria**:

- Album cover images load correctly on category pages (`/Dashuka/category/dogs/`, `/Dashuka/category/nature/`, etc.)

**Tests**:

- **Test files**: None (manual verification in browser)
- **Test type**: Skip - visual component requiring browser render
- **Backing**: user-specified
- **Skip reason**: Static site with no test framework, manual browser verification

**Code Intent**:

- Add import for `imagePath` from `../../lib/urls`
- Modify inline `<img>` tag to use `imagePath(album.cover)` instead of `album.cover`

**Code Changes** (filled by Developer):

```diff
--- a/src/pages/category/[id].astro
+++ b/src/pages/category/[id].astro
@@ -1,5 +1,6 @@
 ---
 import Layout from '../../layouts/Layout.astro';
+import { imagePath } from '../../lib/urls';
 import { albumUrl } from '../../lib/urls';

 // WHY [id].astro: Dynamic route for category pages with filtered albums
@@ -67,8 +68,7 @@ const albums = albumModules
 									<a href={albumUrl(album.id)} class="block">
 										<div class="aspect-[4/3] overflow-hidden bg-white/5">
-											<img
-												src={album.cover}
+											<img src={imagePath(album.cover)}
 												alt={album.title}
 												class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
 											/>
```

### Milestone 5: Documentation

**Delegated to**: @agent-technical-writer (mode: post-implementation)

**Source**: `## Invisible Knowledge` section of this plan

**Files**:

- `src/lib/CLAUDE.md` (index updates)
- `src/lib/README.md` (invisible knowledge)

**Requirements**:

Delegate to Technical Writer. For documentation format specification:

<file working-dir=".claude" uri="conventions/documentation.md" />

Key deliverables:
- CLAUDE.md: Pure navigation index (tabular format)
- README.md: Invisible knowledge (architecture diagram, invariants)

**Acceptance Criteria**:

- CLAUDE.md is tabular index only (no prose sections)
- README.md exists in `src/lib/` with architecture diagram showing URL handling
- README.md is self-contained (no external references)

**Source Material**: `## Invisible Knowledge` section of this plan

## Milestone Dependencies

```
M1 (imagePath helper)
   |
   +--> M2 (AlbumCard)
   |
   +--> M3 (PhotoGrid)
   |
   +--> M4 (Category page)
         |
         v
      M5 (Documentation)
```

M2, M3, M4 can execute in parallel after M1 completes. M5 requires all implementation milestones complete.
