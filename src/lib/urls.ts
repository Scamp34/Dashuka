// WHY urls.ts: Centralized URL generation with base path support
// Prevents 404 errors by ensuring all URLs include the configured base path
// WHY single source of truth: Base path changes only need to be made here

// Base path from Astro config - matches astro.config.mjs base: '/Dashuka'
export const basePath = '/Dashuka';

// Prepend base path to any relative URL
// WHY: Generic URL builder for any route
export function withBase(path: string): string {
  return basePath + path;
}

// Remove base path from a full URL
// WHY: Needed for active menu highlighting - Astro.url.pathname includes base path
export function stripBase(path: string): string {
  if (basePath && path.startsWith(basePath)) {
    const stripped = path.slice(basePath.length);
    return stripped || '/';
  }
  return path;
}

// Type-safe URL builders for common routes
// WHY: Prevent typos, provide autocomplete, make URL structure explicit

export function homeUrl(): string {
  return basePath + '/';
}

export function categoryUrl(id: string): string {
  return basePath + '/category/' + id;
}

export function albumUrl(id: string): string {
  return basePath + '/album/' + id;
}
