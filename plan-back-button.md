# Fix Back to Category Button - Base Path Handling

## Overview

The "back to category" button on album pages creates links without accounting for the base path `/Dashuka/` configured in `astro.config.mjs`. This causes 404 errors when clicked because the link resolves to `/category/nature` instead of `/Dashuka/category/nature`.

The project uses a centralized URL generation system at `src/lib/urls.ts` with a `categoryUrl()` function that properly handles base paths. Navigation.astro and AlbumCard.astro use this pattern. After fix: album page uses centralized URL generation pattern, consistent with Navigation.astro and AlbumCard.astro.

## Planning Context

### Decision Log

| Decision | Reasoning Chain |
| ---------- | --------------- |
| Use existing `categoryUrl()` helper | Navigation.astro and AlbumCard.astro use `src/lib/urls.ts` functions -> consistent pattern across codebase -> single source of truth for base path handling |
| No new infrastructure needed | `urls.ts` exports `categoryUrl(id: string)` -> simply import and use -> Single function call, no new infrastructure |
| Manual testing only | Static site with no backend -> URL fix can be verified by clicking the link -> no unit/integration tests needed for this one-line change |

### Rejected Alternatives

| Alternative | Why Rejected |
| ------------ | ------------- |
| Inline `import.meta.env.BASE_URL` | Duplicates logic already in `urls.ts`, creates inconsistency |
| Astro `<Link>` component | Different pattern than rest of codebase, adds dependency on component import |
| Relative paths | Less clear, harder to maintain when directory structure changes |

### Constraints & Assumptions

- Technical: Astro framework with TypeScript, base path configured as `/Dashuka`
- Existing patterns: `src/lib/urls.ts` is the authoritative source for URL generation
- No test framework is configured for this project
- Manual testing via `npm run dev` and `npm run build` is sufficient for verification

### Known Risks

| Risk | Mitigation | Anchor |
| ------------ | ------------- | -------- |
| Base path mismatch | `urls.ts` hardcodes `basePath = '/Dashuka'` matching `astro.config.mjs` | `src/lib/urls.ts` |

## Invisible Knowledge

### Why Centralized URL Generation

The project uses a centralized URL generation module (`src/lib/urls.ts`) to prevent 404 errors from missing base paths. Astro's `base` configuration in `astro.config.mjs` requires all internal links to include the base path prefix. Hard-coded paths like `/category/nature` fail when the site is deployed to a subdirectory (e.g., `github.io/repository/`).

The `urls.ts` module provides type-safe functions (`categoryUrl()`, `albumUrl()`, `homeUrl()`) that automatically prepend the base path. This ensures consistency across all components and makes the URL structure explicit.

### Data Flow

```
Album Page renders
  → Reads album.category (e.g., "nature")
  → Looks up category by ID
  → Calls categoryUrl(category.id)
  → Returns "/Dashuka/category/nature"
  → User clicks link → Correct page loads
```

## Milestones

### Milestone 1: Fix Album Page Back Button

**Files**: `src/pages/album/[id].astro`

**Flags**:
- `conformance`: Import categoryUrl from src/lib/urls.ts and use categoryUrl(id) for all category links

**Requirements**:

- Import `categoryUrl` function from `src/lib/urls.ts`
- Back button link uses `categoryUrl(category.id)` for base path handling

**Acceptance Criteria**:

- Album page renders with "back to category" button
- Clicking the button navigates to the correct category page (no 404)
- Generated link includes `/Dashuka/` prefix

**Tests**:

- **Test type**: Manual verification
- **Backing**: user-specified
- **Scenarios**:
  - Normal: Navigate to any album page, click back button, verify category page loads
  - Build: Run `npm run build`, check generated HTML for correct paths

**Code Intent**:

- Import statement: `import { categoryUrl } from '../../lib/urls';` at the top of the frontmatter section
- Import path '../../lib/urls' is relative from src/pages/album/ directory. For components at other levels, adjust path accordingly.
- Back button link: `href={categoryUrl(category.id)}`

## Milestone Dependencies

```
M1 (Fix Album Page)
```

Single milestone plan - no dependencies.
