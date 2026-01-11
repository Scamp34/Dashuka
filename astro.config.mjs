import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// WHY Astro over Jekyll: Better image optimization with automatic avif/webp conversion
// WHY @astrojs/tailwind: Rapid modern UI development without custom CSS
// WHY build.format: 'directory': Clean URLs without .html extensions (SEO + UX)
// WHY vite.build.assetsInlineLimit: 0: Prevents image inlining, ensures separate optimized files
export default defineConfig({
  site: 'https://scamp34.github.io',
  base: '/Dashuka',
  integrations: [tailwind()],
  build: {
    format: 'directory',
  },
  vite: {
    build: {
      assetsInlineLimit: 0,
    },
  },
  image: {
    // WHY: Automatic optimization for all images - critical for photo portfolio performance
    // Generates responsive sizes, converts to modern formats (avif/webp)
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
  },
});
